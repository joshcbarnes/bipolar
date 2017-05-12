var express = require("express");
var app = express();
var pendo = require("./pendo.js");
var sf = require("./sf.js");
var sha256 = require("sha256");

app.use(express.static('client'))

app.get("/organizations", function(req, res) {
    console.log("Fetching Org Data");
    Promise.all([
        pendo.getAccounts(),
        sf.getAccountData()
    ]).then(function(results) {
        var pendoData = results[0].reduce(function(acc, account) {
            acc[account.name] = account;
            return acc;
        }, {});

        var sfData = results[1].reduce(function(acc, account) {
            acc[account.name] = account;
            return acc;
        }, {});

        var organizations = formatBaseOrgs(pendoData, sfData);
        organizations.forEach(org => populateSFAttributes(org, sfData))
        organizations.forEach(org => populateHappiness(org));

        res.send(organizations);
    }).catch(function(err) {
        console.log(err);
        res.status(500);
        res.send("lol we dun goofed");
    });
});

function formatBaseOrgs(pendoData, sfData) {
    var organizations = [];
    Object.keys(pendoData).forEach(orgName => {
        var org = {
            id: sha256(orgName),
            name: orgName
        };

        if (!organizations.find(org => { return org.name === orgName })) {
            organizations.push(org);
        }
    });

    Object.keys(sfData).forEach(orgName => {
        var org = {
            id: sha256(orgName),
            name: orgName
        };

        if (!organizations.find(org => { return org.name === orgName })) {
            organizations.push(org);
        }
    });

    return organizations;
}

function populateSFAttributes(org, sfData) {
    if (sfData[org.name]) {
        var account = sfData[org.name];

        org.logoUrl = null;
        org.arr = account.arr;
        org.currentSeats = null;
        org.totalSeats = null;
    } else {
        console.log("Can't reconcile pendo and sf data: " + org.name);
    }
}

function populateHappiness(org) {
    org.happiness = Math.random();
}

app.listen(8080);
