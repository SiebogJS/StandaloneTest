(function() {
  var Module, harmony, log, origRequire;

  harmony = require("harmony-reflect");

  log = require("./logger");

  Module = require("./module");

  origRequire = require;

  global.safe_require = function(libName, policyObj) {
    var m;
    if (policyObj != null) {
      m = new Module(libName);
      m.setPolicy(policyObj);
      return m.loadLibrary();
    } else {
      return origRequire(libName);
    }
  };

  global.require = global.safe_require;

}).call(this);
