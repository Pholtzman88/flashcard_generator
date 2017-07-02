var mysql = require("mysql");
var inquirer = require("inquirer");
var SqlConnection = require("./connection.js")
function runSetup(){
	inquirer.prompt([
	{
		name	:"host",
		message	:"enter your host name.."
	},
	{
		name	:"port",
		message	:"enter your port number.."
	},
	{
		name	:"user",
		message	:"enter your username.."
	},
	{
		name	:"password",
		message	:"enter your password.."
	},
	{
		name	:"database",
		message	:"Enter your database name? If you have not created one yet, choose a new name name..\."
	},	
	]).then(function(a){
		if(process.argv[2] === "setup_database"){
			var con = new SqlConnection(a.host,a.port,a.user,a.password);
			create("database");
		}else if(process.argv[2] === "setup_tables"){
			var con = new SqlConnection(a.host,a.port,a.user,a.password,a.database);
			create("tables");	
		};		
		

		function createDatabase(){
			var connection = mysql.createConnection(con);
			connection.query("CREATE DATABASE "+a.database, function(err,res){
				if(err) throw err;
				connection.end();
			});
		};

		function createTable(t){
			var connection = mysql.createConnection(con);
			connection.query("CREATE TABLE "+t+"_cards (id INTEGER(100) AUTO_INCREMENT PRIMARY KEY,front VARCHAR(50), back VARCHAR(50) );",function(err,res){
				if(err) throw err;
				connection.end();
			});
		};

		function create(r){
			if(r === "database"){
			//create a database
			createDatabase();
			}else if(r === "tables"){
				//create data tables
				createTable("basic");
				createTable("cloze");
			};
		};
	});
};

runSetup();
	
