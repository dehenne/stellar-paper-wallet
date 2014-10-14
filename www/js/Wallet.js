
/**
 * Stellar Wallet Display
 *
 * @module Wallet
 * @author www.pcsg.de (Henning Leutz)
 */


define([

    'qui/QUI',
    'qui/controls/Control',
    'wallet/QRCode',

    'css!Wallet.css'

], function(QUI, QUIControl, QRCode)
{
    "use strict";

    return new Class({

        Extends : QUIControl,
        Type    : 'Wallet',

        Binds : [
            '$onInject'
        ],

        options : {
            "account_id"      : "",
            "master_seed"     : "",
            "master_seed_hex" : "",
            "public_key"      : "",
            "public_key_hex"  : "",
            "status"          : ""
        },

        initialize : function(options)
        {
            this.parent( options );

            this.$QRCodeContainer = null;
            this.$DataContainer   = null;

            this.addEvents({
                onInject : this.$onInject
            });
        },

        /**
         * Create the DOMNode Element
         *
         * @return {DOMNode}
         */
        create : function()
        {
            this.$Elm = new Element('div', {
                'class' : 'qui-box wallet',
                html    : '<div class="wallet-body">' +
                              '<div class="wallet-data"></div>' +
                              '<div class="wallet-qrcode"></div>' +
                          '</div>',
                styles : {
                    left : '-110%'
                }
            });

            this.$QRCodeContainer = this.$Elm.getElement( '.wallet-qrcode' );
            this.$DataContainer   = this.$Elm.getElement( '.wallet-data' );


            this.$DataContainer.set(
                'html',

                '<label for="">Stellar-Address</label>'+
                '<div class="wallet-data-address">'+
                    this.getAttribute( 'account_id' ) +
                '</div>'
            );

            // create qrcode of the wallet
            this.$QRCode = new QRCode({
                styles : {
                    margin : '20px auto'
                }
            }).inject( this.$QRCodeContainer );

            this.$QRCode.setData({
                "account_id"      : this.getAttribute( 'account_id' ),
                "master_seed"     : this.getAttribute( 'master_seed' ),
                "master_seed_hex" : this.getAttribute( 'master_seed_hex' ),
                "public_key"      : this.getAttribute( 'public_key' ),
                "public_key_hex"  : this.getAttribute( 'public_key_hex' ),
                "status"          : this.getAttribute( 'status' )
            });


            return this.$Elm
        },

        /**
         * Close the Wallet and destroy it
         *
         * @param {Function} callback - [optional] callback function
         */
        close : function(callback)
        {
            moofx( this.$Elm ).animate({
                left : '-110%'
            }, {
                callback : function() {
                    this.destroy();

                    if ( typeof callback !== 'undefined' ) {
                        callback();
                    }
                }.bind( this )
            });
        },

        /**
         *
         */
        $onInject : function()
        {
            moofx( this.$Elm ).animate({
                left : 0
            });
        }

    });
});