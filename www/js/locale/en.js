

define(['qui/Locale'], function(QUILocale)
{
    "use strict";

    QUILocale.set('en', 'pcsg/stellar-wallet', {

        about : '' +
            '<h1>Stellar-Paper-Wallet</h1>' +
            '<p>Smartphone App for creating and handling stellar paper wallets.</p>' +
            '<p>The App is at an early development stage. The stellar server address is set to https://test.stellar.org:9002, at the moment Note</p>' +
            '<ul>' +
                '<li>The app never stores the wallet keys on the phone. If you dont print / save your wallet, the "stellar wallet" is lost.</li>' +
                '<li>The keys are kept only as long as the wallet is open.</li>' +
                '<li>The paper wallets (images, pdf) should not be stored on the phone for a long time.</li>' +
            '</ul>' +

            '<h2>Features</h2>' +
            '<ul>' +
                '<li>Create new cold stellar wallets and generate the QR-Code of it</li>' +
                '<li>Read stellar paper wallets</li>' +
                '<li>You can send or save your paper wallet</li>' +
                '<li>You can scan a paper wallet and copy the stellar address to the clipboard</li>' +
                '<li>You can read your paper wallet and send amounts from it to another stellar address</li>' +
            '</ul>' +

            '<h2>Resources</h2>' +
            '<ul>' +
                '<li>Introducing Stellar - https://www.stellar.org/blog/introducing-stellar/</li>' +
                '<li>Stellar Developers - https://www.stellar.org/developers/</li>' +
                '<li>What is a paper wallet - https://en.bitcoin.it/wiki/Paper_wallet</li>' +
            '</ul>' +

            '<h2>Contribute</h2>' +
            '<ul>' +
                '<li>Issue Tracker: github.com/dehenne/stellar-paper-wallet/issues</li>' +
                '<li>Source Code: github.com/dehenne/stellar-paper-wallet</li>' +
            '</ul>' +

            '<h2>Support</h2>' +
            '<p>If you are having issues, please let me know.</p>' +

            '<h2>License</h2>' +
            '<p>The project is licensed under the BSD license.</p>'

    });



    return QUILocale;
});