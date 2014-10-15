
/**
 * Main app
 *
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require qui/controls/loader/Loader
 * @require css!App.css
 */

define([

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'qui/controls/buttons/Button',
    'qui/controls/windows/Alert',
    'Call',
    'Wallet',

    'css!App.css'

], function(QUI, QUIControl, QUILoader, QUIButton, QUIAlert, Call, Wallet)
{
    "use strict";

    return new Class({

        Extends : QUIControl,
        Type    : 'App',

        Binds : [
            '$onInject'
        ],

        initialize : function(options)
        {
            this.parent( options );

            this.Loader = new QUILoader();

            this.$Header = null;
            this.$Body   = null;
            this.$Wallet = null;

            this.$MenuButton = null;

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
                'class' : 'app qui-box',
                html    : '<header class="app-header">' +
                              '<span class="fa fa-stack">'+
                                  '<span class="fa fa-rocket fa-stack-1x"></span>' +
                                  '<span class="fa fa-file-o fa-stack-2x"></span>' +
                              '</span>'+
                              '<span class="app-header-title">'+
                                  'Stellar Paper Wallet'+
                              '</span>' +
                          '</header>' +
                          '<main class="app-body"></main>'
            });

            this.Loader.inject( this.$Elm );


            this.$Header = this.$Elm.getElement( '.app-header' );
            this.$Body   = this.$Elm.getElement( '.app-body' );


            new QUIButton({
                text    : 'Create wallet',
                icon    : 'fa fa-qrcode',
                'class' : 'app-button-create-wallet',
                events  :
                {
                    onClick : function() {
                        self.createNewWallet();
                    }
                }
            }).inject( this.$Body );


            new QUIButton({
                text    : 'Scan wallet',
                icon    : 'fa fa-camera',
                'class' : 'app-button-scan-wallet',
                events  :
                {
                    onClick : function() {
                        self.scan();
                    }
                }
            }).inject( this.$Body );


            this.$MenuButton = new QUIButton({
                'class' : 'app-header-menuButton',
                icon    : 'fa fa-bars',
                events  :
                {
                    onClick : function()
                    {

                    }
                }
            }).inject( this.$Header );


            // events
            document.addEventListener("backbutton", function()
            {
                if ( self.$Wallet ) {
                    self.$Wallet.close();
                }
            }, false);


            return this.$Elm;
        },

        /**
         * resize elements
         */
        resize : function()
        {
            var size  = document.body.getSize(),
                hsize = this.$Header.getSize();

            this.$Body.setStyles({
                height : size.y - hsize.y
            });
        },

        /**
         * event : on inject
         */
        $onInject : function()
        {
            this.Loader.show();

            (function() {
                this.resize();
                this.Loader.hide();
            }).delay( 100, this )
        },

        /**
         * Opens a wallet
         *
         * @param {Object} walletData
         */
        openWallet : function(walletData)
        {
            var self = this;

            this.Loader.show();

            require(['Wallet'], function(Wallet)
            {
                self.$Wallet = new Wallet( walletData ).inject( self.$Body );

                var Btn = new QUIButton({
                    'class' : 'app-header-walletClose',
                    icon    : 'fa fa-chevron-left',
                    events  :
                    {
                        onClick : function(Btn)
                        {
                            self.$Wallet.close(function() {
                                self.$Wallet = null;
                            });
                        }
                    }
                }).inject( self.$Header );


                self.$Wallet.addEvents({
                    onDestroy : function() {
                        Btn.destroy();
                    },
                    onLoaded : function() {
                        self.Loader.hide();
                    }
                });

            });
        },

        /**
         * QRCode Scan
         */

        /**
         * Start the barcode scanner
         */
        scan : function()
        {
            var self    = this,
                scanner = cordova.require( "cordova/plugin/BarcodeScanner" );

            scanner.scan( function (result)
            {
                var data = JSON.decode( result.text );

                if ( !data )
                {
                    self.showScanError( '' );
                    return;
                }


                if ( typeof data.result === 'undefined' ||
                     typeof data.result.account_id === 'undefined' ||
                     typeof data.result.public_key === 'undefined'
                )
                {
                    self.showScanError();
                    return;
                }

                self.Loader.show();
                self.openWallet( data.result );

            }, function (error)
            {
                self.showScanError( error );
            });
        },

        /**
         * Show an error
         */
        showScanError : function(error)
        {
            if ( typeof error === 'undefined' ) {
                error = 'Perhaps the QR code is not a Stellar Wallet.';
            }

            new QUIAlert({
                title   : 'Error at QR-Code Scanning',
                message : 'Sorry, an error has occured while scanning the QR.<br />' +
                          '<br />' +
                          error
            }).open()
        },

        /**
         * New Wallet Creation
         */

        /**
         * Create a new cold wallet
         */
        createNewWallet : function()
        {
            var self    = this,
                Request = new Call();

            this.Loader.show( 'Create cold wallet ... one moment please ...' );

            Request.post(function(walletData)
            {
                if ( walletData.result )
                {
                    var data = walletData.result;

                    data.server = Request.getAttribute( 'server' );

                    self.openWallet( data );
                }

            }, {
                method : "create_keys"
            });
        }
    });
});
