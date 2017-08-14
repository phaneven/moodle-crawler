var casper = require('casper').create({
    verbose: true,
})

casper.start('https://www.w3schools.com/js/js_examples.asp').then(function(){
    this.capture('try1.png');
    this.thenClick('#main p a');
})

casper.waitForPopup(0, function() {
    this.capture('try2.png');
    
});

casper.withPopup(0, function() {
    this.waitForSelector('body', function(){
        this.capture('try3.png');
    })
});

casper.then(function() {

});

casper.run(function() {
    casper.echo('Done.').exit();
});