var axios = require("axios");

var client = axios.create({
    baseURL: "https://app.pendo.io",
    timeout: 10000,
    headers: {
        "X-Pendo-Integration-Key": process.env.BIPOLAR_PENDO_KEY,
        "Content-type": "application/json"
    }
});

module.exports.getUsage = function () {
    return getReport("2V6LUd60_3hXtd-N8K_fKPva_Hc").then(function(data) {
        var usage = data.reduce((acc, d) => {
            var entry = acc[d.account_agent_name] = acc[d.account_agent_name] || {
                visitors: 0,
                totalTime: 0,
                totalEvents: 0
            };

            entry.visitors++;
            return acc;
        }, {});

        data.forEach(d => {
            usage[d.account_agent_name].totalTime += d.eventTime;
            usage[d.account_agent_name].totalEvents += d.eventCount;
        });

        Object.keys(usage).forEach(account => {
            usage[account].avgTime = usage[account].totalTime / usage[account].visitors;
            usage[account].avgEvents = usage[account].totalEvents / usage[account].visitors;
        });

        return usage;
    });
};

function getReport(reportId) {
    return client.get("/api/v1/report/" + reportId + "/results.json")
        .then(function(result) {
            return result.data;
        }).catch(function(err) {
            console.log(err);
        });
}
