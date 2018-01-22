(function() {
  var WrappedModule, absolutePath, harmony, harmonyFlagsEnabled, installedModule, log, path, updatePath;

  harmonyFlagsEnabled = function() {
    return "function" === typeof Map;
  };

  if (!harmonyFlagsEnabled()) {
    throw new Error("NodeSentry requires the harmony flags. (`node --harmony`)");
  }

  harmony = require("harmony-reflect");

  log = require("./logger");

  WrappedModule = require("./module");

  path = require("path");

  absolutePath = function(name) {
    return name[0] === "/";
  };

  installedModule = function(name) {
    return !(name.indexOf(".js") > -1) && !(name.indexOf(".") > -1);
  };

  updatePath = function(name) {
    return path.join(path.dirname(module.parent.filename), name);
  };

  global.safe_require = function(libName, policyObj) {
    var modPaths, wrappedModule;
    if (!(absolutePath(libName) || installedModule(libName))) {
      libName = updatePath(libName);
    }
    modPaths = module.parent.paths;
    wrappedModule = new WrappedModule(libName, modPaths, policyObj);
    return wrappedModule.load();
  };

  module.exports.Policy = require("./policy");

}).call(this);
