/*
 * @Author: yizy
 * @Description: TODO
 * @Date: 2019-01-28 08:58:56
 * @LastEditors: yizy
 * @LastEditTime: 2019-01-29 15:56:03
 */
var xlsx = require('node-xlsx');
var excelReader = {
    readExcel: function readExcel(path) {
        var obj = xlsx.parse(path);
        console.log(obj[0].data[0]);
        return obj;
    },

}
exports.excelReader = excelReader;