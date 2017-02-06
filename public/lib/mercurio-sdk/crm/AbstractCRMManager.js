/*

uses ConstructorError, AbstractFunctionError

@constructor: Constructor for AbstractCRMManager
@abstract
*/

function AbstractCRMManager(userId){
	
	this.crmManagerOwner = userId;
	
	if(this.constructor === AbstractCRMManager){
		throw new ConstructorError("Cannot instantiate AbstractCRMManager class!");
	}
}

/*
Requests server to add a CRM to the database
@method
@abstract
@params: crmInfo - JSON object with CRM attributes
*/

AbstractCRMManager.prototype.addCRM = function(crmInfo){
	throw new AbstractFunctionError("Cannot call abstract function addCRM!");
}

/*
Requests server to delete a list of CRMs from the database
@method
@abstract
@params: chatIndexes - integer array containing indexes of CRMs to remove from database
*/

AbstractCRMManager.prototype.deleteCRMs = function(crmIndices){
	throw new AbstractFunctionError("Cannot call abstract function deleteCRMs!");
}