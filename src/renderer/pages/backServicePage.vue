<template>
    <div>
        <div class="container-fluid">

            <div class="row">
                <div class="col-6" style="background-color:lavender;">.col-6</div>
                <div class="col-6" style="background-color:lavenderblush;">

                </div>
            </div>
            <div class="alert alert-success">
                <strong>成功!</strong> 指定操作成功提示信息。
            </div>

        </div>
    </div>
</template>

<script>
const fs = require('fs');
    export default {
        methods: {
            earningCheck: function (arg) {
                console.log('earningCheck()调用')
                var excelData = _excelReader.readExcel(arg);
                console.log(excelData);
                var newdata = _checkEarning.getAllDifference(excelData);
                // var newdata = _checkEarning.taxCheck(excelData);
                console.log(newdata);
                _checkEarning.writeExcel(newdata, arg);
                _ipcRenderer.send('backReturn', {
                    name: 'excelReadOver',
                    data: ''
                })
            },
            VATCheck: function (arg) {
                console.log('VATCheck()调用');
                var excelData = _excelReader.readExcel(arg);
                console.log(excelData);
                // var newdata = _checkEarning.getAllDifference(excelData);
                var newdata = _checkEarning.taxCheck(excelData);
                console.log(newdata);
                _checkEarning.writeExcel(newdata, arg);
                _ipcRenderer.send('backReturn', {
                    name: 'excelReadOver',
                    data: ''
                })
            },
            getTemp:function(jsonData,path,fileName){
                console.log("getTemp() 开始")
                fs.exists(path,function(exists){
                    if(exists){
                        console.log("存在该文件夹");
                        _checkEarning.writeExcel(jsonData,path+"\\"+fileName);
                    }else{
                        console.log("不存在该文件夹");
                        fs.mkdir(path,function(){
                            _checkEarning.writeExcel(jsonData,path+"\\"+fileName);
                        })
                    }
                    _ipcRenderer.send('backReturn', {
                        name: 'TempMakeOver',
                        data: ''
                    })
                })
            }

        },
        mounted() {
            _ipcRenderer.on('backService', (event, arg) => {
                console.log('back 收到')
                switch (arg.name) {
                    case 'earningCheck':
                        this.earningCheck(arg.data);
                        break;
                    case 'VATCheck':
                        this.VATCheck(arg.data);
                        break;
                    case 'makeTemp':
                        this.getTemp(arg.data.jsonData,arg.data.path,arg.data.fileName);
                        break;
                }

            });


        }
    }
</script>