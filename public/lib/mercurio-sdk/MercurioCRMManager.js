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

			var crm = new ZohoCRM(snapshot.key, snapshot.val().insertCallsAutomatically,
					snapshot.val().name, snapshot.val().token, snapshot.val().type,
					snapshot.val().validated);
			crm.validateToken(self.crmManagerOwner);
			self.crmList.push(crm);
		}

	});

	firebase.database().ref('user-crms/' + self.crmManagerOwner).on("child_changed", function(snapshot) {

		if(snapshot.exists()){
			self.crmList.forEach(function(crm, index){
			if(crm.crmId === snapshot.key){
				var crm = self.crmList[index];
				crm.insertCallsAutomatically = snapshot.val().insertCallsAutomatically;
				crm.name = snapshot.val().name;
				crm.token = snapshot.val().token;
				crm.type = snapshot.val().type;
				crm.validated = snapshot.val().validated;
			}
		});
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
		self.crmList[0].validateToken(self.crmManagerOwner);
	}
}

/*
Requests server to delete a list of CRMs from the database
@method
@params: indices - integer array containing indexes of chats to remove from recent chats
*/

MercurioCRMManager.prototype.deleteCRMs = function(crmIndices){
	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-crms/' + self.crmManagerOwner + '/' + self.crmList[index].crmId).set(null);
	});
}
