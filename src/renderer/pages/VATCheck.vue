<template>
    <div class="page_VATCheck">
        <div class="btn btn-info getbtn" @click="makeTemp()">获取增值税核对样例表</div>
        <div style="height:300px">
            <drop-file-comp @ensureClick='onSubmit' @goback="onBack"></drop-file-comp>
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
    import DropFileComp from '../components/DropFileComp.vue'
    const shell = require('electron').shell;
    export default {
        components: {
            DropFileComp
        },
        methods: {
            onSubmit: function (file) {
                if (file == "" || file == undefined) {
                    alert("未选择文件！！");
                } else if (file.name.split(".").pop().toLowerCase() == "xlsx") {
                    this.showWait();
                    this.doCheck(file.path);
                } else {
                    alert("请选择符合格式的文件（xlsx）！");
                }
            },
            onBack: function () {
                this.$router.push({
                    path: '/'
                })
            },
            showWait() {
                document.getElementById("bg").style.display = "block";
                document.getElementById("show").style.display = "block";
                var waitSize = 0;
                this.waitFlag = setInterval(() => {
                    waitSize++;
                    this.loadingText += '●';
                    if (waitSize == 4) {
                        waitSize = 0;
                        this.loadingText = 'loading●';
                    }
                }, 800)


            },
            hideWait() {
                document.getElementById("bg").style.display = 'none';
                document.getElementById("show").style.display = 'none';
                this.loadingText = 'loading●';
                clearInterval(this.waitFlag);
                alert('数据处理完毕！请查看原文件！');
            },
            doCheck(path) {
                console.log('doCheck');
                var arg={
                    name:"VATCheck",
                    data:path
                }
                _ipcRenderer.send('toBack', arg);

            },
            makeTemp(){
                console.log("开始 makeTemp()");
                
                var path=this.path;
                var jsonData=[];
                jsonData.push({data:[["发票号码", "本币金额", "增值税发票号", "出项金额", "核对结果"]]});
                var arg={
                    name:"makeTemp",
                    data:{
                        jsonData:jsonData,
                        path:path,
                        fileName:"增值税核对样例.xlsx"
                    }
                }
                _ipcRenderer.send('toBack', arg);
            },
        },
        data() {
            return {
                loadingText: 'loading●',
                waitFlag: '',
                url: '',
                path:"D:\\pugCheckTemp",
            }
        },
        mounted(){
            _ipcRenderer.on('excelReadOver',(event,arg)=>{
                console.log("收到 VAT 核对 excelReadOver");
                this.hideWait();
            });

            _ipcRenderer.on('TempMakeOver',(event,arg)=>{
                console.log("收到 VAT 核对 TempMakeOver");
                shell.openItem(this.path);
            });
        }
    }
</script>
<style lang="scss" scoped>
    .page_VATCheck{
        .getbtn{
            margin: 10px;
        }
    }
</style>
