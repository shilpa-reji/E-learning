import { gql } from 'apollo-server-express';

export default gql`

extend type Mutation {
    userSignup(
      name: String!
      emailId: String!
      phoneNo: String!
      password: String!
      role: Int!
    ): Token

    userSignIn(
      emailId:String!
      password:String
      role:Int
      ):Token

      addCourse(
        name: String!
        duration: String!
        startTime: String!
        endTime:String!
        userId: Int!
        ):Msg
  }

   type Msg{
    status: String
    code:String
    message:String
   }
    
    type Token {
      token: String
      user: Users
    }

    type Users{
      id:ID
      name: String
      eamilId: String
      password:String
      role:Int
    }
`;
