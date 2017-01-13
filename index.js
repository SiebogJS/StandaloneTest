var messageManager = require('./MessageManager/MessageManager');
var server = require('siebogjs-restws').Server(__dirname + '/ClientApp', messageManager);

server.listen(8080);