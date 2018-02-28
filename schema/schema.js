const graphql = require('graphql');
const axios = require('axios')
const{
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;


const UserType = new GraphQLObjectType({
name: 'User',
fields: {
  id: { type: GraphQLString },
  firstName: { type: GraphQLString },
  age: { type: GraphQLInt  }
}
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user:{
      type: UserType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/users/${args.id}`)//graphql doesn't know the data response will be nested
        .then(resp=> resp.data); //this will pair down the response from axios

      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
