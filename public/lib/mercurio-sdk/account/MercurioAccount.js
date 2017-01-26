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
					snapshot.val().extension, snapshot.val().sipUsername,
					snapshot.val().sipPassword, snapshot.val().settings, snapshot.val().companyId]);
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
	
	var self = this;
	
	var updates = {};
	firebase.storage().ref().child('user/' + this.userId + '/profile/profile_picture').put(picture)
		.then(function(snapshot) {
			console.log(snapshot.downloadURL);
		  	updates['account/' + self.userId + '/picture'] = snapshot.downloadURL;
		  	firebase.database().ref().update(updates);
		  	
		});
	
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

MercurioAccount.prototype.saveProfileInfo = function(firstName, lastName, email, status, availability){
	
	var updates = {};
	var updateFlag = false;
	
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

	this.syncProfileUpdate();
	// TODO - add error management callback
}

MercurioAccount.prototype.syncProfileUpdate = function() {

	var self = this;

	var contact ={
		availability: self.availability,
		email: self.email,
		firstName: self.firstName,
		lastName: self.lastName,
		phone: self.phone || '',
		picture: self.picture,
		status: self.status,
		extension: self.extension || '',
		companyId: self.companyId,
		userId: self.userId
	}

	firebase.database().ref("account").once("value", function (snap) {

		var myBusinessGroupAccountKeys = [];

		snap.forEach(function (childSnapshot) {
			//if its not me and the account belongs to my company
			if (childSnapshot.key != self.userId && self.companyId === childSnapshot.val().companyId) {
				myBusinessGroupAccountKeys.push(childSnapshot.key);
			}
		})

		myBusinessGroupAccountKeys.forEach(function(accountKey, index){
			firebase.database().ref("user-contacts/"+accountKey)
				.orderByChild("userId")
				.equalTo(self.userId)
				.on("child_added", function(snapshot){

					firebase.database().ref("user-contacts/"+accountKey+"/"+snapshot.key).set(contact);
				})
		})
	})
}