<template>
    <div style="width: 45%">
        <div>
            <div style="display: flex;justify-content: space-between">
                <el-button type="primary" icon="el-icon-plus" @click="AddBhView">
                    添加班次
                </el-button>
                <el-button type="danger" icon="el-icon-delete" @click="batchDeleteBh">批量删除班次</el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    stripe
                    border
                    max-height="513"
                    :data="businesshourss"
                    v-loading="businesshoursLoading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        align="center"
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        fixed
                        prop="busihoursid"
                        label="编号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="busihoursname"
                        label="班次名称"
                        align="left"
                        width="110">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="begintime"
                        label="上班时间"
                        align="left"
                        width="110">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="endtime"
                        label="下班时间"
                        align="left"
                        width="110">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editBhView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button @click="deleteBh(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="editBhDialog"
                width="30%">
            <el-form :model="businesshours" status-icon :rules="rules" ref="businesshoursForm">
                <el-form-item label="班次名称: " prop="busihoursname">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="businesshours.busihoursname"
                              placeholder="请输入班次名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="上班时间: " prop="begintime">
                    <el-time-picker
                            v-model="businesshours.begintime"
                            value-format="HH:mm:ss"
                            :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                            style="width: 250px"
                            placeholder="请选择上班时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="下班时间: " prop="endtime">
                    <el-time-picker
                            v-model="businesshours.endtime"
                            value-format="HH:mm:ss"
                            :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                            style="width: 250px"
                            placeholder="请选择下班时间">
                    </el-time-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editBhDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddBh">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "BusiHour",
        data(){
            return{
                businesshourss: [],
                businesshoursLoading: false,
                editBhDialog: false,
                multipleSelection: [],
                title: '',
                businesshours: {
                    busihoursname: "早班",
                    begintime: "18:00",
                    endtime: "08:00"
                },
                rules: {
                    busihoursname: [{required: true, message: '请输入班次名称', trigger: 'blur'}],
                    begintime: [{required: true, message: '请输入上班时间', trigger: 'blur'}],
                    endtime: [{required: true, message: '请输入下班时间', trigger: 'blur'}]
                }
            }
        },
        mounted() {
            this.initBhs();
        },
        methods: {
            initBhs(){
                this.businesshoursLoading=true;
                this.getRequest("/attendance/workingschedule/busihour/").then(resp => {
                    this.businesshoursLoading = false;
                    if (resp) {
                        this.businesshourss = resp;
                    }
                });
            },
            emptyBh(){
                this.businesshours = {
                    busihoursname: "",
                    begintime: "",
                    endtime: ""
                }
            },
            batchDeleteBh(){
                this.$confirm('此操作将永久删除所选中的所有班次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/attendance/workingschedule/busihour/deletebhs/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initBhs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            AddBhView(){
                this.emptyBh();
                this.title='添加班次';
                this.editBhDialog=true;
                this.$refs['businesshoursForm'].resetFields();
            },
            editBhView(data){
                this.title='编辑班次';
                this.businesshours=Object.assign({},data);
                this.editBhDialog=true;
            },
            deleteBh(data){
                this.$confirm('此操作将永久删除名称为【' + data.busihoursname + '】的班次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/attendance/workingschedule/busihour/" + data.busihoursid).then(resp => {
                        if (resp) {
                            this.initBhs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            confirmAddBh(){
                if(this.businesshours.busihoursid){
                    this.$refs['businesshoursForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/attendance/workingschedule/busihour/", this.businesshours).then(resp => {
                                if (resp) {
                                    this.editBhDialog=false;
                                    this.initBhs();
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['businesshoursForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/attendance/workingschedule/busihour/", this.businesshours).then(resp => {
                                if (resp) {
                                    this.editBhDialog=false;
                                    this.initBhs();
                                }
                            })
                        }
                    });
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>

</style>