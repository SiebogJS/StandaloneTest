(function() {
  var AfterRule, BeforeRule, OnRule, Policy, Rule, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore");

  Policy = (function() {
    function Policy() {
      this.build = __bind(this.build, this);
      this.rules = [];
      this.libsToWrap = [];
      this.policy = {
        wrapWithMembrane: function(libName) {
          return false;
        }
      };
    }

    Policy.prototype.disable = function(lib) {
      return this;
    };

    Policy.prototype.on = function(name) {
      var child;
      child = new OnRule(name, this);
      this.rules.push(child);
      return child;
    };

    Policy.prototype.before = function(name) {
      var child;
      child = new BeforeRule(name, this);
      this.rules.push(child);
      return child;
    };

    Policy.prototype.after = function(name) {
      var child;
      child = new AfterRule(name, this);
      this.rules.push(child);
      return child;
    };

    Policy.prototype.build = function() {
      var areType, calcRetValue, conditionsAreTrue, doGetActions, isEmpty, isNotFunction, strEqual;
      this.libsToWrap = [];
      strEqual = function(fullName) {
        return function(rule) {
          return fullName.indexOf(rule.apiCall) > -1;
        };
      };
      areType = function(t) {
        return function(rule) {
          return rule instanceof t;
        };
      };
      conditionsAreTrue = function(dTgt, ret) {
        return function(rule) {
          return _.chain(rule.conditions).map(function(cond) {
            return cond(dTgt, ret) === true;
          }).reduce((function(memo, c) {
            return memo && c;
          }), true).value();
        };
      };
      doGetActions = function() {
        var args, dTgt;
        dTgt = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return function(rule) {
          _.chain(rule.actions).map(function(action) {
            return action.apply(this, [dTgt].concat(args));
          });
          return rule;
        };
      };
      calcRetValue = function(origRet, rule) {
        return rule.ret(origRet);
      };
      isEmpty = function(l) {
        return l.size().value() === 0;
      };
      isNotFunction = function(v) {
        return typeof v !== "function";
      };
      this.policy.onGet = (function(_this) {
        return function(wTgt, name, wRec, dTgt, ret) {
          var afterRules, beforeRules, fullName, onGetValue, onRules, relevantRules;
          fullName = "" + (dTgt.constructor.name.toString()) + "." + name;
          relevantRules = _.chain(_this.rules).filter(strEqual(fullName));
          onRules = relevantRules.filter(areType(OnRule));
          beforeRules = relevantRules.filter(areType(BeforeRule));
          afterRules = relevantRules.filter(areType(AfterRule));
          return onGetValue = onRules.filter(conditionsAreTrue(dTgt, ret)).map(doGetActions(dTgt, ret)).reduce(calcRetValue, ret).value();
        };
      })(this);
      this.policy.functionCall = (function(_this) {
        return function(dTgt, dryThis, dryArgs, calcResult, fullName) {
          var afterRules, beforeRules, relevantRules;
          relevantRules = _.chain(_this.rules).filter(strEqual(fullName));
          beforeRules = relevantRules.filter(areType(BeforeRule));
          afterRules = relevantRules.filter(areType(AfterRule));
          calcResult = beforeRules.filter(conditionsAreTrue(dTgt)).map(doGetActions(dTgt, dryArgs, calcResult)).reduce(calcRetValue, calcResult).value();
          return function() {
            var ret;
            ret = calcResult();
            return afterRules.filter(conditionsAreTrue(dTgt, ret)).map(doGetActions(dTgt, dryArgs, ret)).reduce(calcRetValue, ret).value();
          };
        };
      })(this);
      return this.policy;
    };

    return Policy;

  })();

  Rule = (function() {
    function Rule(apiCall, parent) {
      this.apiCall = apiCall;
      this.parent = parent;
      this.after = __bind(this.after, this);
      this.before = __bind(this.before, this);
      this.on = __bind(this.on, this);
      this["if"] = __bind(this["if"], this);
      this["return"] = __bind(this["return"], this);
      this["do"] = __bind(this["do"], this);
      this.actions = [];
      this.ret = function(v) {
        return v;
      };
      this.conditions = [
        function() {
          return true;
        }
      ];
    }

    Rule.prototype["do"] = function(f) {
      this.actions.push(f);
      return this;
    };

    Rule.prototype["return"] = function(f) {
      this.ret = function(v) {
        return f.call(this, v);
      };
      return this;
    };

    Rule.prototype["if"] = function(cond) {  
      //console.log(require('util').inspect(cond, false, null));
      this.conditions.push(function(dtgt, ret) {
        return cond(dtgt, ret);
      });
      return this;
    };

    Rule.prototype.on = function(name) {
      return this.parent.on(name);
    };

    Rule.prototype.before = function(name) {
      return this.parent.before(name);
    };

    Rule.prototype.after = function(name) {
      return this.parent.after(name);
    };

    Rule.prototype.build = function() {
      return this.parent.build();
    };

    return Rule;

  })();

  OnRule = (function(_super) {
    __extends(OnRule, _super);

    function OnRule() {
      return OnRule.__super__.constructor.apply(this, arguments);
    }

    return OnRule;

  })(Rule);

  AfterRule = (function(_super) {
    __extends(AfterRule, _super);

    function AfterRule() {
      return AfterRule.__super__.constructor.apply(this, arguments);
    }

    return AfterRule;

  })(Rule);

  BeforeRule = (function(_super) {
    __extends(BeforeRule, _super);

    function BeforeRule() {
      return BeforeRule.__super__.constructor.apply(this, arguments);
    }

    return BeforeRule;

  })(Rule);

  module.exports = Policy;

}).call(this);
