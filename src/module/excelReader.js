var xlsx = require('node-xlsx');
var excelReader = {
    readExcel: function readExcel(path) {
        var obj = xlsx.parse(path);
        console.log(obj[0].data[0]);
        return obj;
    },

}



exports.excelReader = excelReader;