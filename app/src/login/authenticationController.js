angular.module('users')
.controller('AuthenticationController', function($scope) {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Conectau");
      if(location.pathname.search("login")!=-1){
        location.replace("/app/index.html");
      }
    } else {
      console.log("desconectao");
      if(location.pathname.search("login")==-1){
        location.replace("/app/src/login/login.html");
      }
    }
  });

  $scope.signIn = function () {
    var rocket = document.getElementById("icon");
    rocket.setAttribute("id", "rocket");
    setTimeout(function() {
            rocket.setAttribute("id", "icon");
          }, 3600);
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log("Signing in " + email + " with " + password + " as password.");
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode+" "+errorMessage);
      document.getElementById("feedback").innerHTML = errorMessage;
      setTimeout(function() {
        document.getElementById("feedback").innerHTML = "";
      }, 3600);

      // ...
    });
  };

  $scope.signOut = function() {
    firebase.auth().signOut().then(function() {
            // Sign-out successful.

            }, function(error) {
            // An error happened.
            console.log(error);
            });
  }

  $scope.resetPassword = function() {
//        var email = document.getElementById("email").value;
//        firebase.auth().sendPasswordResetEmail(email).catch(function(error){
//            document.getElementById("feedback").innerHTML = "Error: "+error.message;
//                  setTimeout(function() {
//                    document.getElementById("feedback").innerHTML = "";
//                  }, 3600);
//        });
    var email = document.getElementById("email").value;
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        document.getElementById("feedback").style.color="green";
        document.getElementById("feedback").innerHTML = "An email to reset your password was sent to: "+email;
            setTimeout(function() {
                document.getElementById("feedback").innerHTML = "";
                document.getElementById("feedback").style.color="red";
            }, 3600);

    }, function(error) {
        // An error happened.
        document.getElementById("feedback").innerHTML = error.message;
        setTimeout(function() {
            document.getElementById("feedback").innerHTML = "";
        }, 3600);
    });
  }




});