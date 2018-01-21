/**
 * @fileoverview Infinite loops in code are prohibited
 * @author Aleksandra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Infinite loops in code are prohibited",
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
            Program: function(node) {
                
                if(node.body !== null) {
                    node.body.forEach(function (body) {          
                        if(body.type === 'ForStatement' && body.init == null && body.test == null && body.update == null) {
                            context.report(node, 'Infinite loops are not allowed on line '+body.loc.start.line); 
                        }
                    });
                } 
            }
            /*WhileStatement: function(node) {
               console.log(node);
               if(node.test.type === 'Literal' && node.body.size == 0) {
                    context.report(node, 'Infinite loops are not allowed'); 
                }
            } 
            
            ForStatement: function(node) {
                console.log(node);
                if(node.init == null && node.test == null && node.update == null) {
                    context.report(node, 'Infinite loops are not allowed'); 
                }
            }*/
        };
    }
};
