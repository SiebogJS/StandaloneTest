var Agent = process.DependencyService.get('Agent');
var util  = require('util');
var ACLMessage = process.DependencyService.get('ACLMessage').ACLMessage;
var ACLPerformatives = process.DependencyService.get('ACLPerformatives');

module.exports = function(){
    return new PongAgent();
};


function PongAgent() {
    var self = this;

    Agent.call(self);

    self.handleMessage = function (aclmsg) {

        if(!aclmsg.performative)
            return;

        if(aclmsg.performative === ACLPerformatives.REQUEST){

            console.info('Agent with aid: '+ self.aid.value + ' received a message: ' + aclmsg.content);

            self.agentManager.getAgent('siebogjs.pingpong@ping', false, function (pingAid) {
                if(!pingAid)
                    return;
               var msg = ACLMessage(self.aid.value, ACLPerformatives.INFORM, [pingAid]);
                msg.content = 'Pong';
                self.messageManager.post(msg);
            });
        }
    };

    self.postConstruct = function () {
        console.info('Agent with aid: '+ self.aid.value +' created');
    };

    self.preDestroy = function () {
        console.info('Agent with aid: '+ self.aid.value +' destroyed');
    };
}

util.inherits(PongAgent, Agent);