<template>
    <div style="width: 65%">
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-input placeholder="请输入福利名称进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initWels"
                              style="width: 350px;margin-right: 10px" v-model="keyword"
                              @keydown.enter.native="initWels"></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initWels">
                        搜索
                    </el-button>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-plus" @click="AddWelView">
                        添加新福利
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="batchDeleteWel">批量删除福利</el-button>
                </div>

            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    stripe
                    border
                    max-height="513"
                    :data="welfares"
                    v-loading="welfareLoading"
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
                        prop="welid"
                        label="编号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        fixed
                        prop="welname"
                        label="福利名称"
                        align="left"
                        width="110">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="traffic"
                        label="交通补贴"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="catering"
                        label="餐饮补贴"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="communication"
                        label="通信补贴"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="bonus"
                        label="奖金"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="other"
                        label="其它"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editWelView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button @click="deleteWel(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
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
                :visible.sync="editWelDialog"
                width="30%">
            <el-form label-position="left" label-width="90px" :model="welfare" status-icon :rules="rules" ref="welfareForm">
                <el-form-item label="福利名称: " prop="welname">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="welfare.welname"
                              placeholder="请输入福利名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="交通补贴: " prop="traffic">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="welfare.traffic"
                              placeholder="请输入交通补贴">
                    </el-input>
                </el-form-item>
                <el-form-item label="餐饮补贴: " prop="catering">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="welfare.catering"
                              placeholder="请输入餐饮补贴">
                    </el-input>
                </el-form-item>
                <el-form-item label="通信补贴: " prop="communication">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="welfare.communication"
                              placeholder="请输入通信补贴">
                    </el-input>
                </el-form-item>
                <el-form-item label="奖金: " prop="bonus">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="welfare.bonus"
                              placeholder="请输入奖金">
                    </el-input>
                </el-form-item>
                <el-form-item label="其它补贴: " prop="other">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model.number="welfare.other"
                              placeholder="请输入其它补贴">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editWelDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddWel">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalWelfare",
        data(){
            return{
                keyword: null,
                welfares: [],
                welfareLoading: false,
                editWelDialog: false,
                multipleSelection: [],
                title: '',
                page: 1,
                size: 10,
                total: 0,
                welfare: {
                    welname: '研发部补贴',
                    traffic: 0,
                    catering: 1000,
                    communication: 3,
                    bonus: 40,
                    other: 30
                },
                rules: {
                    welname: [{required: true, message: '请输入福利名称', trigger: 'blur'}],
                    traffic: [{required: true, message: '请输入交通补贴', trigger: 'blur'},{
                        type: 'number',
                        message: '交通补贴必须为数字值',
                        trigger: 'blur'
                    }],
                    catering: [{required: true, message: '请输入餐饮补贴', trigger: 'blur'},{
                        type: 'number',
                        message: '餐饮补贴必须为数字值',
                        trigger: 'blur'
                    }],
                    communication: [{required: true, message: '请输入通信补贴', trigger: 'blur'},{
                        type: 'number',
                        message: '通信补贴必须为数字值',
                        trigger: 'blur'
                    }],
                    bonus: [{required: true, message: '请输入奖金', trigger: 'blur'},{
                        type: 'number',
                        message: '奖金必须为数字值',
                        trigger: 'blur'
                    }],
                    other: [{required: true, message: '请输入其它福利', trigger: 'blur'},{
                        type: 'number',
                        message: '其它福利必须为数字值',
                        trigger: 'blur'
                    }]
                }
            }
        },
        mounted() {
            this.initWels();
        },
        methods: {
            initWels(){
                this.welfareLoading=true;
                let url="/salary/welfare/?page=" + this.page + '&size=' + this.size;
                if(this.keyword){
                    url+="&welname="+this.keyword;
                }
                this.getRequest(url).then(resp => {
                    this.welfareLoading = false;
                    if (resp) {
                        this.welfares = resp.data;
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
                this.initWels();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initWels();
            },
            emptyWel(){
                this.welfare = {
                    welname: "",
                    traffic: "",
                    catering: "",
                    communication: "",
                    bonus: "",
                    other: ""
                }
            },
            batchDeleteWel(){
                this.$confirm('此操作将永久删除所选中的所有福利补贴, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/salary/welfare/deletewels/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initWels();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            AddWelView(){
                this.emptyWel();
                this.title='添加新福利补贴';
                this.editWelDialog=true;
                this.$refs['welfareForm'].resetFields();
            },
            editWelView(data){
                this.title='编辑福利补贴';
                this.welfare=Object.assign({}, data)
                this.editWelDialog=true;
            },
            deleteWel(data){
                this.$confirm('此操作将永久删除名称为【' + data.welname + '】的福利补贴, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/welfare/" + data.welid).then(resp => {
                        if (resp) {
                            this.initWels();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            confirmAddWel(){
                if(this.welfare.welid){
                    this.$refs['welfareForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/salary/welfare/", this.welfare).then(resp => {
                                if (resp) {
                                    this.editWelDialog=false;
                                    this.initWels();
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['welfareForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/salary/welfare/", this.welfare).then(resp => {
                                if (resp) {
                                    this.editWelDialog=false;
                                    this.initWels();
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