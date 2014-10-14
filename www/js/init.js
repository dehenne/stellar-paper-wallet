
require.config({
    baseUrl : 'js/',
    paths : {
        'qui' : 'qui/build/qui'
    },
    map : {
        '*': {
            'css': 'js/qui/build/qui/lib/css.js'
        }
    }
});


var Init = function()
{
    require(['qui/QUI'], function(QUI)
    {
        QUI.addEvent('onError', function( err, url, line )
        {
            console.error( err +' - '+ url +' - '+ line );

            if ( typeof Error !== 'undefined' ) {
                console.warn( new Error().stack );
            }
        });

        require(['App'], function(App) {
            new App().inject( document.body );
        });
    });
}

var isPhonegap = function() {
    return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
}

if ( isPhonegap() )
{
    document.addEventListener('deviceready', function()
    {
        Init();
    }, false);

} else
{
    Init();
}
