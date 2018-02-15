
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


    db.query('SELECT z.klient_id, l.date, z.attend, l.typ FROM `zapis` AS z  LEFT JOIN lekce   AS l ON l.id =z.lekce_id WHERE l.typ=0 LIMIT 1',  function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
        db.end();

    });

});


