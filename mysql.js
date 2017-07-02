var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "test"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id" + connected.threadId);
});