<template>
    <div>
        <div class="container-fluid">

            <div class="row">
                <div class="col-6 card mainPain" style="background-color:lavender;">
                    <system-information></system-information>
                </div>
                <div class="col-6 card mainPain" style="background-color:lavenderblush;">
                    <div class="row">
                        
                            <router-link class="col-5 card btnItem btn btn-default" to="/earnCheckPage">税金核对功能</router-link>
                        
                        
                            <router-link class="col-5 card btnItem btn btn-default" to="/VATCheck">增值税核对功能</router-link>
                        
                    </div>

                </div>
            </div>
        </div>
    </div>


</template>
<script>
    import SystemInformation from '../components/LandingPage/SystemInformation'
    export default {
        components: {
            SystemInformation
        },
        data() {
            return {
                msg: '这只是一个测试'
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            }
        }
    }
</script>
<style>
    .mainPain {
        height: 563px;
        align-content: center;
    }
    .btnItem{
        margin: 10px;
        padding: 0px;
    }

    .btnItem button{
        width: 100%;
        height: 200px;
    }
</style>