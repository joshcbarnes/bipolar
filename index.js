var express = require("express");
var app = express();
var pendo = require("./pendo.js");
var sf = require("./sf.js");

app.use(express.static('client'))

app.get("/organizations", function(req, res) {
    console.log("Fetching Org Data");

    Promise.all([
        pendo.getAccounts(),
        sf.getAccountData()
    ]).then(function(results) {
        var pendoData = results[0];
        var sfData = results[1];

        var orgMap = pendoData.reduce(function(acc, account) {
            var org = {
                name: account.name
            };

            acc[org.name] = org;
            return acc;
        }, {});

        sfData.forEach(function(account) {
            var org = orgMap[account.name];
            if (!org) {
                console.log("Can't reconcile pendo and sf data: " + account.name);
            } else {
                org.logoUrl = null;
                org.arr = null;
                org.currentSeats = null;
                org.totalSeats = null;
            }
        });

        res.send(Object.keys(orgMap).map(orgName => orgMap[orgName]));
    }).catch(function(err) {
        console.log(err);
        res.status(500);
        res.send("lol we dun goofed");
    });
});

app.listen(8080);
