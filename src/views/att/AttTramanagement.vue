<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="待处理申请" name="readydoapp"><ReadyDoApp v-if="'readydoapp'===activeName"></ReadyDoApp></el-tab-pane>
            <el-tab-pane label="历史记录" name="finishedapp"><FinishedApp v-if="'finishedapp'===activeName"></FinishedApp></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ReadyDoApp from "@/components/att/manaapp/ReadyDoApp";
    import FinishedApp from "@/components/att/manaapp/FinishedApp";
    export default {
        name: "AttTramanagement",
        data(){
            return{
                activeName: 'readydoapp'
            }
        },
        components:{
            ReadyDoApp,
            FinishedApp
        }
    }
</script>

<style scoped>

</style>