'use strict';


exports.sendPushNotification = function (req, res) {

  //send push notification
  var FCM = require('fcm-push');

  //Development Key
  //  var serverkey = 'AIzaSyAlTNQ0rX_z49-EL71e8le0vPew16g8WDg';

  //Production Key
  var serverkey = 'AIzaSyBYty0ff3hxlmwmBjy7paWCEalIrJxDpZ8';

  var fcm = new FCM(serverkey);
  var tokenArray = req.body.tokens;
  //   var pushTokens = [
  //     "edxbk-Dcwz4:APA91bHo6H98hNk8KLacAokXmFiu3T_mOy3sQhIGDX-qHIPxlcK_b0gWXulvqTQmVz7xbRGvsK4gtqbtqhSmRPIQjmEQkzsjaVLcSYoM46c0gu4_2XBDcobPaGQ_WroJpuquQU8B78_T",
  //     "f5cAqQ8v7e8:APA91bE94r2LPEWR-9x_mkNwiKIIyujechUApZIjkySnHBe7b79ODxofOZ6TQs0tqYwK9fKhqSlUMpR0MWOVR5yjSZXFRSOnle6RRXuygK0H9-FRWQE_DI9OS5UOJbY8-g48U6w_i_GO",
  //     "fGLjo8fx0sc:APA91bEbsaOJOx6b5hMQmnrXXcJslABgXrJYDjBYXiSerTVyeZVwyyfRRm6pQzeA0yChFj0MiGWc5z7X_ukiHgd96c0IiAtOUVsOsDaWxNWikLST_0xkHbW3mPR-rbsIkSMvQ36NpckB"
  // ]

  for(var i = 0; i < tokenArray.length; i++){
    var token = tokenArray[i];
    var bodyMessage = req.body.message;
    if(req.body.hasMultimedia){
      bodyMessage = "\uD83D\uDCF7"+ " "+bodyMessage;
    }
    var message =  {
          to : token,
          priority:'high',
          notification : {
            title : req.body.messageTitle,
            body : bodyMessage,
            sound : true
          }
    };

    fcm.send(message, function(err,response){
      if(err) {
        console.error(err);
        res.sendStatus(400);
        if(i==tokenArray.length-1){
          res.sendStatus(400);
        }
      } else {
        if(i==tokenArray.length-1){
          res.sendStatus(200);
        }
      }
    });
  }
}
