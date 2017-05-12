var csv = require("csvdata");

var csvData = csv.load(process.env.BIPOLAR_SPREADSHEET_PATH);

module.exports.getAccountData = function() {
    return csvData
        .catch(function(err) {
            console.log(err);
        })
        .then(function(result) {
            return result.map(data => ({
                name: data["ORG Name"],
                arr: data.ARR
            }));
        });
};
