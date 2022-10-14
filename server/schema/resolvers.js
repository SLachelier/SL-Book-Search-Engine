const { User, Book } = require('../models');
const { AuthError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async(parent, args, context) => {
      if(context.user){
        const userData = await User.findOne({})
        //finds the user and populates the books
        .select('-__v -password')
        .populate('books');

        return userData;
      }
      throw new AuthError('You are not logged in.');
    }
  },
  Mutation: { //adds a user
    addUser: async (parent, args) => {
      //creates a user
      const user = await User.create(args);
      //gets the user token
      const token = signToken(user);

      return {token, user};
    },

    login: async (parent, {email, password}) => {
      const user = await User.findOne({email});
      if(!user) {
        throw new AuthError('This credential combination does not exist.');
      }
      const rightPW = await user.isRightPass(password);
      if(!rightPW) {
        throw new AuthError('This credential combination does not exist');
      }
      const token = signToken(user);

    return { token, user };
    },

    saveBook: async(parent, args, userContext) => {
      if(context.user){
        const changedUser = await User.findByIDAndUpdate(
          { _id: context.user.id },
          { $setAdd: { savedBks: args.input }},
          { new: true }
        );

        return changedUser;
      }

      throw new AuthError('You must be logged in to perform this action.');
    }
  }
};

module.exports = resolvers;