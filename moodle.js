var casper = require('casper').create({
    verbose: true,
    // logLevel: "debug"
});
var username = 'z5119693';
var password = 'hyw523974055^&*()';
var url = 'https://moodle.telt.unsw.edu.au/login/';
var course_titles = [];
var course_links = [];

function getCourses() {
    var courses = document.querySelectorAll('h2.title a');
    return [Array.prototype.map.call(courses, function(e) {
        return e.getAttribute('title');
    }), Array.prototype.map.call(courses, function(e) {
        return e.getAttribute('href');
    })]
}

casper.start();
casper.thenOpen(url);

casper.then(function(){
    casper.echo('crawlering ' + this.getTitle() + ' ... ');
    casper.waitForSelector('iframe', function () {
        casper.withFrame(0, function() {
            casper.echo('login ...');
            casper.sendKeys('input#username', username);
            casper.sendKeys('input#password', password);
            casper.thenClick('input#submit');
            casper.echo('login verified');
        });
    }, function () {
        casper.echo ('cannot load frame').die();
    }, 1000);
    
})
casper.page.settings.webSecurityEnabled = false;

casper.then(function(){
    casper.echo('crawlering ' + this.getTitle() + ' ... ');
    casper.waitForSelector('.course_list', function () {
        course_titles = casper.evaluate(getCourses)[0];
        course_links = casper.evaluate(getCourses)[1];
        casper.echo("COURSES: ");
        for (i in course_titles) {
            casper.echo(course_titles[i] + ' : ' + course_links[i]);
        }
    });
})

casper.then(function(){
    casper
});

casper.run(function () {
    casper.echo('Done.').exit();
});