var express = require("express");
var app = express();
var pendo = require("./pendo.js");

app.get("/", function(req, res) {
    pendo.getReport("2V6LUd60_3hXtd-N8K_fKPva_Hc").then(function(data) {
        res.send(data);
    });
});

app.listen(8080);
