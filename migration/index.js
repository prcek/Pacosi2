
require('dotenv').config()

var ApolloClient = require('apollo-client').ApolloClient;
var  HttpLink  = require('apollo-link-http').HttpLink;
var  InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
var fetch = require('node-fetch');
var gql = require('graphql-tag');
var moment = require('moment');
var lodash = require('lodash');
const pMap = require('p-map');
var mysql      = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    insecureAuth: true
});
   
db.connect();

const baseUrl="http://localhost:4001";

function doAuth() {
    
    return new Promise(function(resolve, reject) {

        fetch(baseUrl+"/auth/login",{
            method:'POST',
            body:JSON.stringify({login:process.env.GQL_USER,password:process.env.GQL_PASSWORD}), 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => resp.json()).then(data=>{
            if (data.auth_ok) {
                resolve(data.auth_token);
            } else {
                resolve(null);
            }
        })
    
    });
}

const AddClient = gql`
    mutation AddClient($surname: String!, $name: String, $phone: String, $comment: String, $location_id: ID!, $old_id:String!) {
        add_doc: addClient(surname:$surname,name:$name,phone:$phone,comment:$comment,location_id:$location_id, old_id:$old_id) {
            id
        }
    }
`;


const UpdateClient = gql`
    mutation UpdateClient($id: ID!, $surname: String!, $name: String, $phone: String, $comment: String) {
        update_doc: updateClient(id:$id,surname:$surname,name:$name,phone:$phone,comment:$comment) {
            id
        }
    }
`;

const FindClient = gql`
    query ClientId($old_id: String!) {
        clientOld(old_id:$old_id) {
            id
        }
    }
`;


const SubmitNewLesson = gql`
    mutation SubmitNewLesson($lesson_type_id: ID!, $capacity: Int!, $datetime: DateTime!) {
        addLesson(lesson_type_id:$lesson_type_id,capacity:$capacity,datetime:$datetime) {
            id
        }
    }
`;

const LessonsInfo = gql`
  query LessonsInfo($lesson_type_id: ID! $lesson_date: Date!) {
    lessonsInfo(lesson_type_id:$lesson_type_id, date:$lesson_date) {
      id,datetime,members_count,capacity
    }
  }
`;


const LessonInfo = gql`
  query LessonInfo($lesson_id: ID!) {
    lessonInfo(id:$lesson_id) {
        id,datetime,capacity,members {
            id,presence,comment,payment,client {
              id,name,surname,phone,no
            } created_at
        }
        lesson_type {
            name
            location {
              name
            }
        }
    }
  }
`;


const AddLessonMember = gql`
    mutation AddLessonMember($lesson_id: ID!, $client_id: ID!, $payment: Payment!, $comment:String) {
        add_doc: addLessonMember(lesson_id:$lesson_id,client_id:$client_id,payment:$payment, comment:$comment) {
            id
        }
    }
`;

const LookupClient = gql`
    query LookupClient($location_id:ID!, $text:String!) {
        clientsLookup(text:$text,location_id:$location_id, limit:10) {
            id, surname, phone
        }
    }
`;

const AddMassageOrder = gql`
    mutation AddMassageOrder($massage_room_id: ID! $massage_type_id: ID! $begin: DateTime!, $client_id: ID!, $comment: String,  $payment: Payment!) {
        addMassageOrder(massage_room_id:$massage_room_id, massage_type_id:$massage_type_id, begin:$begin,client_id:$client_id, comment:$comment, payment:$payment) {
            id
        }
    }
`;

const MassageOrders = gql`
    query MassageOrders($massage_room_id:ID!, $date: Date!) { 
	    massageRoomDayPlan(massage_room_id:$massage_room_id, date:$date) {
            massage_orders {
                id, client_id, begin
            }
	    } 
    }
`;

const MassageOT = gql`
    query MassageOT($massage_room_id:ID!, $date: Date!) { 
	    massageRoomDayPlan(massage_room_id:$massage_room_id, date:$date) {
            opening_times {
                id,  begin, end
            }
	    } 
    }
`;

const AddOpeningTime = gql`
    mutation AddOpeningTime($massage_room_id: ID! $begin: DateTime!, $end: DateTime!) {
        addOpeningTime(massage_room_id:$massage_room_id,begin:$begin,end:$end) {
            id
        }
    }
`;

const AddOrder = gql`
    mutation AddOrder($user_id: ID!, $order_item_id:ID!, $customer_name: String, $count: Int!, $total_price:Int!, $date:Date!) {
        add_doc: addOrder(user_id:$user_id,order_item_id:$order_item_id,customer_name:$customer_name,count:$count,total_price:$total_price,date:$date) {
            id
        }
    }
`;


const vinicni_location_id = "5a32971b1457d41625d242bc";


function findClient(client,c) {
    return new Promise(function(resolve, reject){
        client.query({query:FindClient, variables:{old_id:"vinicni_"+c.id}}).then(res=>{
            console.log("find res",res.data.clientOld);
            resolve(res.data.clientOld);
        })
    }); 
}


function importClient(client,c) {
    return new Promise(function(resolve, reject){
        console.log("import client",c);

        findClient(client,c).then(cc=>{
            if (cc) {
                client.mutate({mutation:UpdateClient, variables:{
                    id: cc.id,
                    surname:c.surname?c.surname:"-",
                    name:c.name,
                    phone:c.phone,
                }}).then(r=>{
                    console.log(r);
                    resolve("ok update");
                })
            } else {
                client.mutate({mutation:AddClient, variables:{
                    surname:c.surname?c.surname:"-",
                    name:c.name,
                    phone:c.phone,
                    old_id: "vinicni_"+c.id,
                    location_id:vinicni_location_id,
                }}).then(r=>{
                    console.log(r);
                    resolve("ok insert");
                })
            }
        })

    });
}


function findLesson(client,l,lid) {
    return new Promise(function(resolve, reject){
        client.query({query:LessonsInfo, variables:{
            lesson_type_id: lid,
            lesson_date: moment(l.date).format("YYYY-MM-DD")
        }}).then(r=>{
            const les = lodash.find(r.data.lessonsInfo,{'datetime':moment(l.date).toISOString()});
            resolve(les);
        })
    });
}

function importLesson(client,l,lid) {
    return new Promise(function(resolve, reject){

        findLesson(client,l,lid).then(les=>{
            if (!les) {
                client.mutate({mutation:SubmitNewLesson,variables:{
                    lesson_type_id: lid,
                    capacity: l.capacity, 
                    datetime: l.date
                }}).then(r=>{
                    resolve("ok insert")
                })
            } else {
                resolve("skip");
            }
        })


    });
}

function getLessonMembers(client,lesson_id) {
    return new Promise(function(resolve, reject){

        client.query({query:LessonInfo, variables:{lesson_id:lesson_id}, fetchPolicy:"network-only"}).then(res=>{
            resolve(res.data.lessonInfo.members.map(lm=>{return lm.client}));
        })
        
    });
}

function importLessonMember(client,lm,lid) { 
    return new Promise(function(resolve, reject){
        findClient(client,{id:lm.klient_id}).then(c=>{
            if (c) {
                findLesson(client,{date:lm.date},lid).then(l=>{
                    if (l) {
                        getLessonMembers(client,l.id).then(lms=>{
                            if (lodash.find(lms,{'id':c.id})) {
                                resolve("skip dupl");
                            } else {
                        
                                client.mutate({mutation:AddLessonMember,variables:{
                                    lesson_id: l.id,
                                    client_id:c.id,
                                    payment: "NOT_PAID",
                                }}).then(res=>{
                                    console.log(res);
                                    resolve("ok");
                                })
                                
                            }
                        }) 
                    } else {
                        resolve("skip no lesson")
                    }
                })
            } else {
                resolve("skip no client");
            }
            
        })
    });
}

function findClientByName(client,surname,phone) {
    return new Promise(function(resolve, reject){

        if (phone && phone !=="")  {
            client.query({query:LookupClient,variables:{text:phone,location_id:vinicni_location_id}}).then(res=>{
                if (res.data.clientsLookup.length == 1) {
                    resolve(res.data.clientsLookup[0]);
                } else {
                    if (surname && surname !=="") { 
                        client.query({query:LookupClient,variables:{text:surname,location_id:vinicni_location_id}}).then(res=>{
                            if (res.data.clientsLookup.length == 1) {
                                resolve(res.data.clientsLookup[0]);
                            } else {
                                resolve(null);
                            }
                        })
                    } else {
                        resolve(null);
                    }
                }
            })
        } else if (surname && surname !=="") {
            client.query({query:LookupClient,variables:{text:surname,location_id:vinicni_location_id}}).then(res=>{
                if (res.data.clientsLookup.length == 1) {
                    resolve(res.data.clientsLookup[0]);
                } else {
                    resolve(null);
                }
            })
        } else {
            resolve(null);
        }

        
    });
}

function getMassageTypeID(typ) {
    switch(typ) {
        case 1: /*Klasická masáž za a šíje*/ return "5a859501f559497fb68dc879";
        case 2: /*Klasická masáž zad, šíje, HK, DK*/ return "5a86a6cfad32cb0005c57c1c";
        case 3: /*Lávové kameny (záda, šíje)*/ return "5a86a6ffad32cb0005c57c1d";
        case 4: /*Lávové kameny (záda, šíje,HK, DK*/ return "5a86a739ad32cb0005c57c1e";
        case 5: /*Lymfatická masáž DK*/ return "5a86a750ad32cb0005c57c1f";
        case 6: /*Sportovní masáž DK*/ return "5a86a75dad32cb0005c57c20";
        case 7: /*Reflexní masáž chodidel*/ return "5a86a767ad32cb0005c57c21";
        case 8: /*Reflexní masáž chodidel+masáž z*/ return "5a86a790ad32cb0005c57c22";
        case 9: /*Celková masáž (záda,šíje,HK,DK,h*/ return "5a86a7c2f75877000579fcae";
        default: return null;
    }
}

function getMassageMembers(client,mid,date) {
    console.log("getMassageMembers",mid,date);
    return new Promise(function(resolve, reject){
        client.query({query:MassageOrders,variables:{
            massage_room_id:mid,
            date: date
        },fetchPolicy:"network-only"}).then(res=>{
           // console.log(res.data.massageRoomDayPlan.massage_orders);
            resolve(res.data.massageRoomDayPlan.massage_orders)
        });
    });
}

function getMassageOT(client,mid,date) {
    console.log("getMassageMembers",mid,date);
    return new Promise(function(resolve, reject){
        client.query({query:MassageOT,variables:{
            massage_room_id:mid,
            date: date
        },fetchPolicy:"network-only"}).then(res=>{
           // console.log(res.data.massageRoomDayPlan.massage_orders);
            resolve(res.data.massageRoomDayPlan.opening_times)
        });
    });
}


function importMassageMember(client,m,mid) {
    

    return new Promise(function(resolve, reject){
        findClientByName(client,m.prijmeni,m.telefon).then(cl=>{
            const mtid = getMassageTypeID(m.typ);
            
            if (cl && mtid) {
                getMassageMembers(client,mid,moment(m.zacatek).format("YYYY-MM-DD")).then(mms=>{

                    if (lodash.find(mms,{'client_id':cl.id,'begin':moment(m.zacatek).toISOString()})) {
                        resolve("skip");
                    } else {
                        
                        client.mutate({mutation:AddMassageOrder,variables:{
                            massage_room_id: mid,
                            massage_type_id: mtid,
                            begin: moment(m.zacatek).toISOString(),
                            client_id:  cl.id,
                            comment: m.popis,
                            payment: "NOT_PAID"
                        }}).then(res=>{
                            console.log(res);
                            resolve("ok");
                        })

                    }
                   
                });
                
                
            } else {
                resolve("missing client or mtid")
            }
        })
       
    });
}


function importMassageOT(client,ot,mid) {
    

    return new Promise(function(resolve, reject){
        console.log(ot);
        const day = moment(ot.zacatek).format("YYYY-MM-DD");
        getMassageOT(client,mid,day).then(ots=>{

            if (lodash.find(ots,{'begin':moment(ot.zacatek).toISOString()})) {
                resolve("skip - dupl");
            } else {
                client.mutate({mutation:AddOpeningTime,variables:{
                    massage_room_id:mid,
                    begin:moment(ot.zacatek).toISOString(),
                    end:moment(ot.konec).toISOString()
                }}).then(res=>{
                    console.log(res);
                    resolve("ok");
                })

              
            }

        })


    });
}

function getDoctorID(id) {
    switch(id) {
        case 1: /*Spodenejko*/ return "5a5731507e6b6628f6ef74ca"
        case 2: /*Strmiska*/ return "5a3bdea57b930262f4bf8b7c"
        case 3: /*Koukal*/ return "5a2fc2f43e9e2bf85728cb94"
        case 4: /*Toufarová-Dudysová*/ return "5a6a5e957685fa026a143ea9"
        case 5: /*FT*/ return "5a2fc15916147af831e9e9c4"
        case 6: /*Evidence*/ return "5a3bdf147b930262f4bf8b7e"
        default: return null;
    }
}

function getOrderItemID(id) {
    switch(id) {
        case 1: /*laserová sonda*/ return "5a87009267af3bc899206aef";
        case 2: /*laserová sprcha*/ return "5a87009c67af3bc899206af0";
        case 3: /*masáže*/ return "5a8700a467af3bc899206af1";
        case 4: /*Pilates*/ return "5a8700aa67af3bc899206af2";
        case 5: /*kondiční cvičení*/ return "5a8700b267af3bc899206af3";
        case 6: /*DP 500*/ return "5a8700b967af3bc899206af4";
        case 7: /*DP 1000*/ return "5a8700c167af3bc899206af5";
        case 8: /*DP 1500*/ return "5a8700c767af3bc899206af6";
        case 9: /*DP 2000*/ return "5a8700cd67af3bc899206af7";
        case 10: /*faktura - KARTA*/ return "5a8700d367af3bc899206af8";
        case 11: /*biolampa*/ return "5a8700da67af3bc899206af9";
        case 12: /*SM Systém*/ return "5a8700df67af3bc899206afa";
        case 13: /*DP klasická masáž*/ return "5a8700e667af3bc899206afb";
        case 14: /*DP Lávové kameny*/ return "5a8700ed67af3bc899206afc";
        case 15: /*DP reflexní masáž nohou*/ return "5a8700f667af3bc899206afd";
        default: return null;
    }

}
function importOrder(client,o) {
    return new Promise(function(resolve, reject){
        console.log(o);
        const doc_id = getDoctorID(o.doctor_id);
        if (!doc_id) {
            resolve("missing doc_id");
            return;
        }
        const item_id = getOrderItemID(o.type_id);
        if (!item_id) {
            resolve("missing item_id");
            return;
        }
        client.mutate({mutation:AddOrder,variables:{
            user_id: doc_id,
            order_item_id: item_id,
            customer_name:  o.user,
            count: o.count,
            total_price: o.cost,
            date: moment(o.created).format("YYYY-MM-DD")
            //$user_id: ID!, $order_item_id:ID!, $customer_name: String, $count: Int!, $total_price:Int!, $date:Date!
        }}).then(res=>{
            console.log(res);
            resolve("ok")
        })
        
    });
}

doAuth().then(auth=>{

    const client = new ApolloClient({
        link: new HttpLink({ uri: baseUrl+'/graphql',fetch:fetch, headers:{ authorization:"Bearer "+auth}}),
        cache: new InMemoryCache()
    });

/*
    db.query('SELECT * FROM klienti WHERE deleted = 0', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);

        pMap(results,(c)=>importClient(client,c),{concurrency:1}).then((x)=>{
            console.log("import done",x);
            db.end();
        })

    });
*/
/*
    //vinicni typy lekci 0 - pilates, 1 nic, 2 SM, 3 kondicni
    //id lekci na vinicni - 5a577a58acd47934f62bc44b pilates, 5a57702ca94ea133ed2e4b97 sm, 
    db.query('SELECT * FROM lekce WHERE typ = 2', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);

        pMap(results,(l)=>importLesson(client,l,"5a57702ca94ea133ed2e4b97"),{concurrency:1}).then((x)=>{
            console.log("import done",x);
            db.end();
        })
        
    });
*/


/*
    db.query('SELECT z.klient_id, l.date, z.attend, l.typ FROM `zapis` AS z  LEFT JOIN lekce   AS l ON l.id =z.lekce_id WHERE l.typ=2 ',  function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);

        pMap(results,(lm)=>importLessonMember(client,lm,"5a57702ca94ea133ed2e4b97"),{concurrency:1}).then((x)=>{
            console.log("import done",x);
            db.end();
        })

    });
*/

/*
    //massage_room_id - vinicni - 5a577e50e29c8736e844806a
    db.query('SELECT * FROM masaze ', function (error, results, fields) {
        if (error) throw error;
        //console.log('The solution is: ', results);

        pMap(results,(l)=>importMassageMember(client,l,"5a577e50e29c8736e844806a"),{concurrency:1}).then((x)=>{
            console.log("import done",x);
            db.end();
        })
        
    });
*/

/*
    //massage_room_id - vinicni - 5a577e50e29c8736e844806a
    db.query('SELECT * FROM masaze_plan  ', function (error, results, fields) {
        if (error) throw error;
        //console.log('The solution is: ', results);

        pMap(results,(ot)=>importMassageOT(client,ot,"5a577e50e29c8736e844806a"),{concurrency:1}).then((x)=>{
            console.log("import done",x);
            db.end();
        })
        
    });
*/
/*

    db.query('SELECT * FROM permanentky  ', function (error, results, fields) {
        if (error) throw error;
        //console.log('The solution is: ', results);

        pMap(results,(ot)=>importOrder(client,ot),{concurrency:1}).then((x)=>{
            console.log("import done",x);
            db.end();
        })
        
    });
  */
  
  db.end();
/*
    findClientByName(client,"Létal","548534630").then(x=>{
        console.log(x);
        db.end();
    })
*/


});


