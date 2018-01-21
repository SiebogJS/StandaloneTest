var express = require('express');
var formidable = require('formidable');
var fs = require('file-system');
var exec = require('child_process').exec;

var app = express();

app.get('/', function (req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res){
    var form = new formidable.IncomingForm();
	var filename = '';
    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
		filename = file.name;
    });

    res.sendFile(__dirname + '/index.html');
	execute_command(filename);
});

app.listen(3000);

function execute_command(filename) {
  var cmd = 'eslint '+'uploads/'+filename + '> reports/report1.txt';

  exec(cmd, function(error, stdout, stderr) {
    console.log(stdout);
    console.log(filename);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });


};