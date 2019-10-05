//
// File      : mysql-describe.js
//
// Author    : Barry Kimelman]
//
// Created   : October 4, 2019
//
// Purpose   : Display a description of a MySQL database table.
//
// Inputs    : argv[2] - name of table
//             argv[3] - name of database
//             argv[4] - password
//             argv[5] - username (default = 'root')
//             argv[6] - hostname (default = 'localhost')
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
if ( count < 5 ) {
	console.log("Usage : node mydescribe.js table_name schema password [username [host]]");
	process.exit();
}
var table_name = process.argv[2];
var schema = process.argv[3];
var password = process.argv[4];
if ( count <= 5 ) {
	username = 'root';
}
else {
	username = process.argv[5];
}
if ( count <= 6 ) {
	hostname = 'localhost';
}
else {
	hostname = process.argv[6];
}

console.log("Description of table " + table_name + " under " + schema);

var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : hostname ,
  user     : username ,
  password : password ,
  database : schema
});

connection.connect();

var sql = "SELECT column_name,data_type,ordinal_position,is_nullable,column_comment,";
sql += "CHARACTER_MAXIMUM_LENGTH maxlen,NUMERIC_PRECISION,NUMERIC_SCALE,COLUMN_TYPE,COLUMN_KEY,EXTRA";
sql += " FROM information_schema.columns ";
sql += "  WHERE table_name = '" + table_name + "' AND table_schema = '" +
			schema + "'";

connection.query(sql, function (err, rows, fields) {
	if (err) throw err;

	num_rows = rows.length
	var colname = [ ];
	var data_type = [ ];
	var maxlen = [ ];
	var nullable = [ ];
	var key = [ ];
	var extra = [ ];
	var comment = [ ];
	var headers = [ "Ordinal" , "Column Name" , "Data Type" , "Maxlen" , "Nullable ?" , "Key" , "Extra" , "Comment" ];
	var len = 0;
	var longest = new Array();
	longest['ordinal'] = 7;
	longest['colname'] = headers[1].length;
	longest['data_type'] = 0;
	longest['maxlen'] = headers[3].length;
	longest['nullable'] = headers[4].length;
	longest['key'] = 0;
	longest['extra'] = 0;
	longest['comment'] = 0;

	for ( i = 0 ; i < num_rows ; ++i ) {
		colname.push(rows[i].column_name);
		len = rows[i].column_name.length;
		if ( len > longest['colname'] ) {
			longest['colname'] = len;
		}

		data_type.push(rows[i].COLUMN_TYPE);
		len = rows[i].COLUMN_TYPE.length;
		if ( len > longest['data_type'] ) {
			longest['data_type'] = len;
		}

		maxlen.push(rows[i].maxlen);

		nullable.push(rows[i].is_nullable);
		len = rows[i].is_nullable.length;
		if ( len > longest['nullable'] ) {
			longest['nullable'] = len;
		}

		key.push(rows[i].COLUMN_KEY);
		len = rows[i].COLUMN_KEY.length;
		if ( len > longest['key'] ) {
			longest['key'] = len;
		}

		extra.push(rows[i].EXTRA);
		len = rows[i].EXTRA.length;
		if ( len > longest['extra'] ) {
			longest['extra'] = len;
		}

		comment.push(rows[i].column_comment);
		len = rows[i].column_comment.length;
		if ( len > longest['comment'] ) {
			longest['comment'] = len;
		}
	}
	console.log('\n');
	headers[1] = pad_string(headers[1],longest['colname']);
	headers[2] = pad_string(headers[2],longest['data_type']);
	headers[3] = pad_string(headers[3],longest['maxlen']);
	headers[4] = pad_string(headers[4],longest['nullable']);
	headers[5] = pad_string(headers[5],longest['key']);
	headers[6] = pad_string(headers[6],longest['extra']);
	headers[7] = pad_string(headers[7],longest['comment']);
	var buffer = "";
	var sep = "";
	for ( index = 0 ; index <= 7 ; ++index ) {
		buffer += sep + headers[index];
		sep = " ";
	}
	console.log(buffer);
	console.log("\n");
	for ( i = 0 ; i < num_rows ; ++i ) {
		ordinal = i + 1;
		ord = pad_string(ordinal.toString(),7);
		colname = rows[i].column_name;
		colname = pad_string(colname,longest['colname']);
		data_type = rows[i].COLUMN_TYPE;
		data_type = pad_string(data_type,longest['data_type']);
		maxlen = rows[i].maxlen;
		if ( maxlen ) {
			maxlen = pad_string(maxlen.toString(),longest['maxlen']);
		}
		else {
			maxlen = "--";
		}
		maxlen = pad_string(maxlen,longest['maxlen']);
		nullable = rows[i].is_nullable;
		nullable = pad_string(nullable,longest['nullable']);
		key = rows[i].COLUMN_KEY;
		key = pad_string(key,longest['key']);
		extra = rows[i].EXTRA;
		extra = pad_string(extra,longest['extra']);
		comment = rows[i].column_comment;
		comment = pad_string(comment,longest['comment']);
		console.log(ord + " " + colname + " " + data_type + " " + maxlen + " " +
						nullable + " " + key + " " + extra + " " + comment);
	}
});

connection.end();
