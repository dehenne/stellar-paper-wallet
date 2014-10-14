
/**
 * Stellar Wallet Display
 *
 * @module Wallet
 * @author www.pcsg.de (Henning Leutz)
 */


define([

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/buttons/Button',
    'wallet/QRCode',
    'Call',

    'css!Wallet.css'

], function(QUI, QUIControl, QUIButton, QRCode, Call)
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
            this.$Buttons         = null;
            this.$Balance         = null;

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
                              '<div class="wallet-buttons"></div>' +
                              '<div class="wallet-data"></div>' +
                              '<div class="wallet-qrcode"></div>' +
                              '<div class="wallet-balance"></div>' +
                          '</div>',
                styles : {
                    left : '-110%'
                }
            });

            this.$QRCodeContainer = this.$Elm.getElement( '.wallet-qrcode' );
            this.$DataContainer   = this.$Elm.getElement( '.wallet-data' );
            this.$Buttons         = this.$Elm.getElement( '.wallet-buttons' );
            this.$Balance         = this.$Elm.getElement( '.wallet-balance' );

            // buttons
            new QUIButton({
                textimage : 'fa fa-copy',
                text      : 'Copy Address',
                events    : {
                    onClick : function() {
                        self.copyToClipboard();
                    }
                }
            }).inject( this.$Buttons );

            new QUIButton({
                textimage : 'fa fa-envelope',
                text      : 'Send QR-Code'
            }).inject( this.$Buttons );

            new QUIButton({
                textimage : 'fa fa-print',
                text      : 'Print QR-Code'
            }).inject( this.$Buttons );


            // address data
            this.$DataContainer.set(
                'html',

                '<div class="wallet-data-address">' +
                    '<label>Stellar-Address</label>' +
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
         * copy the stellar wallet address to the clipboard
         */
        copyToClipboard : function()
        {
            window.plugins.copy( this.getAttribute( 'account_id' ) );
        },

        /**
         * event : on inject
         * shows the wallet
         */
        $onInject : function()
        {
            moofx( this.$Elm ).animate({
                left : 0
            });
        }

    });
});