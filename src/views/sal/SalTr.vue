<template>
    <div style="width: 55%">
        <div>
            <div style="display: flex;justify-content: space-between">
                <el-button type="primary" icon="el-icon-plus" @click="AddTrView">
                    添加新税率
                </el-button>
                <el-button type="danger" icon="el-icon-delete" @click="batchDeleteTr">批量删除税率</el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    stripe
                    border
                    max-height="513"
                    :data="taxRates"
                    v-loading="taxRateLoading"
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
                        prop="trid"
                        label="编号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="trmin"
                        label="税收最小值"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="trmax"
                        label="税收最大值"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="trpercent"
                        label="税率"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="quideduction"
                        label="速算扣除数"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editTrView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button @click="deleteTr(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="editTrDialog"
                width="30%">
            <el-form :model="taxRate" status-icon :rules="rules" ref="taxRateForm">
                <el-form-item label="税收最小值: " prop="trmin">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="taxRate.trmin"
                              placeholder="请输入税收最小值">
                    </el-input>
                </el-form-item>
                <el-form-item label="税收最大值: " prop="trmax">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="taxRate.trmax"
                              placeholder="请输入税收最大值">
                    </el-input>
                </el-form-item>
                <el-form-item label="税率百分比: " prop="trpercent">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="taxRate.trpercent"
                              placeholder="请输入税率百分比">
                    </el-input>
                </el-form-item>
                <el-form-item label="速算扣除数: " prop="quideduction">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="taxRate.quideduction"
                              placeholder="请输入速算扣除数">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editTrDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddTr">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalTr",
        data(){
            return{
                taxRates: [],
                taxRateLoading: false,
                editTrDialog: false,
                multipleSelection: [],
                title: '',
                taxRate: {
                    trmin: 0,
                    trmax: 1000,
                    trpercent: 3,
                    quideduction: 40
                },
                rules: {
                    trmin: [{required: true, message: '请输入税收最小值', trigger: 'blur'},{
                        type: 'number',
                        message: '税收最小值必须为数字值',
                        trigger: 'blur'
                    }],
                    trmax: [{required: true, message: '请输入税收最大值', trigger: 'blur'},{
                        type: 'number',
                        message: '税收最大值必须为数字值',
                        trigger: 'blur'
                    }],
                    trpercent: [{required: true, message: '请输入税率百分比', trigger: 'blur'},{
                        type: 'number',
                        message: '税率百分比必须为数字值',
                        trigger: 'blur'
                    }],
                    quideduction: [{required: true, message: '请输入速算扣除数', trigger: 'blur'},{
                        type: 'number',
                        message: '速算扣除数必须为数字值',
                        trigger: 'blur'
                    }]
                }
            }
        },
        mounted() {
            this.initTrs();
        },
        methods: {
            initTrs(){
                this.taxRateLoading=true;
                this.getRequest("/salary/taxrate/").then(resp => {
                    this.taxRateLoading = false;
                    if (resp) {
                        this.taxRates = resp;
                    }
                });
            },
            emptyTr(){
                this.taxRate = {
                    trmin: "",
                    trmax: "",
                    trpercent: "",
                    quideduction: ""
                }
            },
            batchDeleteTr(){
                this.$confirm('此操作将永久删除所选中的所有税率, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/salary/taxrate/deletetrs/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initTrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            AddTrView(){
                this.emptyTr();
                this.title='添加新税率';
                this.editTrDialog=true;
                this.$refs['taxRateForm'].resetFields();
            },
            editTrView(data){
                this.title='编辑税率';
                this.taxRate=Object.assign({}, data)
                this.editTrDialog=true;
            },
            deleteTr(data){
                this.$confirm('此操作将永久删除编号为【' + data.trid + '】的税率, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/taxrate/" + data.trid).then(resp => {
                        if (resp) {
                            this.initTrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            confirmAddTr(){
                if(this.taxRate.trid){
                    this.$refs['taxRateForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/salary/taxrate/", this.taxRate).then(resp => {
                                if (resp) {
                                    this.editTrDialog=false;
                                    this.initTrs();
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['taxRateForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/salary/taxrate/", this.taxRate).then(resp => {
                                if (resp) {
                                    this.editTrDialog=false;
                                    this.initTrs();
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