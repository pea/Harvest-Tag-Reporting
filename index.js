var moment = require('moment');
var Harvest = require('harvest');
var prompt = require('prompt');
var chalk = require('chalk');
var winston = require('winston');

prompt.start();

var schema = {
    properties: {
        email: {
            default: ''
        },
        password: {
            hidden: true,
            default: ''
        },
        subdomain: {
            default: ''
        },
        fromDate: {
            default: moment().weekday(-6).format('D MMM YY')
        },
        toDate: {
            default: moment().weekday(0).format('D MMM YY')
        },
        tag: {
            description: 'Tag to group by (1,2 or 3)',
            default: 1
        }
    }
};

prompt.get(schema, (err, config) => {

    var harvest = new Harvest({
        subdomain: config.subdomain,
        email: config.email,
        password: config.password
    });

    var TimeTracking = harvest.timeTracking;
    var User = harvest.users;
    var Reports = harvest.reports;
    var Projects = harvest.projects;

    config.tag-=1;

    var state = {
        projects: []
    }

    var fromDate = moment(config.fromDate, 'D MMM YY').format('YYYYMMDD');
    var toDate = moment(config.toDate, 'D MMM YY').format('YYYYMMDD');

    getAllProjects();

    getUser(config.email)
    .then((user) => { return getReport(user.id, config.fromDate, config.toDate) })
    .then((data) => { return filterData(data) })
    .then((results) => { return generateReport(results) })
    .then((results) => { return displayReport(results) })
    .catch(() => { console.log('Failed') })

    // Get user id from email
    
    function getUser(userEmail) {
        return new Promise(function(resolve, reject) {
            User.list({}, function(err, users) {
                users.body.forEach((user) => {
                    if (user.user.email == userEmail) {
                        resolve(user.user)
                    }
                })
            });
        });
    }

    // Get report from Harvest

    function getReport(userId, fromDate, toDate) {
        return new Promise(function(resolve, reject) {
            Reports.timeEntriesByUser(userId, {from: fromDate, to: toDate}, function(err, report) {
                resolve(report.body)
            });
        });
    };

    // Get all projects and save in state

    function getAllProjects() {
        return new Promise(function(resolve, reject) {
            Projects.list({}, function(err, projects) {
                state.projects = projects.body
                resolve(projects)
            });
        });
    }

    // Get projects from Harvest

    function getProject(id){
        return new Promise(function(resolve, reject) {
            state.projects.forEach((project) => {
                if (project.project.id == id) {
                    resolve(project)
                }
            })
        });
    }

    // Add additional data to Harvest entries

    function filterData(report) {
        return new Promise(function(resolve, reject) {
            var results = [];
            var itemsProcessed = 0;
            report.forEach((entry, index) => {
                getProject(entry.day_entry.project_id)
                .then((project) => {
                    if (typeof(project.project.name) !== 'undefined') {
                        var projectName = parseName(project.project.name)
                        if (projectName != false && typeof(projectName.tags[config.tag]) !== 'undefined') {
                            results.push({
                                tag: projectName.tags[config.tag],
                                project_name: projectName.name,
                                spent_at: entry.day_entry.spent_at,
                                hours: entry.day_entry.hours
                            })
                        }
                    } else {
                        console.log(project)
                    }
                    itemsProcessed++;
                    if(itemsProcessed === report.length) {
                        resolve(results)
                    }
                }, () => {
                    console.log('Project not found')
                })
                .catch((err) => {
                    console.log('Couldn\'t append data to report')
                    console.log(err)
                });
            })
        });
    }

    // Generate report

    var generateReport = function(data) {
        return new Promise(function(resolve, reject) {
            var report = [];
            var itemsProcessed = 0;
            report.push({
                tag: data[0].tag,
                hours: roundHours(data[0].hours)
            })
            data.splice(0, 1)
            data.forEach((entry) => {
                var exists = false
                report.forEach((item, index) => {
                    if (item.tag == entry.tag && itemsProcessed < data.length) {
                        report[index].hours += roundHours(entry.hours)
                        exists = true
                    }
                })
                if (!exists) {
                    report.push({
                        tag: entry.tag,
                        hours: roundHours(entry.hours)
                    })
                }
                itemsProcessed++;
                if(itemsProcessed === data.length) {
                    resolve(report)
                }
            })
        });
    }

    var displayReport = function(results) {
        // Header
        console.log('')
        console.log(chalk.gray(moment(config.fromDate, 'D MMM YY').format('DD/MM/YYYY') + ' - ' + moment(config.toDate, 'D MMM YY').format('DD/MM/YYYY')))
        console.log('')

        // Per Tag
        results.forEach((item) => {
            console.log(
                chalk.bold.yellow(item.tag) + ': ' + chalk.cyan(item.hours + ' hours')
            )
        })

        // Total
        var total = 0;
        results.forEach((item) => {
            total += item.hours;
        })
        console.log('')
        console.log(
            chalk.bold.yellow('Total') + ": " + chalk.cyan(total + ' hours')
        )
        console.log('')
    }

});

var roundHours = function(number) {
    return Math.ceil(number / 0.25) * 0.25
}

var parseName = function(name) {
    var match = name.match(/(\[(.*?)\])|(?!$) \S(.*?)+/g);

    if (match == null) {
        return false;
    }

    var match = match.reverse();
    var name = match[0];
    match.splice(0, 1);
    var i = 0;
    var tags = [];
    while(typeof(match[i]) !== 'undefined'){
        tags.push(match[i].replace(/[\[\]']+/g, ''));
        i++;
    }
    return {
        name: name.trim(),
        tags: tags.reverse()
    };
}