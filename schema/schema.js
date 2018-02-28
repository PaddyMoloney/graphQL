const graphql = require('graphql');
const _ = reguire('lodash');
const{
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;

const users = [
  {id: '23', firstName: 'Bill', age:20 },
  {id: '47', firstName: 'Samantha', age:21}
];

const UserType = new GraphQLObecjtTYpe({
name: 'User',
fields: {
  id: { type: GraphQLString },
  firstName: { type: GraphQLString },
  age: { type: GraphQLInt  }
}
});

cosnt RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user:{
      type: UserType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args){

      }
    }
  }
})
