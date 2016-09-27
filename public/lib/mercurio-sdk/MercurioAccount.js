/*
@constructor: Constructor for MercurioAccount class
@params: userId - String
		 firstName - String
		 lastName - String
		 phone - String
		 email - String
		 picture - String
		 status - String
		 username - String
		 companyId - String
		 availability - String
		 password - String
*/

function MercurioAccount(user, accountReadyCallback){
	
	var self = this;
	
	firebase.database().ref('account/' + user.uid).on('value', function(snapshot) {
	
		if(snapshot.exists()){
			if(!self.userId){
				AbstractAccount.apply(self, [snapshot.key, snapshot.val().firstName, 
					snapshot.val().lastName, snapshot.val().phone, snapshot.val().picture, 
					snapshot.val().status, snapshot.val().availability, snapshot.val().email, 
					snapshot.val().extension], new MercurioContactManager(snapshot.key), 
					snapshot.val().sipUsername, snapshot.val().sipPassword, snapshot.val().settings);
				accountReadyCallback(self);
			}
			else{
				self.firstName = snapshot.val().firstName;
				self.lastName = snapshot.val().lastName;
				self.email = snapshot.val().email;
				self.status = snapshot.val().status;
				self.availability = snapshot.val().availability;
			}
		}
	});			
	
	// firebase.database().ref('account/' + user.uid).on('child_changed', function(snapshot) {
// 
// 		if (snapshot.exists()) {
// 			self.firstName = snapshot.val().firstName;
// 			self.lastName = snapshot.val().lastName;
// 			self.email = snapshot.val().email;
// 			self.status = snapshot.val().status;
// 			self.availability = snapshot.val().availability;
// 		}
// 	});	
}

MercurioAccount.prototype = Object.create(AbstractAccount.prototype);

MercurioAccount.prototype.constructor = MercurioAccount;

/*
Requests server to save profile picture and update database to reflect these changes
@method
@params: picture - string containing path to profile picture
*/

MercurioAccount.prototype.savePicture = function(picture){
	// TODO - upload picture to firebase and retrieve url to uploaded file
	
	var updates = {};
	updates['account/' + this.userId + '/picture'] = picture;
	
	firebase.database().ref().update(updates);
	
	// TODO - add error management callback
}

/*
Requests server to save username in database
@method
@params: username - string containing username to save
*/

MercurioAccount.prototype.saveUsername = function(username){
	
	var updates = {};
	updates['account/' + this.userId + '/username'] = username;
	
	firebase.database().ref().update(updates);
	
	// TODO - add error management callback
}

/*
Requests server to save user availability in database
@method
@params: availability - string containing user availability information
*/

MercurioAccount.prototype.saveAvailability = function(availability){

	var updates = {};
	updates['account/' + this.userId + '/availability'] = availability;
	
	firebase.database().ref().update(updates);
	
	// TODO - add error management callback
}

/*
Requests server to save user status in database
@method
@params: status - string containing user status information
*/
 
MercurioAccount.prototype.saveStatus = function(status){

	var updates = {};
	updates['account/' + this.userId + '/status'] = status;
	
	firebase.database().ref().update(updates);
	
	// TODO - add error management callback
}

/*
Requests server to save user profile information in database
@method
@params: firstName - String
		 lastName - String
		 phone - String
		 email - String
		 picture - String
		 status - String
		 username - String
		 companyId - String
		 availability - String
		 password - String
*/

MercurioAccount.prototype.saveProfileInfo = function(firstName, lastName, email, picture, status, availability){
	
	var updates = {};
	
	if(firstName !== ''){
		updates['account/' + this.userId + '/firstName'] = firstName;
	}
	
	if(lastName !== ''){
		updates['account/' + this.userId + '/lastName'] = lastName;
	}
	
	if(email !== ''){
		updates['account/' + this.userId + '/email'] = email;
	}
	
	if(status !== ''){
		updates['account/' + this.userId + '/status'] = status;
	}
	
	if(availability !== ''){
		updates['account/' + this.userId + '/availability'] = availability;
	}
	
	firebase.database().ref().update(updates);
	
	// TODO - add error management callback
}