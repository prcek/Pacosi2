
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
var db_v = mysql.createConnection({
    host     : 'localhost',
    user     : process.env.V_DB_USER,
    password : process.env.V_DB_PASSWORD,
    database : process.env.V_DB_NAME,
    insecureAuth: true
});

var db_d = mysql.createConnection({
    host     : 'localhost',
    user     : process.env.D_DB_USER,
    password : process.env.D_DB_PASSWORD,
    database : process.env.D_DB_NAME,
    insecureAuth: true
});

var client = null;
//const baseUrl="https://pacosi.herokuapp.com";
const baseUrl="http://localhost:4001";

const vinicni_location_id = "5a32971b1457d41625d242bc";
const dobrovskeko_location_id ="5a32972d1457d41625d242bd";

const vinicni_massage_room_id = "5a577e50e29c8736e844806a";
const dobrovskeho_massage_room_id = "5a577e13f030d936aa058f2e";


function task_disconnect() {
    db_v.end();
    db_d.end();
    return "ok";
}

function task_connect() {
    return new Promise(function(resolve, reject) {
        db_v.connect();
        db_d.connect();

        
        fetch(baseUrl+"/auth/login",{
            method:'POST',
            body:JSON.stringify({login:process.env.GQL_USER,password:process.env.GQL_PASSWORD}), 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => resp.json()).then(data=>{
            if (data.auth_ok) {
                client = new ApolloClient({
                    link: new HttpLink({ uri: baseUrl+'/graphql',fetch:fetch, headers:{ authorization:"Bearer "+data.auth_token}}),
                    cache: new InMemoryCache()
                });
                resolve("ok");
            } else {
                reject("can't auth")
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
    mutation AddLessonMember($lesson_id: ID!, $client_id: ID!, $payment: Payment!, $comment:String,$presence:Boolean) {
        add_doc: addLessonMember(lesson_id:$lesson_id,client_id:$client_id,payment:$payment, comment:$comment, presence:$presence) {
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




function findClient(c,loc_prefix) {
    return new Promise(function(resolve, reject){
        client.query({query:FindClient, variables:{old_id:loc_prefix+c.id}}).then(res=>{
            console.log("find res",res.data.clientOld);
            resolve(res.data.clientOld);
        })
    }); 
}


function importClient(c,location_id,loc_prefix) {
    return new Promise(function(resolve, reject){
        console.log("import client",c);

        findClient(c,loc_prefix).then(cc=>{
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
                    old_id: loc_prefix+c.id,
                    location_id:location_id,
                }}).then(r=>{
                    console.log(r);
                    resolve("ok insert");
                })
            }
        })

    });
}


function findLesson(l,lid) {
    return new Promise(function(resolve, reject){
        client.query({query:LessonsInfo, variables:{
            lesson_type_id: lid,
            lesson_date: moment(l.date).utc().format("YYYY-MM-DD")
        }}).then(r=>{
            //console.log(r);
            const les = lodash.find(r.data.lessonsInfo,{'datetime':moment(l.date).toISOString()});
            resolve(les);
        })
    });
}

function importLesson(l,lt2id) {
    console.log("importLesson",l)
    return new Promise(function(resolve, reject){
        lid = lt2id(l.typ);
        if (!lid) {
            reject("can't find lessontype");
            return;
        }
        findLesson(l,lid).then(les=>{
            if (!les) {
                client.mutate({mutation:SubmitNewLesson,variables:{
                    lesson_type_id: lid,
                    capacity: l.capacity, 
                    datetime: l.date
                }}).then(r=>{
                    console.log("insert")
                    resolve("ok insert")
                })
            } else {
                console.log("skip")
                resolve("skip");
            }
        })


    });
}

function getLessonMembers(lesson_id) {
    return new Promise(function(resolve, reject){

        client.query({query:LessonInfo, variables:{lesson_id:lesson_id}, fetchPolicy:"network-only"}).then(res=>{

            resolve(res.data.lessonInfo.members.map(lm=>{return lm.client}));
        }).catch(err=>{
            console.log("getLessonMembers err!")
            reject(err);
        })
        
    });
}

function importLessonMember(lm,lt2id,loc_prefix) { 
    return new Promise(function(resolve, reject){
        console.log("importLessonMember",lm)
        findClient({id:lm.klient_id},loc_prefix).then(c=>{
            console.log("importLessonMember, findClient res",c)
            if (c) {
                //if (lm.typ == ) {
                //    resolve("no lesson typ - skip");
                //    return;
                //}
                lid = lt2id(lm.typ);
                if (!lid) {
                    console.log("can't find lessontype")
                    reject("can't find lessontype"+lm.typ);
                    return;
                }
                findLesson({date:lm.date},lid).then(l=>{
                    console.log("importLessonMember, findLesson res",l)
                    if (l) {
                        getLessonMembers(l.id).then(lms=>{
                            console.log("importLessonMember, getLessonMembers",lms)
                            if (lodash.find(lms,{'id':c.id})) {
                                resolve("skip dupl");
                            } else {
                                console.log("inserting new LessonMember");
                                const v = {
                                    lesson_id: l.id,
                                    client_id:c.id,
                                    presence: lm.attend === 1,
                                    payment: "PAID",
                                }
                                console.log("inserting new LessonMember",v);
                                client.mutate({mutation:AddLessonMember,variables:v}).then(res=>{
                                    console.log(res);
                                    resolve("ok");
                                }).catch(err=>{
                                    console.log("can't insert new lesson member",err);
                                    reject(err);
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

function findClientByName(location_id,surname,phone) {
    return new Promise(function(resolve, reject){

        if (phone && phone !=="")  {
            client.query({query:LookupClient,variables:{text:phone,location_id:location_id}}).then(res=>{
                if (res.data.clientsLookup.length == 1) {
                    resolve(res.data.clientsLookup[0]);
                } else {
                    if (surname && surname !=="") { 
                        client.query({query:LookupClient,variables:{text:surname,location_id:location_id}}).then(res=>{
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
            client.query({query:LookupClient,variables:{text:surname,location_id:location_id}}).then(res=>{
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

function vinicni_getMassageTypeID(typ) {
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


function dobrovskeho_getMassageTypeID(typ) {
    switch(typ) {
        case 1: /*Klasická masáž za a šíje*/ return "5a859501f559497fb68dc879";
        case 2: /*Klasická - HK a hýždě*/ return "5a319f0dfb88700c9ce3afaa"; 
        case 3: /*Klasická masáž zad, šíje, HK, DK*/ return "5a86a6cfad32cb0005c57c1c";
        case 4: /*Reflexní masáž chodidel*/ return "5a86a767ad32cb0005c57c21";
        case 5: /*Reflexní masáž chodidel+masáž z*/ return "5a86a790ad32cb0005c57c22";
        case 6: /*Lávové kameny (záda, šíje)*/ return "5a86a6ffad32cb0005c57c1d";
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
    console.log("getMassageOT",mid,date);
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

function comment2pay(c) {
    

    if (c.toLowerCase().match(/^placeno/)) { return 'PAID';}
    if (c.toLowerCase().match(/^hotovost/)) { return 'PAID';}
    if (c.toLowerCase().match(/^zaplaceno/)) { return 'PAID';}

    if (c.toLowerCase().match(/nezapla/)) { return 'NOT_PAID';}
    if (c.toLowerCase().match(/neplac/)) { return 'NOT_PAID';}

    if (c.toLowerCase().match(/^dár/)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/^dk /)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/^kk /)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/^kk-/)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/^dp /)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/^dp-/)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/^pouk/)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/poukaz/)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/^karta/)) { return 'VOUCHER';}
    if (c.toLowerCase().match(/perman/)) { return 'VOUCHER';}

    if (c.toLowerCase().match(/faktura/)) { return 'INVOICE';}

    switch (c) {
        case '':
        case 'ploska nohy 1 hod':
        case 'klasická masáž zad a šíje 30 min':
        case 'ˇobj.Viniční':
        case 'budou to lávové kameny nahřeje Kočí':
        case 'neobsazuj tento den':
        case 'omluvena 15:30':
        case 'přišla pozdě,propadlo':
        case 'akce léto':
        case 'pern.vybere masáže + kond.cv.':
        case 'Bublák':
        case '5+bazén akce léto':
        case 'obsazeno':
        case 'manžel':
        case '5+bazénakce léto':
        case 'akce léto +bazén':
        case 'akce léto 4+1':
        case '5+bazén':
        case 'akce léto 5+bazén':
        case 'akce 4+1':
        case 'akce léto+bazén':
        case 'bude chtit zaplatit akci 4+1':
        case '4+1':
        case 'Akce léto':
        case 'akce -léto':
        case 'FKSP':
        case ' FKSP':
        case 'FKSP náhrada za 18/1':
        case 'NET4GAS':
        case 'akce léto 5+1':
        case 'od MUDr. Dudysové':
        case 'akce léto náhrada':
        case 'klp 376':
        case 'zavřeno':
        case 'net 4 gas':
        case 'net4gas':
        case 'fksp':
        case 'fKSP':
        case 'rwe jen do konce března':
        case '4 gas':
        case 'domluvit jiný termín za 19.3.':
        case 'for4gas':
        case 'ned4gas':
        case 'dcera akce léto':
        case 'dcera-akce léto':
        case 'akce-léto':
        case 'akce leto':
        case 'FKSP + dolpatek 50 kč':
        case 'akce Léto':
        case ' akce léto':
        case 'akce léto-24.6.15':
        case 'akce léto-15.7.15':
        case 'akce léto 5.8.':
        case 'akce léto 5.8.16':
        case 'akce léto 12.8.16':
        case 'akce léto 10.8.16':
        case 'akce léto 10.8.16-':
            return '';
        case 'nezaplaceno':
        case 'nezaplaceno DK a hýždě':
        case 'neplaceno':
        case 'možná přijde později neplatí':
        case 'interní ambulance - neplaceno':
        case 'neplaceno+200kc':
        case 'neplaceno-nepřišel':
        case 'neplaceno-nepřišla':
        case 'nepl. - nepřišla':
        case 'Neplaceno, Nepřišla':
        case 'odmítá zaplatit, a vyhrožuje mi!':
        case 'nplaceno':
        case 'neplatí Kovaříková':
        case 'neplatí-Pozor':
        case 'akce léto-posl.masáž-bez kartičky':
        case 'neplatí Eva R.':
        case 'syn od Evy':
        case 'neplceno':
        case 'Zdarma-od E.Ryšavá':
            return 'NOT_PAID';
        case 'dárkový poukaz':
        case 'dárkový poukaz-obj.Viniční':
        case 'vystavit dárkový poukaz':
        case 'poukaz':
        case 'permanentka z viniční':
        case 'permanetka':
        case 'pernamentka':
        case 'permanentka':
        case 'poukaz-nepřišel bez omluvy':
        case 'zaplaceno poukazem':
        case 'dárkový pukaz':
        case 'dárkový poukasz':
        case 'Darkový poukaz':
        case 'pouzkaz':
        case 'dárková poukaz':
        case 'dárkový poukaz,doplatí 50 kč':
        case 'poukaz+100kc doplatek':
        case 'karta klienta':
        case 'karta klienta+doplatek':
        case ' dárkový pokaz':
        case 'Poukaz':
        case 'Karta Klienta':
        case 'Karta klienta':
        case 'Poukaz 11.':
        case 'dárkový pokaz':
        case 'dárk.poukaz+doplaceno':
        case 'dárkový poukaz anglicky mluvící':
        case 'dár. poukaz':
        case 'dárkový poukaz+50 kč doplatek':
        case 'dárkový pouákaz':
        case 'dár. pouk.':
        case 'dárkový pouka':
        case 'poukaz (poukaz do 7.1.,prodloužen)':
        case 'dárkový poukaz (Viniční)':
        case 'placeno 4.4.':
        case 'dárkový poukaz na Viniční 11.3.':
        case 'pdárkový poukaz':
        case 'proběhlo 19.6. karta':
        case 'kartu klienta':
        case 'KK proběhlo 27.11.':
        case 'proběhlo 15.1.':
        case 'DP':
        case 'DK':
        case 'darkový poukaz':
        case 'darovací poukaz':
        case 'pokaz':
        case ' DP-kl.masáž':
        case 'Akce léto perm.':
        case 'akce léto perm.':
        case 'pokaz-9.12.14':
        case 'akce léto-perm.':
        case 'DK 3.4.2015':
        case 'kata klienta-6.1.15':
        case 'Dpouzkaz':
        case 'Dpokaz':
        case 'DP-3.2.2016':
        case 'DP10/2015-tombola':
        case 'DP-15.12.15':
        case 'DP12/2015':
        case 'KK 12/2015':
        case 'KK':
        case 'Dp':
        case 'pokaz 13.4.16+doplatek 150,-JZ':
        case 'Dpopukaz':
        case 'K.Klienta':
        case 'KK06/2017':
        case 'FKSP-KK 20.12.16':
        case 'dp':
        case 'kk':
        case 'DD':
        case 'DD':
        case 'DP+doplatek':
        case 'KK07/2017':
        case 'KK12/2016':
        case 'DP11/2016 +doplatek':
        case 'DP19.12.16-50,-kč dopl-JZ':
        case 'DP12/2017':
        case 'DP+ doplatek 100 kc':
            return 'VOUCHER';
        case 'hrazeno':
        case 'zaplaceno':
        case 'placeno':
        case 'źaplaceno':
        case 'hotovost':
        case 'zaplaceno-hovost':
        case 'HOTOVOST':
        case 'Zaplaceno':
        case 'placebo':
        case 'letní akce zaplaceno':
        case 'placeno (klasická masáž DK)':
        case 'pĺaceno':
        case 'placeno-nepřišla':
        case 'placeno-hotovost':
        case 'Placeno':
        case 'placeno angl. mluvící':
        case 'placeno, bude chtít akci léto':
        case 'placene':
        case 'placeno-masírovala Marťa':
        case 'palceno':
        case 'plceno':
        case 'PLACENO':
        case 'placeno (29.2.)':
        case 'placeno proběhla 14.3.':
        case 'placeno 25.4.':
        case 'paceno':
        case 'palecno':
        case 'pleceno':
        case 'placemo':
        case 'proběhlo 19.6.':
        case 'proběhlo 19.6':
        case 'hotovost - doplatek 50,- k poukázce':
        case ' zaplaceno +  bazen zdarma':
        case 'hotost':
        case 'hovost':
        case 'htovost':
        case 'hotovst':
        case 'Hotovot':
        case 'hotovosz':
        case 'placeeno':
        case 'placno':
            return 'PAID';
        case 'vystavit dár.poukaz propl. faktura':
        case 'faktura':
        case 'pokaz-faktura':
            return 'INVOICE';
        default:
            return null;
    }
}

function importMassageMember(m,mid,location_id,typ2mtid) {
    

    return new Promise(function(resolve, reject){
        const pay = comment2pay(m.popis);
        if (pay===null) {
                            reject("????"+m.popis+"????");
                            return;
        }
        findClientByName(location_id,m.prijmeni,m.telefon).then(cl=>{
            const mtid = typ2mtid(m.typ);
            if (mtid===null) {
                reject("unknown massage typ"+m.typ);
                return;
            }

            if (cl && mtid) {
                getMassageMembers(client,mid,moment(m.zacatek).utc().format("YYYY-MM-DD")).then(mms=>{
                    console.log("getMassageMembers res",mms)
                    if (lodash.find(mms,{'client_id':cl.id,'begin':moment(m.zacatek).toISOString()})) {
                        resolve("skip");
                    } else {
                        const pay = comment2pay(m.popis);
                        if (pay===null) {
                            reject("????"+m.popis+"????");
                            return;
                        }
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
                console.log("can't find client:",m)
                resolve("missing client or mtid")
            }
        })
       
    });
}


function importMassageOT(ot,mid) {
    

    return new Promise(function(resolve, reject){
        console.log(ot);
        const day = moment(ot.zacatek).utc().format("YYYY-MM-DD");
        getMassageOT(client,mid,day).then(ots=>{

            if (lodash.find(ots,{'begin':moment(ot.zacatek).toISOString()})) {
                resolve("skip - dupl");
            } else {
                console.log("insert massage ot")
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

function vinicni_getOrderItemID(id) {
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

function dobrovskeho_getOrderItemID(id) {
    switch(id) {
        case 1: /*kryoterapie*/ return "5a9b20a9f1f103d3b2bf5882";
        case 2: /*laserová sprcha*/ return "5a87009c67af3bc899206af0";
        case 3: /*vířivka DKK*/ return "5a9b20baf1f103d3b2bf5884";
        case 4: /*Pilates*/ return "5a8700aa67af3bc899206af2";
        case 5: /*kondiční cvičení*/ return "5a8700b267af3bc899206af3";
        case 6: /*powerjoga*/ return "5a9b20d3f1f103d3b2bf5885";
        case 7: /*cvičení v těhotenství*/ return "5a9b20e5f1f103d3b2bf5886";
        case 8: /*masáže*/ return "5a9b20f4f1f103d3b2bf5887";
        case 9: /*DP 500*/ return "5a8700b967af3bc899206af4";
        case 10: /*DP 1000*/ return "5a8700c167af3bc899206af5";
        case 11: /*DP 1500*/ return "5a8700c767af3bc899206af6";
        case 12: /*DP 2000*/ return "5a8700cd67af3bc899206af7";
        case 13: /*DP klasická masáž*/ return "5a8700e667af3bc899206afb";
        case 14: /*DP Lávové kameny*/ return "5a8700ed67af3bc899206afc";
        case 15: /*DP reflexní masáž nohou*/ return "5a8700f667af3bc899206afd";
        default: return null;
    }
}

function importOrder(o,typ2otid) {
    return new Promise(function(resolve, reject){
        console.log(o);
        if (o.type_id === 0) {
            resolve("missing item_id");
            return;
        }
        const doc_id = getDoctorID(o.doctor_id);
        if (!doc_id) {
            resolve("missing doc_id");
            return;
        }
        const item_id = typ2otid(o.type_id);
        if (!item_id) {
            reject("missing item_id");
            return;
        }
        client.mutate({mutation:AddOrder,variables:{
            user_id: doc_id,
            order_item_id: item_id,
            customer_name:  o.user,
            count: o.count,
            total_price: o.cost,
            date: moment(o.created).utc().format("YYYY-MM-DD")
            //$user_id: ID!, $order_item_id:ID!, $customer_name: String, $count: Int!, $total_price:Int!, $date:Date!
        }}).then(res=>{
            console.log(res);
            resolve("ok")
        })
        
    });
}

/*
doAuth().then(auth=>{

    const client = new ApolloClient({
        link: new HttpLink({ uri: baseUrl+'/graphql',fetch:fetch, headers:{ authorization:"Bearer "+auth}}),
        cache: new InMemoryCache()
    });

*/




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
  
  //db.end();
/*
    findClientByName(client,"Létal","548534630").then(x=>{
        console.log(x);
        db.end();
    })
*/


//});


function task_import_clients(db,location_id,loc_prefix) {
    return new Promise(function(resolve, reject){
        db.query('SELECT * FROM klienti WHERE deleted = 0', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            
            pMap(results,(c)=>importClient(c,location_id,loc_prefix),{concurrency:1}).then((x)=>{
                console.log("import done",x);
                resolve("ok");
            })
        });
    });
}

function dob_lessontype2id(typ) {
    switch (typ) {
        case 0: return "5a7335de22757600057aab9a"; //pilates
        case 1: return "5a73365822757600057aab9b"; //joga
        case 2: return "5a9aa7b529afae0005c5472e"; //nepouzito
        case 3: return "5a3198f47c903e0b4b38c882"; //kondicni
        default: return null;
    }
}

function vin_lessontype2id(typ) {
    switch (typ) {
        case 0: return "5a577a58acd47934f62bc44b"; //pilates
        case 1: return "5a9aa75a29afae0005c5472d"; //nic
        case 2: return "5a57702ca94ea133ed2e4b97"; //sm
        case 3: return "5a3198f97c903e0b4b38c883"; //kondicni
        default: return null;
    }
}



function task_import_lessons(db,lessontype2id) {

    return new Promise(function(resolve, reject){
        db.query('SELECT * FROM lekce', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results);
            pMap(results,(l)=>importLesson(l,lessontype2id),{concurrency:1}).then((x)=>{
                resolve("ok");
            })
        });
    });
}


function task_import_lesson_members(db,lessontype2id,loc_prefix) {
    return new Promise(function(resolve, reject){
        db.query('SELECT z.id, z.klient_id, l.date, z.attend, l.typ FROM `zapis` AS z  LEFT JOIN lekce   AS l ON l.id =z.lekce_id WHERE l.typ=3',  function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results);

            pMap(results,(lm)=>importLessonMember(lm,lessontype2id,loc_prefix),{concurrency:1}).then((x)=>{
                console.log("import done",x);
                resolve("ok")
            })
        });
    });

}

function task_import_massage_plan(db,massage_room_id) {
    return new Promise(function(resolve, reject){ 
        db.query('SELECT * FROM masaze_plan  WHERE zacatek>"2018-01-01"', function (error, results, fields) {
            if (error) throw error;
            //console.log('The solution is: ', results);

            pMap(results,(ot)=>importMassageOT(ot,massage_room_id),{concurrency:1}).then((x)=>{
                console.log("import done",x);
                resolve("ok")
            })
            
        });
    });
}

function task_import_massage_member(db,massage_room_id,location_id,typ2mtid) {
    return new Promise(function(resolve, reject){
        db.query('SELECT * FROM masaze', function (error, results, fields) {
            if (error) throw error;
            //console.log('The solution is: ', results);
    
            pMap(results,(l)=>importMassageMember(l,massage_room_id,location_id,typ2mtid),{concurrency:1}).then((x)=>{
                console.log("import done",x);
                resolve("ok")
            })
            
        });
    });
}

function task_import_orders(db,typ2oid) {
    return new Promise(function(resolve, reject){ 
        db.query('SELECT * FROM permanentky  ', function (error, results, fields) {
            if (error) throw error;
            //console.log('The solution is: ', results);

            pMap(results,(ot)=>importOrder(ot,typ2oid),{concurrency:1}).then((x)=>{
                console.log("import done",x);
               resolve("ok");
            })
            
        });
    });

}

const pSeries = require('p-series');
const tasks = [
	() => task_connect(),
   // () => task_import_clients(db_d,dobrovskeko_location_id,"dob"),
  //  () => task_import_clients(db_v,vinicni_location_id,"vin"),
  //  () => task_import_lessons(db_d,dob_lessontype2id),
  //  () => task_import_lessons(db_v,vin_lessontype2id),
   // () => task_import_lesson_members(db_v,vin_lessontype2id,"vin"),
   // () => task_import_lesson_members(db_d,dob_lessontype2id,"dob"),
 //   () => task_import_massage_plan(db_v,vinicni_massage_room_id),
 //   () => task_import_massage_plan(db_d,dobrovskeho_massage_room_id),
//    () => task_import_massage_member(db_d,dobrovskeho_massage_room_id,dobrovskeko_location_id,dobrovskeho_getMassageTypeID),
  //  () => task_import_massage_member(db_v,vinicni_massage_room_id,vinicni_location_id,vinicni_getMassageTypeID),
 //   () => task_import_orders(db_v,vinicni_getOrderItemID),
 //   () => task_import_orders(db_d,dobrovskeho_getOrderItemID),
	() => task_disconnect(),
];

pSeries(tasks).then(result => {
	console.log(result);
});

