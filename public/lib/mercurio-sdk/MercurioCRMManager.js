/*
uses MissingImplementationError

@constructor

*/

function MercurioCRMManager(userId){

	this.crmList = [];
	var self = this;
	
	AbstractCRMManager.apply(this, arguments);
	
	firebase.database().ref('user-crms/' + self.crmManagerOwner).on("child_added", function(snapshot) {
	
		if(snapshot.exists()){
		
			var crm = new ZohoCRM(snapshot.key, snapshot.val().insertCalls,
					snapshot.val().name, snapshot.val().token, snapshot.val().type,
					snapshot.val().validated);	
			
			self.crmList.push(crm);
		}

	});
}

MercurioCRMManager.prototype = Object.create(AbstractCRMManager.prototype);

MercurioCRMManager.prototype.constructor = MercurioCRMManager;

MercurioCRMManager.prototype.getCRMList = function(){
	return this.crmList;
}

/*
Requests server to add a CRM to the database
@method
@params: crmInfo - JSON object with CRM attributes
*/

MercurioCRMManager.prototype.addCRM = function(crmInfo){

	var self = this;
	
	if(self.crmList.length < 1){
		firebase.database().ref().child('user-crms/' + self.crmManagerOwner).push(crmInfo);
	}
	else{
		firebase.database().ref().child('user-crms/' + self.crmManagerOwner + '/' + self.crmList[0].crmId).set(crmInfo);
	}
	
	// var updates = {};
// 	updates['/user-crms/' + userId + "/" + token] = chatInfo;
// 
// 	firebase.database().ref().update(updates);
	
}

/*
Requests server to delete a list of CRMs from the database
@method
@params: indices - integer array containing indexes of chats to remove from recent chats
*/

MercurioCRMManager.prototype.deleteCRMs = function(crmIndices){
	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-crms/' + self.crmManagerOwner + '/' + self.crmList[index].token).set(null);
	});
}