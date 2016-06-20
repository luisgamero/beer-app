var request = require('request');
var parser = require('body-parser');

var models = require('./models')
var utils = require('./utilities');

var controllers;
module.exports = controllers = {
  //USER BACKEND CONTROLLERS
  //login
  login: {
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      models.login.post(username, password, function(isUser){
        if (isUser) {
          utils.createSession(request, response, isUser, function (token, name) {
            console.log("+++ 18 controllers.js token: ", token)
           response.status(200).send( {
             'username': name,
             'beeroclock': token,
             'userId': isUser.dataValues.id
           });
          })
        }else{
          response.sendStatus(400);
        };
      })
    }
  },
  signup: {
    post: function (request, response) {
      var username = request.body.username;
      var password = request.body.password;
      var email = request.body.email;
      if (username !== null || password !== null || email !== null) {
        models.signup.post(username, password, email, function(isUser){
          if(isUser){
          utils.createSession(request, response, isUser, function (token, name) {
           response.status(200).send( {
             'username': name,
             'beeroclock': token,
             'userId': isUser.dataValues.id
           });
          })
        }else{
            response.sendStatus(400);
          };
        })
      } else {
        response.sendStatus(400);
      };
    }
  },
  logout: {
    get: function (request, response) {
      request.session.destroy(function() {
        console.log("Logged out")
        response.redirect('/login');
      });
    }
  },
  friends: {
    get: function (request, response) {
      var username = request.params.friendName;
      models.friends.get(username, function (foundFriend) {
        response.status(200).json({ foundFriend });
      })
    }
  },
  friendsList:{
    get: function (request, response) {
      var userId = 1

      models.friendsList.get(userId, function (friendsList) {
        if (friendsList) {
          response.status(200).json(friendsList)
        } else{
          response.status(400).json(friendsList)
        };
      })
    }
  },
  friendship: {
    post: function(request, response) {
      var friendId = request.body.friendId;
      var userId = request.body.userId;
      models.friendship.post(userId, friendId, function (friendshipRequestCreated) {
        if (friendshipRequestCreated) {
          response.status(200).json({friendshipRequestCreated})
        } else{
          response.sendStatus(404);
        };
      })
    },
    put: function(request, response) {
      var inviteId = request.body.userId;
      var inviteeId = request.body.friendId;
      var userResponse = request.body.userResponse;
      models.friendship.put(inviteId, inviteeId, userResponse, function (friendshipUpdated) {
        if (friendshipUpdated) {
          var result = friendshipUpdated.dataValues
          response.status(200).json(result)
        } else{
          response.sendStatus(404);
        };
      })
    }
  }
}

