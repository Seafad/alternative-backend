const config = require('./config')
const mysql = require('mysql');

const connection = mysql.createConnection({
	host:		config.db.host,
	port:		config.db.port,
	user:		config.db.user,
	password:	config.db.pass,
	database:	config.db.name
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
  console.log('creating db schema');
  createTables();
  connection.query('SELECT * FROM `help_requests`',
	function (error, results, fields) {
	   if(error){
		   console.log("Error creating db: " + error);
	   }
	   if(results){
		   console.log(results);
	   }
	});
});

function createTables(){
	connection.query('CREATE TABLE IF NOT EXISTS `help_requests` (\
    help_reqest_id INT AUTO_INCREMENT,\
    name VARCHAR(255) NOT NULL,\
    PRIMARY KEY (help_reqest_id))  ENGINE=INNODB;',
	function (error, results, fields) {
	   if(error){
		   console.log("Error creating db: " + error);
	   }
	   if(results){
		   console.log(results);
	   }
	});
};

/* INSERT example

let helpRequest = {name: "Mitya"};
  connection.query('INSERT INTO `help_requests` SET ?', helpRequest,
	function (error, results, fields) {
	   if(error){
		   console.log("Error creating db: " + error);
	   }
	   if(results){
		   console.log(results);
	   }
	});
*/