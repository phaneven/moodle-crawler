var fs = require('fs');
var casper = require('casper').create({
    verbose: true,
    pageSettings: {
        webSecurityEnabled: false
    }
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
    return document.querySelectorAll('.menu-opener div').length;
}
function clickVideoButtons(i) {
    document.querySelectorAll('.menu-opener')[i].click();
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
            // video_links.push(casper.evaluate(getVideoPages));
            if (this.exists('div.activityinstance a')) { //check whether has video button
                // this.echo('debug...');
                this.click('div.activityinstance a span');
            }
            // casper.then(function() {this.back()}); // go back to dashboard
            // casper.then(function() {casper.echo('Jump back to ' + this.getTitle() + ' ... ');});
        }); 
        break;  
    }
})

casper.waitForPopup(0, null, null, 100000);
casper.withPopup(0, function() {
    var classNum = 0;
    this.waitForSelector('.main-content', function(){
        classNum = this.evaluate(getClassNumber); 
        this.echo(classNum);
        var count = 1;
        this.repeat(classNum, function() {       
            this.waitForSelector('.content',function(){
                this.viewport(1600,1000);
                // this.echo(this.exists('div.class-row:nth-child('+ count +')'));
                // this.echo(this.exists('div.class-row:nth-child('+ count +') div.menu-opener'));
                
                this.click('div.class-row:nth-child('+ count +') div.menu-opener div');
                this.capture('click'+count+'.png');
                      
                // this.echo(this.exists('.menu-items'));
                this.then(function() {
                    
                    this.wait(1000, function() {
                        this.capture('download'+count+'.png');
                        this.clickLabel('Download original', 'a');
                    });
                });
                this.then(function() {
                    
                    // this.click('select');
                    // this.capture('hd.png');
                    // this.echo(this.exists('div.select-wrapper select option:nth-child(2)'));
                    // this.click('div.select-wrapper select option:nth-child(2)'); //hd
                    
                    // this.click('.right a');
                    
                    
                    // this.echo(this.getCurrentUrl());
                    // this.echo(this.evaluate(function(){
                    //         return 'https://echo360.org.au' + document.querySelector('.right a').getAttribute('href');
                    //     }));
                    this.wait(3000, function(){
                        var downloadUrl = this.evaluate(function(){
                            return 'https://echo360.org.au' + document.querySelector('.right a').getAttribute('href');
                        });
                        this.echo('lecture ' + count + ': ' + downloadUrl);
                        this.click('.right a') //click download button
                        count ++;
                    })
                    
                   
                });
            });
        });
    })    
});

casper.run(function () {
    casper.echo('Done.').exit();
});
