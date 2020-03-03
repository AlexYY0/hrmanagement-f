<template>
    <div style="width: 55%">
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-input placeholder="请输入专扣名称进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initSads"
                              style="width: 350px;margin-right: 10px" v-model="keyword"
                              @keydown.enter.native="initSads"></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initSads">
                        搜索
                    </el-button>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-plus" @click="AddSadView">
                        添加新专扣
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="batchDeleteSad">批量删除专扣</el-button>
                </div>

            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    stripe
                    border
                    max-height="513"
                    :data="speadds"
                    v-loading="speaddLoading"
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
                        prop="sadid"
                        label="编号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        fixed
                        prop="sadname"
                        label="专扣名称"
                        align="left"
                        width="200">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="sadmoney"
                        label="专扣金额"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editSadView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button @click="deleteSad(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="display: flex;justify-content: flex-end">
            <el-pagination
                    background
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    layout="sizes, prev, pager, next, jumper, ->, total, slot"
                    :total="total">
            </el-pagination>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="editSadDialog"
                width="30%">
            <el-form label-position="left" label-width="90px" :model="speadd" status-icon :rules="rules" ref="speaddForm">
                <el-form-item label="专扣名称: " prop="sadname">
                    <el-input clearable style="width: 290px" prefix-icon="el-icon-edit" v-model.number="speadd.sadname"
                              placeholder="请输入专扣名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="专扣金额: " prop="sadmoney">
                    <el-input clearable style="width: 290px" prefix-icon="el-icon-edit" v-model.number="speadd.sadmoney"
                              placeholder="请输入专扣金额">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editSadDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddSad">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalSad",
        data(){
            return{
                keyword: null,
                speadds: [],
                speaddLoading: false,
                editSadDialog: false,
                multipleSelection: [],
                title: '',
                page: 1,
                size: 10,
                total: 0,
                speadd: {
                    sadname: '子女教育',
                    sadmoney: 0
                },
                rules: {
                    sadname: [{required: true, message: '请输入专扣名称', trigger: 'blur'}],
                    sadmoney: [{required: true, message: '请输入专扣金额', trigger: 'blur'},{
                        type: 'number',
                        message: '专扣金额必须为数字值',
                        trigger: 'blur'
                    }]
                }
            }
        },
        mounted() {
            this.initSads();
        },
        methods: {
            initSads(){
                this.speaddLoading=true;
                let url="/salary/specialadditionaldeduction/?page=" + this.page + '&size=' + this.size;
                if(this.keyword){
                    url+="&sadname="+this.keyword;
                }
                this.getRequest(url).then(resp => {
                    this.speaddLoading = false;
                    if (resp) {
                        this.speadds = resp.data;
                        this.total = resp.total;
                        if(resp.data.length===0){
                            this.$notify.error({
                                title: '错误',
                                message: '本页没有数据，请翻页或添加数据！'
                            });
                        }
                    }
                });
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initSads();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initSads();
            },
            emptySad(){
                this.speadd = {
                    sadname: "",
                    sadmoney: "",
                }
            },
            batchDeleteSad(){
                this.$confirm('此操作将永久删除所选中的所有专扣, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/salary/specialadditionaldeduction/deletespeadds/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initSads();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            AddSadView(){
                this.emptySad();
                this.title='添加新专扣';
                this.editSadDialog=true;
                this.$refs['speaddForm'].resetFields();
            },
            editSadView(data){
                this.title='编辑专扣';
                this.speadd=Object.assign({}, data)
                this.editSadDialog=true;
            },
            deleteSad(data){
                this.$confirm('此操作将永久删除编号为【' + data.sadid + '】的专扣, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/specialadditionaldeduction/" + data.sadid).then(resp => {
                        if (resp) {
                            this.initSads();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            confirmAddSad(){
                if(this.speadd.sadid){
                    this.$refs['speaddForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/salary/specialadditionaldeduction/", this.speadd).then(resp => {
                                if (resp) {
                                    this.editSadDialog=false;
                                    this.initSads();
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['speaddForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/salary/specialadditionaldeduction/", this.speadd).then(resp => {
                                if (resp) {
                                    this.editSadDialog=false;
                                    this.initSads();
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