<template>
    <div class="page_earningCheck">
        <div class="btn btn-info getbtn" @click="makeTemp()">获取税金核对样例表</div>
        <div style="height:300px">
            <drop-file-comp @ensureClick='clickSubmit' @goback="goBack"></drop-file-comp>
        </div>
        <div id="bg"></div>
        <div id="show">
            <div>
                <img src="../assets/loading.gif" alt="loading">
                
            </div>
            <div>{{ loadingText }}</div>
        </div>
    </div>

</template>
<script>
import DropFileComp from '../components/DropFileComp.vue';
const shell = require('electron').shell;
    export default {
        components: {
            DropFileComp
        },
        methods: {
            clickSubmit:function(file){
                console.log("file"+file);
                if (file == "" || file == undefined) {
                    alert("未选择文件！！");
                } else if (file.name.split(".").pop().toLowerCase() == "xlsx") {
                    this.showWait();
                    this.doCheck(file.path);
                } else {
                    alert("请选择符合格式的文件（xlsx）！");
                }
            },
            goBack:function(){
                // ipcRenderer.send('open', 'mainWindowPage');
                this.$router.push({
                    path: '/'
                })
            },
            doCheck(path) {
                console.log('doCheck')
                var arg={
                    name:"earningCheck",
                    data:path
                }
                _ipcRenderer.send('toBack', arg);

            },
            showWait() {
                document.getElementById("bg").style.display ="block";
                document.getElementById("show").style.display ="block";
                var waitSize=0;
                this.waitFlag=setInterval(()=>{
                    waitSize++;
                    this.loadingText+='●';
                    if(waitSize==4){
                        waitSize=0;
                        this.loadingText='loading●';
                    }
                },800)


            },
            hideWait() {
                document.getElementById("bg").style.display = 'none';
                document.getElementById("show").style.display = 'none';
                this.loadingText='loading●';
                clearInterval(this.waitFlag);
                alert('数据处理完毕！请查看原文件！');
            },
            makeTemp(){
                console.log("开始 makeTemp()");
                
                var path=this.path;
                var jsonData=[];
                jsonData.push({data:[["收入凭证号*", "收入金额*", "该凭证下总收入", "税单凭证号*", "应交税费*", "税率*", "该税单应交金额", " ", "差额"]]});
                var arg={
                    name:"makeTemp",
                    data:{
                        jsonData:jsonData,
                        path:path,
                        fileName:"税金核对样例.xlsx"
                    }
                }
                _ipcRenderer.send('toBack', arg);
            },

        },
        data() {
            return {
                pagePath: '/earnCheckPage',
                file: '',
                loadingText: 'loading●',
                waitFlag:'',
                url:'',
                path:"D:\\pugCheckTemp",
            }
        },
        mounted() {
        
            this.url=location.href;
            _ipcRenderer.on('excelReadOver', (event, arg) => {
                this.hideWait();
            });

             _ipcRenderer.on('TempMakeOver',(event,arg)=>{
                console.log("收到 税金核对 TempMakeOver");
                shell.openItem(this.path);
            });

        }
    }
</script>

<style type="text/css">
    #bg {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: black;
        z-index: 1001;
        -moz-opacity: 0.7;
        opacity: .70;
        filter: alpha(opacity=70);
    }

    #show {
        display: none;
        position: absolute;
        top: 25%;
        left: 40%;
        width: 20%;
        height: 30%;
        padding: 8px;
        border: 8px solid #E8E9F7;
        background-color: white;
        z-index: 1002;
        overflow: auto;
    }

    #center{
        position: relative;
        left: 20%;
    }

</style>
<style lang="scss" scoped>
    .page_earningCheck{
        .getbtn{
            margin: 10px;
        }
    }
</style>
