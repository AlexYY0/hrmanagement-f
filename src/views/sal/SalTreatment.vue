<template>
    <div style="width: 45%">
        <div>
            <div style="display: flex;justify-content: space-between">
                <el-button type="primary" icon="el-icon-plus" @click="AddTretView">
                    添加保障性待遇
                </el-button>
                <el-button type="danger" icon="el-icon-delete" @click="batchDeleteTret">批量删除保障性待遇</el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    stripe
                    border
                    max-height="513"
                    :data="treatments"
                    v-loading="treatmentLoading"
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
                        prop="tretid"
                        label="编号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="tretname"
                        label="保障性待遇名称"
                        align="left"
                        width="110">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="tretpercent"
                        label="个人缴纳的比例"
                        align="left"
                        width="110">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editTretView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button @click="deleteTret(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="editTretDialog"
                width="30%">
            <el-form :model="treatment" status-icon :rules="rules" ref="treatmentForm">
                <el-form-item label="保障性待遇名称: " prop="tretname">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="treatment.tretname"
                              placeholder="请输入保障性待遇名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="个人缴纳的比例: " prop="tretpercent">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="treatment.tretpercent"
                              placeholder="请输入个人缴纳的比例">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editTretDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddTret">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalTreatment",
        data(){
            return{
                treatments: [],
                treatmentLoading: false,
                editTretDialog: false,
                multipleSelection: [],
                title: '',
                treatment: {
                    tretname: "养老保险",
                    tretpercent: 3,
                },
                rules: {
                    tretname: [{required: true, message: '请输入待遇名称', trigger: 'blur'}],
                    tretpercent: [{required: true, message: '请输入个人缴纳的比例', trigger: 'blur'},{
                        type: 'number',
                        message: '个人缴纳的比例必须为数字值',
                        trigger: 'blur'
                    }]
                }
            }
        },
        mounted() {
            this.initTrets();
        },
        methods: {
            initTrets(){
                this.treatmentLoading=true;
                this.getRequest("/salary/treatment/").then(resp => {
                    this.treatmentLoading = false;
                    if (resp) {
                        this.treatments = resp;
                    }
                });
            },
            emptyTret(){
                this.treatment = {
                    tretname: "",
                    tretpercent: ""
                }
            },
            batchDeleteTret(){
                this.$confirm('此操作将永久删除所选中的所有税率, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/salary/treatment/deletetrets/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initTrets();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            AddTretView(){
                this.emptyTret();
                this.title='添加保障性待遇';
                this.editTretDialog=true;
                this.$refs['treatmentForm'].resetFields();
            },
            editTretView(data){
                this.title='编辑保障性待遇';
                this.treatment=Object.assign({},data);
                this.editTretDialog=true;
            },
            deleteTret(data){
                this.$confirm('此操作将永久删除编号为【' + data.tretid + '】的保障性待遇, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/treatment/" + data.tretid).then(resp => {
                        if (resp) {
                            this.initTrets();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            confirmAddTret(){
                if(this.treatment.tretid){
                    this.$refs['treatmentForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/salary/treatment/", this.treatment).then(resp => {
                                if (resp) {
                                    this.editTretDialog=false;
                                    this.initTrets();
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['treatmentForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/salary/treatment/", this.treatment).then(resp => {
                                if (resp) {
                                    this.editTretDialog=false;
                                    this.initTrets();
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