var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});
var username = 'z5119693';
var password = 'hyw523974055^&*()';
var url = 'https://moodle.telt.unsw.edu.au/login/';
var courses = [];

function getCourses() {
    var courses = document.querySelectorAll('h2.title a');
    return Array.prototype.map.call(courses, function(e) {
        return e.getAttribute('title');
    });
}

casper.start();
casper.thenOpen(url);

casper.then(function(){
    casper.echo('url opened');
    casper.waitForSelector('iframe', function () {
        casper.withFrame(0, function() {
            casper.sendKeys('input#username', username);
            casper.sendKeys('input#password', password);
            casper.thenClick('input#submit');
            casper.echo('button clicked');
        });
    }, function () {
        casper.echo ('cannot load frame').die();
    }, 1000);
    
})
casper.page.settings.webSecurityEnabled = false;

casper.then(function(){
    casper.echo(this.getTitle());
    casper.waitForSelector('.course_list', function () {
        courses = casper.evaluate(getCourses);
        for (i in courses) {
            casper.echo(courses[i]);
        }
        // casper.echo(courses.length);
    });
})


casper.run(function () {
    casper.echo('Done.').exit();
});
