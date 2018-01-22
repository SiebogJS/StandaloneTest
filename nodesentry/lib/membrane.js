(function() {
  var Membrane, makeGenericMembrane, originalFile;

  Membrane = (function() {
    function Membrane(wetTarget, policyObj, name) {
      this.wetTarget = wetTarget;
      this.policyObj = policyObj;
      this.name = name;
      return makeGenericMembrane(this.wetTarget, this.policyObj, this.name).target;
    }

    return Membrane;

  })();

  originalFile = "../res/generic_membrane.js";

  makeGenericMembrane = require(originalFile).makeGenericMembrane;

  module.exports = Membrane;

}).call(this);
