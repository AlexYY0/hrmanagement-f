<template>
    <div>
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="班次管理" name="busihour"><BusiHour v-if="'busihour'===activeName"></BusiHour></el-tab-pane>
            <el-tab-pane label="排班管理" name="empsche"><EmpSche v-if="'empsche'===activeName"></EmpSche></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import BusiHour from "@/components/att/ws/BusiHour";
    import EmpSche from "@/components/att/ws/EmpSche";
    export default {
        name: "AttWs",
        data(){
            return{
                activeName: 'busihour'
            }
        },
        components:{
            BusiHour,
            EmpSche
        }
    }
</script>

<style scoped>

</style>