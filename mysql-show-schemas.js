//
// File      : mysql-show-schemas.js
//
// Author    : Barry Kimelman]
//
// Created   : October 6, 2019
//
// Purpose   : Display a list of schemas under a MySQL server
//
// Inputs    : argv[2] - password
//             argv[3] - username (default = 'root')
//             argv[4] - hostname (default = 'localhost')
//
// Output    : requested table description
//
// Returns   : (nothing)
//
// Example   : node mysql-describe.js mytable myschema
//
// Notes     : (none)
//

function pad_string(string,maxlen)
{
	while ( string.length < maxlen ) {
		string += " ";
	}
	return string;
} // end of display_full_date

var count = process.argv.length;
if ( count < 3 ) {
	var script_name = process.argv[1].split("\\");
	var count = script_name.length;
	console.log("Usage : node " + script_name[count-1] + " password [username [host]]");
	process.exit();
}

var password = process.argv[2];
if ( count <= 3 ) {
	username = 'root';
}
else {
	username = process.argv[3];
}
if ( count <= 4 ) {
	hostname = 'localhost';
}
else {
	hostname = process.argv[4];
}

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : hostname ,
  user     : username ,
  password : password ,
  database : 'information_schema'
});

connection.connect();

var sql = "SELECT schema_name FROM information_schema.schemata";

connection.query(sql, function (err, rows, fields) {
	if (err) throw err;

	num_rows = rows.length;

	for ( i = 0 ; i < num_rows ; ++i ) {
		console.log(rows[i].schema_name);
	} // FOR
});
connection.end();
