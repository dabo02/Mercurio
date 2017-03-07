/*
@constructor: Constructor for AbstractAccount class
@abstract
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

function AbstractAccount(userId, firstName, lastName, phone, picture, status, availability, 
	email, extension, sipUsername, sipPassword, accountSettings, companyName){
	
	if(this.constructor === AbstractAccount){
		throw new ConstructorError("Cannot instantiate AbstractAccount class!");
	}

	//check if parameter types are correct
	
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.picture = picture;
    this.status = status;
    this.sipUsername = sipUsername;
    this.sipPassword = sipPassword;
    this.availability = availability;
    this.email = email;
    this.accountSettings = accountSettings
    //this.contactManager = contactManager;
    this.extension = extension;
	this.companyName = companyName;
    
}

/*
Requests server to save profile picture and update database to reflect these changes
@method
@abstract
@params: picture - string containing path to profile picture
*/

AbstractAccount.prototype.savePicture = function(picture){ 
	throw new AbstractFunctionError("Cannot call abstract function savePicture!");
}

/*
Requests server to save username in database
@method
@abstract
@params: username - string containing username to save
*/

AbstractAccount.prototype.saveUsername = function(username){
	throw new AbstractFunctionError("Cannot call abstract function saveUsername!");
}

/*
Requests server to save user availability in database
@method
@abstract
@params: availability - string containing user availability information
*/

AbstractAccount.prototype.saveAvailability = function(availability){
	throw new AbstractFunctionError("Cannot call abstract function saveAvailability!");
}

/*
Requests server to save user status in database
@method
@abstract
@params: status - string containing user status information
*/

AbstractAccount.prototype.saveStatus = function(status){
	throw new AbstractFunctionError("Cannot call abstract function saveStatus!");
}

/*
Requests server to save user profile information in database
@method
@abstract
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

AbstractAccount.prototype.saveProfileInfo = function(firstName, lastName, email, status, availability){
	throw new AbstractFunctionError("Cannot call abstract function saveProfile!");
}

AbstractAccount.prototype.getUserId = function(){
	return this.userId;
}

AbstractAccount.prototype.getContactManager = function(){
	return this.contactManager;
}