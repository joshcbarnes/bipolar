var express = require("express");
var app = express();
var pendo = require("./pendo.js");
var sf = require("./sf.js");
var sha256 = require("sha256");
var fuzz = require("fuzzball");

app.use(express.static('client'))

app.get("/organizations", function(req, res) {
    console.log("Fetching Org Data");
    Promise.all([
        sf.getAccounts(),
        pendo.getUsage()
    ]).then(function(results) {
        var orgNames = {};

        var sfData = results[0].reduce(function(acc, account) {
            acc[account.name] = account;
            return acc;
        }, {});

        var pendoUsageData = results[1];

        var organizations = formatBaseOrgs(sfData);

        organizations.forEach(org => populateHappiness(org, pendoUsageData));

        normalizeHappiness(organizations);
        res.send(organizations);
    }).catch(function(err) {
        console.log(err);
        res.status(500);
        res.send("lol we dun goofed");
    });
});

function formatBaseOrgs(sfData) {
    var organizations = [];
    Object.keys(sfData).forEach(orgName => {
        var org = {
            id: sha256(orgName),
            name: orgName,
            logoUrl: null,
            arr: sfData[orgName].arr,
            currentSeats: null,
            totalSeats: null
        };

        if (!organizations.find(org => { return org.name === orgName })) {
            organizations.push(org);
        }
    });

    return organizations;
}

function populateHappiness(org, pendoUsageData) {
    var bestPendoOrg = null;
    Object.keys(pendoUsageData).forEach(p => {
        if (bestPendoOrg == null || fuzz.distance(p, org.name) < fuzz.distance(bestPendoOrg.name, org.name)) {
            bestPendoOrg = pendoUsageData[p];
        }
    });

    org.happiness = Math.sqrt(2 * bestPendoOrg.visitors * bestPendoOrg.avgTime * bestPendoOrg.avgEvents);
}

function normalizeHappiness(organizations) {
    var maxHappiness = 0;
    organizations.forEach(org => {
        if (org.happiness > maxHappiness) {
            maxHappiness = org.happiness;
        }
    });

    organizations.forEach(org => {
        org.happiness = org.happiness / maxHappiness;
    });
}

app.listen(8080);
