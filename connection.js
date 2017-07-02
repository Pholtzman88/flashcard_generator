var SqlConnection = function(host,port,user,password,database){
	this.host = host,
	this.port = port,
	this.user = user,
	this.password = password,
	this.database = database
};
module.exports = SqlConnection;