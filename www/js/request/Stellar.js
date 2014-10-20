
/**
 * Mini Stellar Client
 *
 * Its a stripped down client, because we need only a few functionality
 * the whole client is overloaded for us
 *
 * @module request/Stellar
 * @author www.pcsg.de (Henning Leutz)
 */

define([
    'qui/classes/DOM',
    'request/Call'
], function(QDOM, Call)
{
    "use strict";

    return new Class({

        Extends : QDOM,
        Type    : 'request/Call',

        options : {
            server : 'https://test.stellar.org:9002'
        },

        initialize : function(options)
        {
            this.parent( options );
        },

        /**
         * Send a request to the stellar server
         *
         * @param {String} method
         * @param {Object|false} params
         * @param {Function} callback
         */
        request : function(method, params, callback)
        {
            var requestParams = {
                method: method
            };

            if ( typeOf( params ) === 'object' ) {
                requestParams.params = [ params ];
            }

            new Call({
                server : this.getAttribute( 'server' )
            }).post(function(result)
            {
                callback( result );

            }, requestParams);
        },

        /**
         * Create a new cold wallet
         *
         * @params {Function} callback - callback function
         */
        createWallet : function(callback)
        {
            this.request( 'create_keys', false, callback );
        },

        /**
         * Return the account info
         *
         * @param {String} accountId - ID of the account
         * @param {Function} callback - callback function
         * @param {Object} extraRequestParams - [optional] extra request parameter
         */
        getAccountInfo : function(accountId, callback, extraRequestParams)
        {
            if ( typeOf( extraRequestParams ) !== 'object' ) {
                extraRequestParams = {};
            }

            var requestParams = Object.merge( extraRequestParams, {
                account: accountId
            });

            this.request('account_info', requestParams, callback);
        }
    });

});
