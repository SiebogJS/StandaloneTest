'use strict';

var EventEmitter = require('events').EventEmitter,
    util = require('util');

var AgentManager = require('siebogjs-agent').manager.AgentManager("host1"),
    AgentManagerEventEnum = require('siebogjs-common').enums.AgentManagerEventEnum,
    MessageTypeEnum = require('siebogjs-common').enums.MessageTypeEnum,
    Message = require('siebogjs-common').structs.Message,
    AID = require('siebogjs-agent').agent.AID,
    Utility = require('siebogjs-common').util.common,
    ACLPerformatives = require('siebogjs-agent').fipa.ACLPerformatives;


function MessageManager() {
    EventEmitter.call(this);

    this._handlers = {};
    this.initHandlers();
}

util.inherits(MessageManager, EventEmitter);

MessageManager.prototype.ACLPerformatives = ACLPerformatives;

MessageManager.prototype.addHandler = function (messageType, handler) {

    this._handlers[messageType] = handler;
};

MessageManager.prototype.getHandler = function (messageType) {

    return this._handlers[messageType];
};

MessageManager.prototype.handleMessage = function (msg, callback) {

    this.getHandler(msg.type) && this.getHandler(msg.type)(msg, callback);
};

MessageManager.prototype.initHandlers = function () {

    var self = this;

    self.addHandler(MessageTypeEnum.ACL_MESSAGE, function (msg) {

        msg.content.performative = ACLPerformatives[msg.content.performative] || msg.content.performative;
        console.log("ACLMESSAGE ARRIVED");
        if(Array.isArray(msg.content.receivers)){
            var receivers = msg.content.receivers;

            for(var i = 0; i < receivers.length; i++){

                if(AgentManager.isRunning(receivers[i])) {
                    AgentManager.sendMessage(receivers[i], msg);
                }
            }
        }
    });


    self.addHandler(MessageTypeEnum.START_AGENT, function (msg, callback) {

        if(Utility.isFunction(callback)){
            try{
                console.log(msg.content);
                AgentManager.runAgent(msg.content.name, msg.content.type);
                callback();
            }catch (ex){
                callback(ex);
            }
        }
    });

    self.addHandler(MessageTypeEnum.STOP_AGENT, function (msg, callback) {

        try{
            AgentManager.stopAgent(msg.content.aid);
            Utility.isFunction(callback) && callback();
        } catch (ex) {
            Utility.isFunction(callback) && callback(ex);
            console.log("ERROR", ex);
        }

    });

    self.addHandler(MessageTypeEnum.GET_RUNNING_AGENTS, function (msg, callback) {

        if(Utility.isFunction(callback)){
            callback(AgentManager.getRunning());
        }
    });

    self.addHandler(MessageTypeEnum.GET_AGENT, function (msg) {

        var running = AgentManager.getRunning();
        var agent;

        for(var i = 0; i < running.length; i++){

            if(AID.getAIDFromString(running[i]).agentClass.value === msg.content.agentClass) {
                agent = running[i];
                break;
            }
        }
        
        var content = {
            agentClass: msg.content.agentClass,
            data: agent
        };

        if(agent){
            AgentManager.sendMessage(msg.content.sender, Message(MessageTypeEnum.FOUND_AGENT, content));
        }else {
            AgentManager.sendMessage(msg.content.sender, Message(MessageTypeEnum.NO_AGENT, content));
        }

    });

    self.addHandler(MessageTypeEnum.GET_AGENTS, function (msg) {

        var running =  AgentManager.getRunning();
        var agents = [];

        for(var i = 0; i < running.length; i++){

            if(AID.getAIDFromString(running[i]).agentClass.value === msg.content.agentClass)
                agents.push(running[i]);

        }

        var content = {
            agentClass: msg.content.agentClass,
            data: agents
        };

        if(agents.length > 0){
            AgentManager.sendMessage(msg.content.sender, Message(MessageTypeEnum.FOUND_AGENTS, content));
        }else {
            AgentManager.sendMessage(msg.content.sender, Message(MessageTypeEnum.NO_AGENTS, content));
        }

    });

    self.addHandler(MessageTypeEnum.GET_CLASSES, function (msg, callback) {

        if(Utility.isFunction(callback)){
            callback(AgentManager.getClasses());
        }
    });

    self.addHandler(MessageTypeEnum.LOG, function (msg) {
        self.emit(MessageTypeEnum.LOG, msg.content);
    });
};

var MM = new MessageManager();

AgentManager.loadAgentClasses(__dirname + '/../AgentExamples', "siebogjs");

AgentManager.on(AgentManagerEventEnum.MESSAGE, function(msg){
    MM.handleMessage(msg);
});

AgentManager.on(AgentManagerEventEnum.NEW_AGENT, function(msg){
    MM.emit(AgentManagerEventEnum.NEW_AGENT, msg);
});

AgentManager.on(AgentManagerEventEnum.REMOVED_AGENT, function(msg){
    MM.emit(AgentManagerEventEnum.REMOVED_AGENT, msg);
});

module.exports = MM;