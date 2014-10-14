
/**
 * Request
 */

define(['qui/classes/DOM'], function(QDOM)
{
    "use strict";

    return new Class({

        Extends : QDOM,
        Type    : 'Call',

        options : {
            server : 'https://test.stellar.org:9002'
        },

        /**
         * create a request
         *
         * @param {String} type - POST, GET, PUSH ...
         * @param {Function} callback - callback function
         * @param {Object} params - request params
         */
        request : function(type, callback, params)
        {
            var R = new Request({
                method    : type,
                url       : this.getAttribute( 'server' ),
                onSuccess : function(result)
                {
                    callback( JSON.decode( result ) );
                }
            });

            delete R.headers['X-Requested-With'];

            R.send( JSON.encode( params ));
        },

        /**
         * post request
         *
         * @param {Function} callback - callback function
         * @param {Object} params - request params
         */
        post : function(callback, params)
        {
            this.request( 'POST', callback, params );
        },

        /**
         * get request
         *
         * @param {Function} callback - callback function
         * @param {Object} params - request params
         */
        get : function(callback, params)
        {
            this.request( 'GET', callback, params );
        }
    });

});
