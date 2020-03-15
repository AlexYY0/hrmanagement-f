<template>
    <div style="width: 100%">
        <div>
            <div style="display: flex;justify-content: space-between">
                <el-button type="primary" icon="el-icon-plus" @click="AddSalscheView">
                    添加新计算方案
                </el-button>
                <el-button type="danger" icon="el-icon-delete" @click="batchDeleteSalsche">批量删除计算方案</el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    stripe
                    border
                    max-height="513"
                    :data="salSchemes"
                    v-loading="salSchemeLoading"
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
                        prop="ssid"
                        label="编号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="ssname"
                        label="计算方法名"
                        align="left"
                        width="150">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="compmethod"
                        label="计算公式"
                        show-overflow-tooltip
                        align="left">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        width="100"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editSalscheView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button @click="deleteSalsche(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="editSalscheDialog"
                width="30%">
            <el-form label-position="left" label-width="100px" :model="salScheme" status-icon :rules="rules" ref="salSchemeForm">
                <el-form-item label="计算方法名: " prop="ssname">
                    <el-input clearable style="width: 100%" prefix-icon="el-icon-edit" v-model="salScheme.ssname"
                              placeholder="请输入计算方法名">
                    </el-input>
                </el-form-item>
                <el-form-item label="计算公式: " prop="compmethod">
                    <el-input
                            clearable
                            style="width: 100%"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 7}"
                            placeholder="请输入计算公式"
                            v-model="salScheme.compmethod"
                            minlength="10"
                            maxlength="255"
                            show-word-limit>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editSalscheDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddSalsche">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalScheme",
        data(){
            return{
                salSchemes: [],
                salSchemeLoading: false,
                editSalscheDialog: false,
                multipleSelection: [],
                title: '',
                salScheme: {
                    ssname: 0,
                    compmethod: 1000
                },
                rules: {
                    ssname: [{required: true, message: '请输入计算方法名', trigger: 'blur'}],
                    compmethod: [{required: true, message: '请输入计算公式', trigger: 'blur'}]
                }
            }
        },
        mounted() {
            this.initSalsches();
        },
        methods: {
            initSalsches(){
                this.salSchemeLoading=true;
                this.getRequest("/salary/scheme/").then(resp => {
                    this.salSchemeLoading = false;
                    if (resp) {
                        this.salSchemes = resp;
                    }
                });
            },
            emptySalsche(){
                this.salScheme = {
                    ssname: "",
                    compmethod: ""
                }
            },
            batchDeleteSalsche(){
                this.$confirm('此操作将永久删除所选中的所有薪资计算方案, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/salary/scheme/deletesalsches/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initSalsches();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            AddSalscheView(){
                this.emptySalsche();
                this.title='添加新薪资计算方案';
                this.editSalscheDialog=true;
                this.$refs['salSchemeForm'].resetFields();
            },
            editSalscheView(data){
                this.title='编辑薪资计算方案';
                this.salScheme=Object.assign({}, data)
                this.editSalscheDialog=true;
            },
            deleteSalsche(data){
                this.$confirm('此操作将永久删除编号为【' + data.ssid + '】的计算方案, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/scheme/" + data.ssid).then(resp => {
                        if (resp) {
                            this.initSalsches();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            confirmAddSalsche(){
                if(this.salScheme.ssid){
                    this.$refs['salSchemeForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/salary/scheme/", this.salScheme).then(resp => {
                                if (resp) {
                                    this.editSalscheDialog=false;
                                    this.initSalsches();
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['salSchemeForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/salary/scheme/", this.salScheme).then(resp => {
                                if (resp) {
                                    this.editSalscheDialog=false;
                                    this.initSalsches();
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