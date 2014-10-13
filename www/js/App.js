
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

    'css!App.css'

], function(QUI, QUIControl, QUILoader, QUIButton)
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
                'class' : 'app qui-box',
                html    : '<header class="app-header">' +
                              '<span>Stellar Paper Wallet</span>' +
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
                    onClick : function()
                    {

                    }
                }
            }).inject( this.$Body );


            new QUIButton({
                text    : 'Scan wallet',
                icon    : 'fa fa-camera',
                'class' : 'app-button-scan-wallet',
                events  :
                {
                    onClick : function()
                    {

                    }
                }
            }).inject( this.$Body );



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
        }
    });

});
