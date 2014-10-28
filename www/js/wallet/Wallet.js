
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
    'request/Stellar',

    'css!wallet/Wallet.css'

], function(QUI, QUIControl, QUIButton, QUIAlert, QRCode, Stellar)
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
            "server"          : "",

            "refresh"         : "10000" // every 10 seconds
        },

        initialize : function(options)
        {
            this.parent( options );

            this.$QRCode          = null;
            this.$QRCodeContainer = null;
            this.$DataContainer   = null;
            this.$Buttons         = null;
            this.$Balance         = null;
            this.$Stellar         = new Stellar();

            this.$refreshIntervall = null;

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
                left    : '-110%',
                opacity : 0
            }, {
                equation : 'ease-in',
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
            var self = this;


            moofx( this.$Elm ).animate({
                left : 0
            }, {
                equation : 'ease-out',
                callback : function()
                {
                    self.refresh(function(result)
                    {
                        if ( !result )
                        {
                            self.fireEvent( 'loadError' );
                            return;
                        }

                        self.fireEvent( 'loaded' );

                        // intervall refresh
                    });
                }
            });
        },

        /**
         * refresh the wallet infos and display
         *
         * @param {Function} callback - [optional] callback function
         */
        refresh : function(callback)
        {
            var self = this;

            this.$Stellar.getAccountInfo( this.getAttribute( 'account_id' ), function(result)
            {
                // create qr code, if not created
                if ( !self.$QRCode )
                {
                    var width = self.$QRCodeContainer.getSize().x;

                    if ( width > 400 ) {
                        width = 400;
                    }

                    // create qr code
                    self.$QRCode = new QRCode({
                        height : width,
                        width  : width,
                        styles : {
                            margin : '20px auto'
                        }
                    }).inject( self.$QRCodeContainer );

                    self.$QRCode.setData({
                        "account_id"      : self.getAttribute( 'account_id' ),
                        "server"          : self.getAttribute( 'server' ),
                        //"master_seed"     : this.getAttribute( 'master_seed' ),
                        //"master_seed_hex" : this.getAttribute( 'master_seed_hex' ),
                        "public_key"      : self.getAttribute( 'public_key' ),
                        "public_key_hex"  : self.getAttribute( 'public_key_hex' ),
                        "status"          : self.getAttribute( 'status' )
                    });
                }


                if ( typeof result.result.error !== 'undefined' )
                {
                    if ( result.result.error_code != 15 )
                    {
                        new QUIAlert({
                            content : result.result.error_message
                        }).open();

                        if ( typeof callback !== 'undefined' ) {
                            callback( false );
                        }

                        return;
                    }

                    // no balance?
                    self.$Balance.set( 'html', 'Balance: 0 STR' );

                    if ( typeof callback !== 'undefined' ) {
                        callback( result );
                    }

                    return;
                }


                console.log( result );

                if ( typeof callback !== 'undefined' ) {
                    callback( result );
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
        },


        /**
         * Stellar Call Methods
         */

        /**
         * Send the paper wallet account to a stellar address
         *
         * @param {String} destination - Address that receives the stellar
         * @param {Function} callback
         */
        sendAmountTo : function(receiver, callback)
        {
            var self = this;

            this.$Stellar.getAccountInfo( this.getAttribute( 'account_id' ), function(result)
            {
                console.log( result );



                self.$Stellar.request('submit', {
                    "secret"  : self.getAttribute( 'public_key' ),
                    "tx_json" : {
                        "TransactionType" : "Payment",
                        "Account"         : self.getAttribute( 'account_id' ),
                        "Destination"     : receiver,
                        "Amount": {
                            "currency" : "STR",
                            "value"    : "2",
                            "issuer"   : self.getAttribute( 'account_id' )
                        }
                    }
                }, function(result)
                {

                    callback( result );
                });

            });
        }
    });

});