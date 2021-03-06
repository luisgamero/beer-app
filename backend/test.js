var db = require('./db.js');
var _ = require('lodash');
var Promise = require('bluebird');

exports.createTest = function(){
  console.log("+++ 6 test.js -- Creating Test data")
  db.User.find({
    name: "test"
  }).then(function (found) {
    if (!found){
      var users = [
        {
          username: "test1",
          password: "$2a$10$RbfwGyHOSJLsVGN7v.6ll.US88K3GYUSG/8ZBRHf65p2ifVdeuUQu",
          email: "1@1.com"
        },
        {
          username: "test2",
          password: "$2a$10$RbfwGyHOSJLsVGN7v.6ll.US88K3GYUSG/8ZBRHf65p2ifVdeuUQu",
          email: "2@1.com"
        },
        {
          username: "test3",
          password: "$2a$10$RbfwGyHOSJLsVGN7v.6ll.US88K3GYUSG/8ZBRHf65p2ifVdeuUQu",
          email: "3@1.com"
        },
        {
          username: "test4",
          password: "$2a$10$RbfwGyHOSJLsVGN7v.6ll.US88K3GYUSG/8ZBRHf65p2ifVdeuUQu",
          email: "4@1.com"
        },
        {
          username: "test5",
          password: "$2a$10$RbfwGyHOSJLsVGN7v.6ll.US88K3GYUSG/8ZBRHf65p2ifVdeuUQu",
          email: "5@1.com"
        }
      ];
      var usersCreated = [];
      _.forEach(users, function(user){
        db.User.create(
          user
        );
      });
      Promise.all(usersCreated).then(function(user){
        var events = [
          {
            "userId": 1,
            "ownerName": "test1",
            "ownerLat": 33.8,
            "ownerLong": -117.25,
            "expirationDate": "2017-06-25 16:59:01"
          },
          {
            "userId": 2,
            "ownerName": "test2",
            "ownerLat": 33.986059,
            "ownerLong": -118.402044,
            "expirationDate": "2017-06-25 16:59:01"
          }
        ];
        var eventsCreated = [];
        _.forEach(events, function(event){
          db.Event.create(
            event
          );
        });
        Promise.all(eventsCreated).then(function(event){
          var friends = [
            {
             "inviteId": 2,
             "inviteeId": 1,
             "accepted": true
            },
            {
             "inviteId": 3,
             "inviteeId": 1,
             "accepted": true

            },
            {
             "inviteId": 4,
             "inviteeId": 1
            },
            {
             "inviteId": 1,
             "inviteeId": 5,
             "accepted": true
            }
          ];
          var queried = [];
          _.forEach(friends, function(friend){
            db.Friend.create(
              friend
            );
          });
          Promise.all(queried).then(function(createdfriends){
              var accepts = [
                {
                  "eventId": 1,
                  "userId": 2,
                  "username": 'test2',
                  "attendeeLat": 34.34,
                  "attendeeLong": -118.132
                },
                {
                  "eventId": 1,
                  "userId": 5,
                  "username": 'test5',
                  "attendeeLat": 33.33,
                  "attendeeLong": -117.1
                },
                {
                  "eventId": 2,
                  "userId": 5,
                  "username": 'test5',
                  "attendeeLat": 32.32,
                  "attendeeLong": -117.1
                },
                {
                  "eventId": 1,
                  "userId": 3,
                  "username": "test1",
                  "acceptedLat": 34.010202,
                  "acceptedLong": -118.486764
                }

              ];
              var acceptedList = [];
              _.forEach(accepts, function (accept) {
                db.Attendee.create(
                  accept
                )
              })
              Promise.all(acceptedList).then(function(acceptees) {
                  console.log("+++ 96 test.js -- Test Data created")
              })
            });
        });
      });
    } else{
      console.log("+++ 84 test.js - Test data already created")
    };
  })
};
