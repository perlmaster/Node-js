//
// File      : mysql-show-tables.js
//
// Author    : Barry Kimelman]
//
// Created   : October 5, 2019
//
// Purpose   : Display a list of tables under a MySQL database
//
// Inputs    : argv[2] - name of database
//             argv[3] - password
//             argv[4] - username (default = 'root')
//             argv[5] - hostname (default = 'localhost')
//
// Output    : requested table description
//
// Returns   : (nothing)
//
// Example   : mysql-describe.js mytable myschema
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
if ( count < 4 ) {
	var script_name = process.argv[1].split("\\");
	var count = script_name.length;
	console.log("Usage : node " + script_name[count-1] + " schema password [username [host]]");
	process.exit();
}

var schema = process.argv[2];
var password = process.argv[3];
if ( count <= 4 ) {
	username = 'root';
}
else {
	username = process.argv[4];
}
if ( count <= 5 ) {
	hostname = 'localhost';
}
else {
	hostname = process.argv[5];
}

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : hostname ,
  user     : username ,
  password : password ,
  database : schema
});

connection.connect();

var sql = "SELECT TABLE_NAME,TABLE_TYPE FROM information_schema.tables " +
			"WHERE table_schema = '" + schema + "'";

connection.query(sql, function (err, rows, fields) {
	if (err) throw err;

	num_rows = rows.length;

	var tables = [ ];
	var types = [ ];
	var headers = [ "Table" , "Type" ];
	var longest = new Array();
	longest['table'] = headers[0].length;
	longest['type'] = headers[1].length;
	for ( i = 0 ; i < num_rows ; ++i ) {
		tables.push(rows[i].TABLE_NAME);
		len = rows[i].TABLE_NAME.length;
		if ( len > longest['table'] ) {
			longest['table'] = len;
		}

		types.push(rows[i].TABLE_TYPE);
		len = rows[i].TABLE_TYPE.length;
		if ( len > longest['type'] ) {
			longest['type'] = len;
		}
	} // FOR
	headers[0] = pad_string(headers[0],longest['table']);
	console.log(headers[0] + " " + headers[1] + "\n");
	for ( i = 0 ; i < num_rows ; ++i ) {
		table = pad_string(tables[i],longest['table']);
		console.log(table + " " + types[i]);
	}
});
connection.end();
