/**
 * @fileoverview Calling function prototype is prohibited
 * @author Aleksandra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Calling function prototype is prohibited",
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        return {

            MemberExpression:function(node) {
                if(node.property.type == 'Identifier' && node.property.name == 'prototype'){
                    context.report(node, 'Access to prototypes not allowed.');
                }          
            }

        };
    }
};
