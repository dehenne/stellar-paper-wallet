
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
    'qui/controls/windows/Alert',
    'wallet/QRCode',
    'Call',

    'css!Wallet.css'

], function(QUI, QUIControl, QUIButton, QUIAlert, QRCode, Call)
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
            "status"          : "",
            "server"          : ""
        },

        initialize : function(options)
        {
            this.parent( options );

            this.$QRCode          = null;
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
            var self = this;

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
                text      : 'Copy to Clipboard',
                events    : {
                    onClick : function() {
                        self.copyToClipboard();
                    }
                }
            }).inject( this.$Buttons );

            new QUIButton({
                textimage : 'fa fa-envelope',
                text      : 'Send / Save',
                events    : {
                    onClick : function() {
                        self.sendQRCode();
                    }
                }
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
         * event : on inject
         * shows the wallet
         */
        $onInject : function()
        {
            this.$QRCode.setData({
                "account_id"      : this.getAttribute( 'account_id' ),
                "server"          : this.getAttribute( 'server' ),
                //"master_seed"     : this.getAttribute( 'master_seed' ),
                //"master_seed_hex" : this.getAttribute( 'master_seed_hex' ),
                "public_key"      : this.getAttribute( 'public_key' ),
                "public_key_hex"  : this.getAttribute( 'public_key_hex' ),
                "status"          : this.getAttribute( 'status' )
            });

            var self = this;

            moofx( this.$Elm ).animate({
                left : 0
            }, {
                callback : function()
                {
                    self.getAccountInfo(function(result)
                    {
                        if ( typeof result.result.error !== 'undefined' )
                        {
                            if ( result.result.error_code != 15 )
                            {
                                new QUIAlert({
                                    content : result.result.error_message
                                }).open();

                                self.fireEvent( 'loadError' );
                                return;
                            }

                            // no balance?

                            self.fireEvent( 'loaded' );
                            return;
                        }

                        console.log( result );

                        self.fireEvent( 'loaded' );
                    });
                }
            });
        },

        /**
         * Action
         */

        /**
         * copy the stellar wallet address to the clipboard
         */
        copyToClipboard : function()
        {
            window.plugins.copy( this.getAttribute( 'account_id' ) );
        },


        /**
         * Send QR Code
         */
        sendQRCode : function()
        {
            var self = this;

            window.plugins.socialsharing.share(
                'stellar paper wallet',
                null,
                self.$QRCode.getImage()
            );


            /*
            window.plugin.email.isServiceAvailable(function (isAvailable)
            {
                if ( !isAvailable )
                {

                    return;
                }

                window.plugin.email.open({
                    subject     : 'Stellar Paper Wallet',
                    attachments : [ self.$QRCode.getImage() ]
                });
            });
            */
        },


        /**
         * Stellar Call Methods
         */

        /**
         * Return the account info
         *
         * @param {Function} callback
         */
        getAccountInfo : function(callback)
        {
            new Call({
                server : this.getAttribute( 'server' )
            }).post(function(result)
            {
                callback( result );

            }, {
                method: "account_info",
                params: [{
                     account: this.getAttribute( 'account_id' ),
                     ledger_index: 400
                }]
            });
        },

    });

});