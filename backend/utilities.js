// Requirements
var session = require('express-session');
var jwt  = require('jwt-simple');

var Yelp = require('yelp');
var Uber = require('node-uber');

// Uber key
var uber = new Uber({
  client_id: 's7Z67Tq2-omqdyXmEVMIXdkn_krzD563',
  client_secret: '4a28nXO-xh268LUzPSmtpuhSBfN0NgYfW_TLmhuY',
  server_token: '_b13GTgZy1rf08rRQK9bYrfl2E0WNWC9oUMgArQR',
  redirect_uri: 'REDIRECT URL',
  name: 'Brewski, Broski?'
});

// Yelp key
var yelp = new Yelp({
  consumer_key: "cUM2s97-paI5-BlgOeUqIQ",
  consumer_secret: "tE_ShtbZHaYxEgmcbpfGO3DBpng",
  token: "WQ2Iw9H39t8PV8H-V1UjZreaDniDnztc",
  token_secret: "szUxF_dCG6v3TZrofbdYaKGzpSc"
});

// Auth
var decodeToken = exports.decodeToken = function(request){
  return jwt.decode(request.headers['beeroclock'], 'itsberroclocksomewhere');
}

//Create session
exports.createSession = function(request, response, isUser, callback) {
  var token = jwt.encode({
    "userId": isUser.id,
    "username": isUser.name
  },
    'itsberroclocksomewhere');
  callback(token, isUser.username);
}

// Logic checks
var isLoggedIn = function(token) {
  var hash = jwt.decode(token, 'itsberroclocksomewhere');
  return !!hash.userId;
}

// Reroute based on Auth status
exports.checkUser = function(request, response, next) {
  var token = request.headers['beeroclock'];
  if (!token || (token === "undefined")){
    response.status(401).send("No token detected")
  } else {
    if (isLoggedIn(token)){
      var hash = jwt.decode(token, 'itsberroclocksomewhere');
      console.log("+++ 50 utilities.js hash: ", hash)
      request.session.user = hash.userId;
      console.log("+++ 52 utilities.js request.session.user: ", request.session.user)
      next()
    } else {
      response.sendStatus(401);
    }
  }
}


// Central Point Math
exports.getCentralPoints = function(ownerPoints, acceptedPoints, num) {
  var d0 = (acceptedPoints[0] - ownerPoints[0]) / (num + 1);
  var d1 = (acceptedPoints[1] - ownerPoints[1]) / (num + 1);
  var points = [];
  for (var i = 1; i <= num; i++) {
    points.push({
      x: ownerPoints[0] + d0 * i,
      y: ownerPoints[1] + d1 * i
    });
  }
  console.log("points: ", points)
  return points;
}

exports.searchYelpApi = function (request, response, centerLat, centerLong){
  var cLat = centerLat;
  var cLong = centerLong;
  var cll = cLat.toString() + ',' + cLong.toString();
  var closestBar = [];
  console.log("Center lat long before API call: ", cll);

  yelp.search({ term: 'bar', ll: cll, limit: 1, sort: 1 })
  .then(function (data) {
    var address = data.businesses[0].location.display_address;
    if(address.length === 3){
      address.splice(1,1);
    }
    response.status(200).send( {
        name: data.businesses[0].name,
        address: address,
        location: data.businesses[0].location.coordinate
      });
  })
  .catch(function (err) {
    console.error(err);
    response.sendStatus(500)
  });
}

exports.searchUberApi = function (request, response, startLat, startLong, endLat, endLong){
  uber.estimates.price({
    start_latitude: startLat, start_longitude: startLong,
    end_latitude: endLat, end_longitude: endLong
  }, function (err, res) {
    if (err) {
      console.error(err);
      response.sendStatus(500)
    } else {
      response.status(200).send( {
        uberX: res.prices[0],
        uberXL: res.prices[1],
        uberSELECT: res.prices[3],
        uberBLACK: res.prices[4],
        uberSUV: res.prices[5],
        uberLUX: res.prices[6]
      });
    }
  });
}
