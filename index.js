var express = require("express");
var axios = require("axios");
var app = express();

var pendoClient = axios.create({
    baseURL: "https://app.pendo.io/",
    timeout: 1000,
    headers: {
        "X-Pendo-Integration-Key": process.env.BIPOLAR_PENDO_KEY,
        "Content-type": "application/json"
    }
});

app.get("/", function(req, res) {
    res.send("Hello world");
});

app.listen(8080);
