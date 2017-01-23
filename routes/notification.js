'use strict';


exports.sendPushNotification = function (req, res) {
  res.sendStatus(200);
  // var options = {
  //   method: 'POST',
  //   headers: {
  //     accept: '*/*',
  //     'Content-Type': 'application/json'
  //   }
  // };
  //
  // var cleanData;
  // var EventEmitter = require("events").EventEmitter;
  // var body = new EventEmitter();
  // var request = https.request(options, function(response) {
  //   response.on('data', function(data){
  //     body.data = data;
  //     body.emit('update');
  //   });
  // });
  //send push notification
  var FCM = require('fcm-push');
  var serverkey = 'AIzaSyBYty0ff3hxlmwmBjy7paWCEalIrJxDpZ8';
  var fcm = new FCM(serverkey);
  var tokenArray = req.body.tokens;
  //   var pushTokens = [
  //     "edxbk-Dcwz4:APA91bHo6H98hNk8KLacAokXmFiu3T_mOy3sQhIGDX-qHIPxlcK_b0gWXulvqTQmVz7xbRGvsK4gtqbtqhSmRPIQjmEQkzsjaVLcSYoM46c0gu4_2XBDcobPaGQ_WroJpuquQU8B78_T",
  //     "f5cAqQ8v7e8:APA91bE94r2LPEWR-9x_mkNwiKIIyujechUApZIjkySnHBe7b79ODxofOZ6TQs0tqYwK9fKhqSlUMpR0MWOVR5yjSZXFRSOnle6RRXuygK0H9-FRWQE_DI9OS5UOJbY8-g48U6w_i_GO",
  //     "fGLjo8fx0sc:APA91bEbsaOJOx6b5hMQmnrXXcJslABgXrJYDjBYXiSerTVyeZVwyyfRRm6pQzeA0yChFj0MiGWc5z7X_ukiHgd96c0IiAtOUVsOsDaWxNWikLST_0xkHbW3mPR-rbsIkSMvQ36NpckB"
  // ]

  tokenArray.forEach(function(token){
    var message =  {
          to : token,
          priority:'high',
          notification : {
            title : "Hi Manolo",
            body : "Isra is an animal. 8)",
            sound : true
          }
    };

    fcm.send(message, function(err,response){
      if(err) {
        console.log(err);
        res.send(err);
      } else {
        console.log("Successfully sent with response :",response);
        res.sendStatus(200);
      }
    });
  })
}
