
/**
 * left menu
 *
 * @module menu/Responsive
 * @author www.pcsg.de (Henning Leutz)
 */

define([

    'qui/controls/Control',
    'qui/controls/buttons/Button',
    'qui/controls/utils/Background',

    'css!menu/Responsive.css'

], function(QUIControl, QUIButton, QUIBackground)
{
    "use strict";

    return new Class({

        Extends : QUIControl,
        Type    : 'menu/Responsive',

        options : {
            searchButton : false
        },

        initialize : function(options)
        {
            var self = this;

            this.parent( options );

            this.$Background = new QUIBackground({
                events :
                {
                    onClick : function() {
                        self.hide();
                    }
                }
            });

            this.$Close   = null;
            this.$Content = null;

            this.$show = false;
            this.$FX   = null;
        },

        /**
         * Create the DOMNode
         *
         * @return {DOMNode}
         */
        create : function()
        {
            var self = this;

            this.$Elm = new Element('div', {
                'class' : 'qui-controls-menu-responsive',
                html    : '<div class="qcm-responsive-title">'+
                              '<div class="qcm-responsive-title-home">' +
                                  '<span>Menu</span>' +
                              '</div>' +
                              '<div class="qcm-responsive-title-close icon-remove fa fa-remove"></div>' +
                          '</div>' +
                          '<div class="qcm-responsive-content"></div>',
                styles : {
                    left : -500,
                    position : 'fixed',
                    width : 400
                }
            });

            this.$Close   = this.$Elm.getElement( '.qcm-responsive-title-close' );
            this.$Content = this.$Elm.getElement( '.qcm-responsive-content' );


            this.$Close.addEvents({
                click : function() {
                    self.hide();
                }
            });

            this.$FX = moofx( this.$Elm );

            return this.$Elm;
        },

        /**
         * append a menu item
         *
         * @param {Object} params - item params { text : '', icon : '' }
         * @return {this}
         */
        appendChild : function(params)
        {
            var icon = '';

            if ( typeof params.icon !== 'undefined' ) {
                icon = '<span class="qcm-responsive-content-entry-icon fa '+ params.icon +'"></span>';
            }

            var Elm = new Element('div', {
                'class' : 'qcm-responsive-content-entry',
                html    : '<div class="qcm-responsive-content-entry-text smooth box">'+
                              icon + params.text +
                          '</div>'
            }).inject( this.$Content );

            if ( typeof params.events !== 'undefined' ) {
                Elm.addEvents( params.events );
            }

            return this;
        },

        /**
         * toggle the menu
         */
        toggle : function()
        {
            if ( this.$show )
            {
                this.hide();
                return this;
            }

            this.show();
            return this;
        },

        /**
         * Show the menu
         */
        show : function()
        {
            this.$show = true;

            var self  = this,
                size  = document.body.getSize(),
                width = 400;

            if ( width > size.x * 0.9 ) {
                width = size.x * 0.9;
            }

            if ( !this.$Elm ) {
                this.inject( document.body );
            }

            if ( this.$Elm.getParent() == document.body )
            {
                this.$Elm.addClass( 'shadow' );

                if ( !this.$Background.getElm() ) {
                    this.$Background.inject( document.body );
                }

                this.$Background.show();
            }

            this.$Elm.setStyles({
                width : width
            });

            this.$Content.setStyles({
                height : size.y - 100
            });

            this.$FX.animate({
                left : 0
            }, {
                callback : function() {

                }
            });
        },

        /**
         * hide the menu
         */
        hide : function()
        {
            this.$show = false;
            this.$Background.hide();

            this.$FX.animate({
                left : '-100%'
            });
        }
    });
});