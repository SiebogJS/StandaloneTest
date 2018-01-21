/**
 * @fileoverview Calling function prototype is prohibited
 * @author Aleksandra
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-function-prototype"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-function-prototype", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "lassName.prototype.functionName = function() {}function.[F[Bprototype = {}",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
