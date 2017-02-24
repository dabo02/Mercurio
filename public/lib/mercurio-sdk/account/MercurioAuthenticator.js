/*

uses MissingImplementationError

implements interface Authenticator

login(String email, String, password, callback);
logout(AbstractUser user);
recoverPassword(AbstractUser user);
changePassword(AbstractUser user);

*/


/*
@constructor: Constructor for MercurioAuthenticator class
*/

function MercurioAuthenticator(){
	this.userAvailable = false;
}

/*
Requests firebase to login user
@method
@params: email - string containing user's email
@params: password - string containing user's password
*/
MercurioAuthenticator.prototype.login = function(email, password, feedback){
	if(typeof(email)!='undefined' && typeof(password)!='undefined'){
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  if (errorCode === 'auth/wrong-password') {
	    feedback('Wrong password.');
	  }
		else {
	    feedback(errorMessage);
	  }
	});
	}
	else{
		feedback('Please type email and password');
	}

}

/*
Requests firebase to logout user
@method
@params: AbstractUser account - currently logged in AbstractAccount object
*/

MercurioAuthenticator.prototype.logout = function(){
	firebase.auth().signOut().then(function() {
	}, function(error) {
		console.error("\n\nerror signing out	\n\n");
	});
}

/*
Requests firebase to send a password reset
@method
@params: String email - email of account for which the password is to be reset
*/

MercurioAuthenticator.prototype.resetPassword = function(email, emailObserver){

	firebase.auth().sendPasswordResetEmail(email).then(function() {
	  emailObserver();
	}, function(error) {
	  emailObserver(error);
	});
}

/*
Requests firebase to update a user's password
@method
@params: AbstractUser account- account for which the password is to be changed
*/

MercurioAuthenticator.prototype.changePassword = function(newPassword){

	var self = this;
	var user = firebase.auth().currentUser;

	user.updatePassword(newPassword).then(function() {
	  	// Update successful.
	}, function(error) {
	  	// An error happened.
	  	var credential;

		// Prompt the user to re-provide their sign-in credentials

		user.reauthenticate(credential).then(function() {
		  // User re-authenticated.
		  //*** REVISE THIS RECURSION ***
		  self.changePassword(newPassword)
		}, function(error) {
		  // An error happened.
		});
	});

}

MercurioAuthenticator.prototype.publishAccount = function(account){
	accountAvailabilityCallback(account);
}

MercurioAuthenticator.prototype.setAccountObserver = function(observer){

	var self = this;

	firebase.auth().onAuthStateChanged(function(user) {

		if(user){
			if(!self.userAvailable){
				self.userAvailable = true;
				var account = new MercurioAccount(user, function(account){
					observer(account);
				});
			}
		}
		else{
			self.userAvailable = false;
			observer(null);
		}
	});
}

MercurioAuthenticator.prototype.register = function(registerData){
	$.ajax({
		type: 'POST',
		url: '/register',
		cache: false,
		contentType: "application/json",
		data: JSON.stringify(registerData),
		success: function(data) {
			console.log(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("Error");
		},
		dataType: "json"
	});
}
