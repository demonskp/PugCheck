<template>
    <div class="dropfilecomp">
        <div class="holder" id="holder">
            <div id="holdText">{{showText}}</div>
        </div>
        <button id="fileInput" @click="clickSubmit()">提交</button>
        <button id="fileInput" @click="goBack()">返回</button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                file:'',
                showText:"把文件拖到这里",
            }
        },
        methods: {
            clickSubmit() {
                var file = this.file;
                this.$emit('ensureClick',file);
            },
            goBack() {
                this.$emit('goback');
            },
        },
        props: {
            name: String,
        },
        mounted() {
            var file = "";
            var holder = document.getElementById('holder');
            holder.ondragover = function () {
                return false;
            };
            holder.ondragleave = holder.ondragend = function () {
                return false;
            };


            holder.ondrop = (e) => {
                e.preventDefault();

                file = e.dataTransfer.files[0];
                this.file = file;

                this.showText = file.name;
                return false;
            };
            var heightString=window.getComputedStyle(holder).height;
            heightString=Number(heightString.substring(0,heightString.length-2));

            // document.getElementById('holdText').setAttribute('style','padding-top:'+ heightString/2+'px');
             
        }
    }
</script>
<style lang="scss" scoped>

.dropfilecomp{
    height:100%;
    .holder{
            width: 100%;
            height: 100%;
            // background: #8CA91C;
            align-content: center;
            border: 10px solid green;
            position: relative;


            #holdText{
               width: 150px;
                height: 100px;
                position: absolute;
                top: 50%;
                left: 44%;
                margin: -50px 0 0 0;
                line-height: 100px;
            }
        }
}


    
   
</style>
