var fs = require('fs');
var casper = require('casper').create({
    verbose: true,
    // logLevel: "debug"
});
var username = 'z5119693';
var password = 'hyw523974055^&*()';
var url = 'https://moodle.telt.unsw.edu.au/login/';
var course_titles = [];
var course_links = [];
var video_links = [];
var course = {};

function getCourses() {
    var courses = document.querySelectorAll('h2.title a');
    return [Array.prototype.map.call(courses, function(e) {
        return e.getAttribute('title');
    }), Array.prototype.map.call(courses, function(e) {
        return e.getAttribute('href');
    })]
}

function getVideoPages() {
    var page = document.querySelector('div.activityinstance a');
    return page.getAttribute('href');  
}

function getVideos() {
    var videos = document.querySelectorAll('div.menu-opener');
}

function getClassNumber() {
    var n = document.querySelectorAll('.menu-opener').length;
    return n;
}

casper.start();
casper.thenOpen(url);

casper.then(function(){
    casper.echo('crawling ' + this.getTitle() + ' ... ');
    casper.waitForSelector('iframe', function () {
        casper.withFrame(0, function() {
            casper.echo('login ...');
            casper.sendKeys('input#username', username);
            casper.sendKeys('input#password', password);
            casper.thenClick('div.visible-xs input#submit');
        });
    }, function () {
        casper.echo ('cannot load frame').die();
    }, 1000);
    
})

casper.then(function(){
    casper.echo('crawling ' + this.getTitle() + ' ... ');
    casper.waitForSelector('.course_list', function () {
        course_titles = casper.evaluate(getCourses)[0];
        course_links = casper.evaluate(getCourses)[1];
        casper.echo("\nCOURSES: ");
        for (i in course_titles) {
            casper.echo(course_titles[i] + ' : ' + course_links[i]);
        }
    });
})

// use thenOpen to go to the next link
casper.then(function() {
    casper.echo("\nCOURSES: ");
    for (i in course_titles) {
        casper.thenOpen(course_links[i]);
        casper.waitForSelector('.activityinstance', function () {
            casper.echo('Jump to ' + this.getTitle() + ' ... ' + 'get video page link');
            video_links.push(casper.evaluate(getVideoPages));
            // if (this.exists('div.activityinstance a')) this.echo('debug...');
            casper.then(function() {this.back()}); // go back to dashboard
            casper.then(function() {casper.echo('Jump back to ' + this.getTitle() + ' ... ');});
        });   
    }
    
})

casper.then(function() {
    for (i in video_links) {
        this.echo(video_links[i]);
        casper.thenOpen(video_links[i]);
        casper.waitForSelector('body', function () {
            casper.echo('crawling ' + this.getTitle() + '...');
            // casper.thenClick('div.media-icons menu-opener');
            if(this.exists('div.nav')) {
                this.echo('echo-log');
                // var n = this.evaluate(getClassNumber);
                // this.echo(n);
            }
        });
    }

})

casper.run(function () {
    casper.echo('Done.').exit();
});