/**
 * @fileoverview Infinite loops in code are prohibited
 * @author Aleksandra
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-infinite-loops"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-infinite-loops", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "for(;;) {} )",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
