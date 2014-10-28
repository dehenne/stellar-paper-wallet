
require.config({
    baseUrl : 'js/',
    paths : {
        'qui' : 'qui/qui'
    },
    map : {
        '*': {
            'css': 'js/qui/build/qui/lib/css.js'
        }
    }
});


var Init = function()
{
    // locale language
    var language = window.localStorage.getItem( "settings.language" );

    switch ( language )
    {
        case 'de':
        case 'en':
        break;

        default:
            language = 'en';
        break;
    }

    var needles = ['qui/QUI', 'qui/Locale'];
        needles.push( 'locale/'+ language );


    // load app
    require( needles, function(QUI, QUILocale)
    {
        QUI.addEvent('onError', function( err, url, line )
        {
            console.error( err +' - '+ url +' - '+ line );

            if ( typeof Error !== 'undefined' ) {
                console.warn( new Error().stack );
            }
        });

        // QUILocale.setCurrent();


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
    document.addEventListener('deviceready', function() {
        Init();
    }, false);

} else
{
    Init();
}
