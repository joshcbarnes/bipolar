var csv = require("csvdata");

var csvData = csv.load(process.env.BIPOLAR_SPREADSHEET_PATH);

module.exports.getAccounts = function() {
    return csvData
        .catch(function(err) {
            console.log(err);
        })
        .then(function(result) {
            return result.map(data => ({
                name: data["Account Name"],
                arr: data["($) Total ARR"],
                currentSeats: data["Licenses Purchased"] ? data["Licenses Purchased"] : 0,
                totalSeats: data["Marketing Team Size"] ? data["Marketing Team Size"] : 0
            }));
        });
};
