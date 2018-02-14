
require('dotenv').config()

var ApolloClient = require('apollo-client').ApolloClient;
var  HttpLink  = require('apollo-link-http').HttpLink;
var  InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
var fetch = require('node-fetch');
var gql = require('graphql-tag');
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


doAuth().then(auth=>{

    const client = new ApolloClient({
        link: new HttpLink({ uri: baseUrl+'/graphql',fetch:fetch, headers:{ authorization:"Bearer "+auth}}),
        cache: new InMemoryCache()
    });
      
    const q = gql`{ users{name}}`;
      
    client.query({ query: q }).then(console.log);
      
});

/*
require('dotenv').config()
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  insecureAuth: true
});
 
connection.connect();
 
connection.query('SELECT surname FROM klienti', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].surname);
});
 
connection.end();
*/

