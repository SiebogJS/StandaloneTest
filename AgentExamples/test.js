require("nodesentry");
var Policy = require("nodesentry").Policy;
var Agent = process.DependencyService.get('Agent');
var util  = require('util');

console.log("Policy created!");

var p = new Policy()
            .before("fs.writeFile")
            .return(notAllowed)
            .build();   

function notAllowed(writeFile) { 
    writeFile = function() {
        console.log("Access to local file system is not permitted!");
    }
    return writeFile;
}

var fs  = safe_require("file-system",p);

module.exports = function(){

    console.log("Before writeFile");
    fs.writeFile(__dirname, "Test!", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
    }); 
    return new TestAgent();
};


function TestAgent() {
    var self = this;

    Agent.call(self);

    self.handleMessage = function (aclmsg) {
        console.info('Agent with aid: '+ self.aid.value + ' received a message: ' + JSON.stringify(aclmsg));
    };

    self.postConstruct = function () {
        console.info('Agent with aid: '+ self.aid.value +' created');
    };

    self.preDestroy = function () {
        console.info('Agent with aid: '+ self.aid.value +' destroyed');
    };

}

util.inherits(TestAgent, Agent);

