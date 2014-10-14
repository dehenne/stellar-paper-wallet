
/**
 * QR Code creator
 *
 * @module wallet/QRCode
 * @author www.pcsg.de (Henning Leutz)
 */

define([

    'qui/QUI',
    'qui/controls/Control'

], function(QUI, QUIControl)
{
    "use strict";


    return new Class({

        Extends : QUIControl,
        Type    : 'wallet/QRCode',

        options : {
            height : 400,
            width  : 400,
            styles : false
        },

        /**
         * constructor
         *
         * @param {Object} options
         */
        initilialze : function(options)
        {
            this.parent( options );

            this.$data = {};
        },

        /**
         * Create a QRCode Image from the data
         *
         * @param {String} data
         * @return {DOMNode} img
         */
        create : function()
        {
            this.$Elm = new Element('div', {
                'class' : 'qrcode',
                styles : {
                    height : this.getAttribute( 'height' ),
                    width  : this.getAttribute( 'width' )
                }
            });

            if ( this.getAttribute( 'styles' ) ) {
                this.$Elm.setStyles( this.getAttribute( 'styles' ) );
            }

            return this.$Elm;
        },

        /**
         * Create the QRCode
         */
        setData : function(data)
        {
            this.$data = data;

            this.$Elm.set( 'html', '' );

            var SVGContainer = new Element( 'div#qrcode' );

            var SVG = new Qrcodesvg(
                JSON.encode( data ),
                SVGContainer,
                this.getAttribute( 'width' ),
                { ecclevel : 1 }
            );


            // add a bevel effect on patterns with a radius of 5.
            // apply one of these three colors to patterns
            SVG.draw({
                method : "bevel",
                radius : 3,
                "fill-colors": [
                    "#000000",
                    "#000000",
                    "#000000"
            ]}, {
                "stroke-width": 1
            });



            var Canvas = new Element( 'canvas', {
                id     : 'canvas',
                width  : this.getAttribute( 'width' ),
                height : this.getAttribute( 'height' )
            });

            canvg( Canvas, SVGContainer.innerHTML );

            var img = Canvas.toDataURL("image/png");

            // create image
            var Img = document.createElement( 'img' );
            Img.src = img;

            Img.inject( this.$Elm );

            this.$Elm.appendChild( Img );
        },

        /**
         * Return the QRCode data
         *
         * @return {Object}
         */
        getData : function()
        {
            return this.$data;
        },

        /**
         * Return the image data
         *
         * @return {String} image data
         */
        getImage : function()
        {
            return this.$Elm.getElement( 'img' ).src;
        }

    });
});
