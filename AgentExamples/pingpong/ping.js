'use strict';

var Agent = process.DependencyService.get('Agent');
var util  = require('util');
var ACLMessage = process.DependencyService.get('ACLMessage').ACLMessage;
var ACLPerformatives = process.DependencyService.get('ACLPerformatives');

module.exports = function(){
    return new PingAgent();
};


function PingAgent() {
    var self = this;

    Agent.call(self);

    self.handleMessage = function (aclmsg) {
       
        if(!aclmsg.performative)
            return;
        
        if(aclmsg.performative === ACLPerformatives.REQUEST) {

            self.agentManager.getAgent('siebogjs.pingpong@pong', false, function (pongAid) {
                if (!pongAid)
                    return;
                var msg = ACLMessage(self.aid.value, ACLPerformatives.REQUEST, [pongAid]);
                msg.content = 'Ping';
                self.messageManager.post(msg);
            });

        }else if (aclmsg.performative === ACLPerformatives.INFORM){
            console.info('Agent with aid: '+ self.aid.value + ' received a message: ' + aclmsg.content);
        }

    };

    self.postConstruct = function () {
        console.info('Agent with aid: '+ self.aid.value +' created');
    };

    self.preDestroy = function () {
        console.info('Agent with aid: '+ self.aid.value +' destroyed');
    };

}

util.inherits(PingAgent, Agent);