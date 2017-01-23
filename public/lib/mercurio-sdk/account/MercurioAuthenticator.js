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

MercurioAuthenticator.prototype.login = function(email, password){
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		console.log(error);
	});
}

/*
Requests firebase to logout user
@method
@params: AbstractUser account - currently logged in AbstractAccount object
*/

MercurioAuthenticator.prototype.logout = function(){
	firebase.auth().signOut().then(function() {
		console.log("\n\nsigned our succesfully\n\n");
	}, function(error) {
		console.log("\n\nerror signing out	\n\n");
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

