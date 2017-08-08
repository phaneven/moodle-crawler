var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});
var username = 'z5119693';
var password = 'hyw523974055^&*()';
var url = 'https://moodle.telt.unsw.edu.au/login/';

casper.start();
casper.thenOpen(url);

casper.then(function(){
    casper.echo('url opened');
    casper.waitForSelector('iframe', function(){
        casper.echo('form ready');
        casper.sendKeys('input#username', username);
        casper.sendKeys('input#password', password);
        casper.thenClick('input#submit');
        casper.echo('button clicked');
        // casper.waitForSelector('div[class="mobPass"]', function(){
        //     casper.sendKeys('input#password',password);
        //     casper.thenClick('input#submit');
        // }, 10000)
    }, function () {
        casper.echo('cannot find login form').die();
    }, 1000);
})

// casper.then(function(){
//     // console.log('success');
// })

casper.run();
