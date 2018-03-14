const graphql = require('graphql');
const axios = require('axios')
const{
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
name:'Company',
fields: () => ({
  id: { type: GraphQLString },
  name: { type: GraphQLString },
  description: { type: GraphQLString },
  users: {
    type: new GraphQLList(UserType), //because it has multiple users
    resolve(parentValue, args) {
      return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
      .then(res => res.data)
    }
  }
}) // "()=> ({})" closur scope make the programe run everything so it will know what the user type is 

});

const UserType = new GraphQLObjectType({
name: 'User',
fields: () => ({
  id: { type: GraphQLString },
  firstName: { type: GraphQLString },
  age: { type: GraphQLInt  },
  company: {
    type: CompanyType,
  resolve(parentValue,args){
    return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
    .then(res => res.data);
}
}
})
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
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString}},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
        .then(resp => resp.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
