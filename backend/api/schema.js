var  graphql_tool = require('graphql-tools');
const RootQuery = `
  type RootQuery {
    hello_world: String!
   }
`;
const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

module.exports=graphql_tool.makeExecutableSchema({
    typeDefs: [SchemaDefinition, RootQuery],
    resolvers: {
      RootQuery: {
        hello_world: () => "Hi from GraphQL!"
      }
    }
});


