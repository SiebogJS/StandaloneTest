/**
 * @fileoverview ...
 * @author Aleksandra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "...",
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
                node.body.forEach(function (body) {  
                    if(body.type) {
                        if(body.type == 'VariableDeclaration') {
                            if(body.declarations) {
                                body.declarations.forEach(function (declarations) {
                                    if(declarations.init) {
                                        if(declarations.init.callee) {
                                            if (declarations.init.callee.name == 'require') {
                                                context.report(node, 'variabl declaration require not allowed on line '+declarations.loc.start.line+' please use safe_require');
                                            }
                                        }
                                    }
                                });
                            }
                        } else if(body.type == 'ExpressionStatement') {
                            if(body.expression) {
                                if(body.expression.type == 'AssignmentExpression') {
                                    if(body.expression.left) {
                                        if(body.expression.left.object) {
                                            if(body.expression.left.object.callee) {
                                                if(body.expression.left.object.callee.name == 'require') {
                                                    context.report(node, 'assignment expression require not allowed on line '+body.expression.left.object.loc.start.line+' please use safe_require');
                                                }
                                            }
                                        }
                                    }    
                                } else {
                                    if(body.expression.callee) {
                                        if(body.expression.callee.name == 'require') {
                                            context.report(node, 'expression require not allowed on line '+body.expression.callee.loc.start.line+' please use safe_require');
                                        }
                                    }
                                }
                            }
                        }
                    }
                });   
            }
        };
    }
};
