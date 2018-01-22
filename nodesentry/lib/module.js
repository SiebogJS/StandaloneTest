(function() {
  var Membrane, WrappedModule, path, vm, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  vm = require("vm");

  path = require("path");

  _ = require("underscore");

  Membrane = require("./membrane");

  WrappedModule = (function() {
    function WrappedModule(libName, modulePaths, policyObj) {
      this.libName = libName;
      this.modulePaths = modulePaths;
      this.policyObj = policyObj;
      this.buildMembraneWrapper = __bind(this.buildMembraneWrapper, this);
      this.membranedRequire = __bind(this.membranedRequire, this);
      this.modModule = require("module");
      this.fileName = this.modModule._findPath(this.libName, this.modulePaths);
      this.requestLib = this.fileName || this.libName;
      this.builtIn = this.requestLib.indexOf(".js") === -1;
      if(typeof(this.fileName) !== "boolean") this.pathName = path.dirname(this.fileName);
    }

    WrappedModule.prototype.load = function(requireFunc) {
      var r, wrappedMod;
      if (requireFunc == null) {
        requireFunc = this.membranedRequire;
      }
      if (typeof requireFunc !== "function") {
        throw new Error("`require` must be a function");
      }
      module.paths = [this.pathName].concat(this.modModule._nodeModulePaths(this.pathName));
      if (this.builtIn) {
        r = require(this.requestLib);
      } else {
        wrappedMod = new this.modModule(this.libName, this);
        wrappedMod.require = requireFunc;
        wrappedMod.load(this.requestLib);
        r = wrappedMod.exports;
      }
      if (!this.policyObj) {
        return r;
      }
      if ((typeof r) === "function") {
        return new Membrane(r, this.policyObj, this.requestLib);
      }
      return this.wrapObjectWithMembrane(this.requestLib.replace(".js", ""), r);
    };

    WrappedModule.prototype.membranedRequire = function(libName) {
      var mod, _ref;
      mod = new WrappedModule(libName, module.paths, this.policyObj);
      if (mod.builtIn || !((_ref = this.policyObj) != null ? typeof _ref.wrapWithMembrane === "function" ? _ref.wrapWithMembrane(libName) : void 0 : void 0)) {
        return require(libName);
      }
      return mod.load();
      return this.wrapObjectWithMembrane(libName, libexports);
    };

    WrappedModule.prototype.wrapObjectWithMembrane = function(libName, obj) {
      return _.object(_.map(obj, this.buildMembraneWrapper(libName)));
    };

    WrappedModule.prototype.buildMembraneWrapper = function(libName) {
      return (function(_this) {
        return function(propObj, propName) {
          return [propName, new Membrane(propObj, _this.policyObj, "" + libName + "." + propName)];
        };
      })(this);
    };

    return WrappedModule;

  })();

  module.exports = WrappedModule;

}).call(this);
