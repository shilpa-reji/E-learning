import jwt from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server";
import respObj from "../assets/lang/en.json";
const bcrypt = require("bcryptjs");
import { Op, where } from "sequelize";
import e from "express";
var Bugsnag = require("@bugsnag/js");
var speakeasy = require("speakeasy");
const md5 = require("md5");
const { authAPI } = respObj;
const createToken = async (user, secret, expiresIn) => {
  const { id, emailId, role } = user;

  const jwtToken = await jwt.sign(
    {
      id,
      emailId,
      role,
    },
    secret,
    {
      expiresIn,
    }
  );
  return jwtToken;
};
function userCode() {
  let result = "";
  const length = 4;
  const characters = "0123456789";
  let string = "";
  console.log(string.slice(0, 6));
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `USER_ ` + `${string.slice(0, 6)}` + `${result}`;
}
export default {
  

  Mutation: {
    userSignup: async (
      parent,
      {
        name,
        emailId,
        phoneNo,
        password,
        role
      },
      { models, secret }
    ) => {
      try {

        const userId = userCode();
        
        const userEmailCheck = await models.users.findOne({
          where: { emailId: emailId, role: role, status: 1 },
        });
        
        if (userEmailCheck) {
          throw new UserInputError(langData.authAPI.email_already_exist);
        }
        const userPhoneCheck = await models.users.findOne({
          where: { phoneNo: phoneNo,  role: role, status: 1 },
        });
        if (userPhoneCheck) {
          throw new UserInputError(langData.authAPI.phoneNo_already_exist);
        }
        const user = await models.users.create({
          userCode: userId,
          name,
          emailId,
          phoneNo,
          password: md5(password),
          role
        });
        
        const token = await createToken(user, secret, "1d");
        const datas = {
          jwtToken: token,
        };
        const update = await models.users.update(datas, {
          where: { id: user.id },
        });
        

        const data = {
          token: token,
          user: user,
        }
        
        return data;
      } catch (error) {
        Bugsnag.notify(error);
        throw new UserInputError(error);
      }
    },
    
    userSignIn: async (
      parent,
      { emailId, password, role },
      { models, secret }
    ) => {
      try {

        if (emailId) {
          const users = await models.users.findOne({
            where: { emailId, role, status: 1 },
          });
          if (users) {
            const loginData = await models.users.findOne({
              where: { emailId, password: md5(password), status: 1 },
            });
            if (loginData) {
              const token = await createToken(loginData, secret, "1d");
              const datas = {
                jwtToken: token,
              };
              const update = await models.users.update(datas, {
                where: { id: users.id },
              });
              let user = await models.users.findOne({
                where: { id: users.id },
              });
              return { token, user };
            } else {
              throw new UserInputError(langData.authAPI.invalid_password);
            }
          } else {
            throw new UserInputError(langData.authAPI.email_no_exists);
          }
        }
      } catch (error) {
        Bugsnag.notify(error);
        throw new UserInputError(error);
      }
    },
    addCourse: async (parent, { name, duration, startTime, endTime, userId }, { models, me }) => {
      try {
          if (!me) {
              throw new AuthenticationError(
                  authAPI.auth_failed,
              );
          }
          let postData = {
            name, 
            duration,
            startTime,
            endTime, 
            userId
          }
          const course = await models.course.create(postData);
          const msg = {
              status: authAPI.success,
              code: authAPI.codeSuccess,
              message: authAPI.courseCreated,
          }
          return msg;
      } catch (error) {
          Bugsnag.notify(error)
          throw new UserInputError(error);
      }
  },
   
  },
};
