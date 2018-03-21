const graphql = require('graphql');
const axios = require('axios')
const{
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull // GraphQLNonNull thing can't be empty
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

//root mutation for adding a new user?

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields:{
    addUser:{
      type: UserType,
      args: {
        firstName: {type: new GraphQLNonNull(GraphQLString)},
        age: { type: new GraphQLNonNull(GraphQLInt) },
        comapanyId: { type: GraphQLString }
      },
      resolve(parentValue, {firstName, age }) {
        return axios.post('http://localhost:3000/users/',{firstName, age })
        .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
        .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
        firstName: {type: GraphQLString},
        age: { type: GraphQLInt },
        comapanyId: { type: GraphQLString }
      },
      resolve(parentValue, args){
        return axios.patch(`http://localhost:3000/users/${args.id}`,args )
        .then(res => res.data);
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
