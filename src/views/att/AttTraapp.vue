<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="待提交" name="uncoapp"><UncoApp v-if="'uncoapp'===activeName"></UncoApp></el-tab-pane>
            <el-tab-pane label="流程中" name="inhaapp"><InhaApp v-if="'inhaapp'===activeName"></InhaApp></el-tab-pane>
            <el-tab-pane label="已完成" name="overapp"><OverApp v-if="'overapp'===activeName"></OverApp></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import UncoApp from "@/components/att/appatt/UncoApp"
    import InhaApp from "@/components/att/appatt/InhaApp";
    import OverApp from "@/components/att/appatt/OverApp";
    export default {
        name: "AttTraapp",
        data(){
            return{
                activeName: 'uncoapp'
            }
        },
        components:{
            UncoApp,
            InhaApp,
            OverApp
        }
    }
</script>

<style scoped>

</style>