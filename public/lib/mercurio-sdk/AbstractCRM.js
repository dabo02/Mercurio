/*
uses ConstructorError, AbstractFunctionError
@constructor Constructor for AbstractCRM class

*/

function AbstractCRM(crmId, insertCalls, name, token, type, validated){

	this.crmId = crmId;
	this.insertCalls = insertCalls;
	this.name = name;
	this.token = token;
	this.type = type;
	this.validated = validated;
	
	if(this.constructor === AbstractCRM){
		throw new ConstructorError("Cannot instantiate AbstractCRM class!");
	}
}

/*

Requests server to login to CRM
@method
@abstract
*/

AbstractCRM.prototype.crmLogin = function(){
	throw new AbstractFunctionError("Cannot call abstract function crmLogin!");
}

/*

Requests CRM server to add a lead to CRM
@method
@abstract
@params: leadInfo - JSON object with lead attributes

*/

AbstractCRM.prototype.addLead = function(leadInfo){
	throw new AbstractFunctionError("Cannot call abstract function addLead!");
}

/*

Requests CRM server to add a call to CRM
@method
@abstract
@params: callInfo - JSON object with call attributes

*/

AbstractCRM.prototype.addCall = function(callInfo){
	throw new AbstractFunctionError("Cannot call abstract function addCall!");
}

