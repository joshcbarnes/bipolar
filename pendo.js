var axios = require("axios");

var client = axios.create({
    baseURL: "https://app.pendo.io",
    timeout: 10000,
    headers: {
        "X-Pendo-Integration-Key": process.env.BIPOLAR_PENDO_KEY,
        "Content-type": "application/json"
    }
});

module.exports.getReport = function(reportId) {
    return client.get("/api/v1/report/" + reportId + "/results.json")
        .then(function(result) {
            return result.data;
        }).catch(function(err) {
            console.log(err);
        });
};
