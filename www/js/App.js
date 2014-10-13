
/**
 * Main app
 *
 * @author www.pcsg.de (Henning Leutz)
 */

define([

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',

    'css!App.css'

], function(QUI, QUIControl, QUILoader)
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
                html    : '<header class="app-header"></header>' +
                          '<main class="app-body"></main>'
            });

            this.Loader.inject( this.$Elm );


            return this.$Elm;
        },

        /**
         * event : on inject
         */
        $onInject : function()
        {
            this.Loader.show();
        }
    });

});