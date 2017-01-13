var Agent = process.DependencyService.get('Agent');
var util  = require('util');

module.exports = function(){
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



