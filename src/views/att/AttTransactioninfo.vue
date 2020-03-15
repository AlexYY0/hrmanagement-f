<template>
    <div style="width: 100%">
        <div>
            <div class="top-menu">
                <div>
                    所属部门:
                    <el-popover
                            placement="right"
                            title="请选择部门"
                            width="200"
                            trigger="manual"
                            v-model="searchDepView">
                        <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                                 @node-click="searvhViewHandleNodeClick"></el-tree>
                        <div class="select-dep" slot="reference"
                             @click="showSearchDepView">{{inputDepName}}
                        </div>
                    </el-popover>
                    申请日期:
                    <el-date-picker
                            v-model="searchValue.appdate"
                            type="datetimerange"
                            unlink-panels
                            align="right"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            range-separator="至"
                            end-placeholder="结束日期"
                            style="width: 340px"
                            :default-time="['09:00:00', '18:00:00']">
                    </el-date-picker>
                    <el-input class="search-input" placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initAppatts"
                              v-model="searchValue.empname"
                              @keydown.enter.native="initAppatts">
                    </el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initAppatts">
                        搜索
                    </el-button>
                </div>
                <div>
                    <el-button type="success" icon="el-icon-download" @click="exportData">
                        导出数据
                    </el-button>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    stripe
                    border
                    max-height="513"
                    :data="appatts"
                    v-loading="appattLoading"
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
                        prop="aatid"
                        label="编号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="employee.empname"
                        fixed
                        align="left"
                        label="姓名"
                        width="90">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="workid"
                        label="工号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="department.depname"
                        width="100"
                        align="left"
                        label="所属部门">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="department.leadername"
                        width="100"
                        align="left"
                        label="领导姓名">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="category"
                        width="100"
                        align="left"
                        label="申请类型">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        header-align="center"
                        prop="reason"
                        width="300"
                        align="left"
                        label="申请原因">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="appbegindate"
                        width="140"
                        align="left"
                        label="开始时间">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="appenddate"
                        width="140"
                        align="left"
                        label="结束时间">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="total"
                        width="100"
                        align="left"
                        label="时间总计">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="appdate"
                        width="140"
                        align="left"
                        label="申请时间">
                </el-table-column>
                <el-table-column
                        width="100"
                        align="center"
                        label="申请状态">
                    <template slot-scope="scope">
                        <el-tag>{{isSubmit(scope.row.issubmit)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="100"
                        align="center"
                        label="领导意见">
                    <template slot-scope="scope">
                        <el-tag type="success">{{isApprove(scope.row.isapprove)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        width="80px"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="checkAppatt(scope.row)" style="color: #15aabf"><i class="fas fa-eye fa-lg"/></el-button>
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
                title="查看申请"
                :visible.sync="editAppattDialog"
                width="40%">
            <div>
                <el-form :model="appatt" status-icon :rules="rules" ref="appattForm" disabled>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="员工工号:" prop="workid">
                                <el-input disabled size="mini" style="width: 100%" prefix-icon="el-icon-edit" v-model="appatt.workid" placeholder="请输入工号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请类别:" prop="category">
                                <el-select clearable v-model="appatt.category" placeholder="请选择申请类别" size="mini"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in category"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="申请理由:" prop="reason">
                                <el-input
                                        clearable
                                        style="width: 100%"
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 7}"
                                        placeholder="请输入内容"
                                        v-model="appatt.reason"
                                        minlength="10"
                                        maxlength="255"
                                        show-word-limit>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开始时间:" prop="appbegindate">
                                <el-date-picker
                                        v-model="appatt.appbegindate"
                                        size="mini"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="请选择开始时间"
                                        style="width: 100%;"
                                        default-time="09:00:00">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="结束时间:" prop="appenddate">
                                <el-date-picker
                                        v-model="appatt.appenddate"
                                        size="mini"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="请选择结束时间"
                                        style="width: 100%;"
                                        default-time="09:00:00">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="时间总计:" prop="total">
                                <el-input disabled size="mini" style="width: 100%" prefix-icon="el-icon-edit" v-model.number="appatt.total" placeholder="请输入总计"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请时间:" prop="appdate">
                                <el-date-picker
                                        v-model="appatt.appdate"
                                        size="mini"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="请选择申请时间"
                                        style="width: 100%;"
                                        default-time="09:00:00">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="领导意见:" prop="isapprove">
                                <el-switch
                                        v-model="appatt.isapprove"
                                        active-text="同意"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="拒绝">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editAppattDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AttTransactioninfo",
        data(){
            return{
                searchValue: {
                    empname: null,
                    depid: null,
                    appdate: null,
                },
                page: 1,
                size: 10,
                total: 0,
                appatts: [],
                searchDepView: false,
                appattLoading: false,
                editAppattDialog: false,
                inputDepName: '所属部门',
                allDeps: [],
                multipleSelection: [],
                category: ['请假','调休','出差','加班'],
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                },
                appatt: {
                    workid: 1,
                    category: '请假',
                    reason: '生病',
                    appbegindate: '2019-08-05 09:00:00',
                    appenddate: '2019-08-05 18:00:00',
                    total: 8,
                    appdate: '2019-08-05 07:00:00',
                    issubmit: false
                },
                rules: {
                    workid: [{required: true, message: '请输入工号', trigger: 'blur'}],
                    category: [{required: true, message: '请选择申请类别', trigger: 'change'}],
                    reason: [{required: true, message: '请输入申请原因', trigger: 'blur'}],
                    appbegindate: [{required: true, message: '请选择申请开始时间', trigger: 'blur'}],
                    appenddate: [{required: true, message: '请选择申请结束时间', trigger: 'blur'}],
                    isapprove: [{required: true, message: '请选择领导意见', trigger: 'blur'}],
                    total: [{required: true, message: '请输入总计时间', trigger: 'blur'},{
                        type: 'number',
                        message: '总计时间必须为数字值',
                        trigger: 'blur'
                    }],
                    appdate: [{required: true, message: '请选择申请时间', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.initAppatts();
            this.initData();
        },
        methods: {
            initAppatts(){
                this.appattLoading=true;
                let url="/attendance/transactioninfo/?page=" + this.page + '&size=' + this.size;
                if(this.searchValue.empname){
                    url+="&empname="+this.searchValue.empname;
                }
                if(this.searchValue.depid){
                    url+="&depid="+this.searchValue.depid;
                }
                if(this.searchValue.appdate){
                    url+="&appdate="+this.searchValue.appdate;
                }
                this.getRequest(url).then(resp => {
                    this.appattLoading = false;
                    if (resp) {
                        this.appatts = resp.data;
                        this.total = resp.total;
                        if(resp.data.length===0){
                            this.$notify.error({
                                title: '错误',
                                message: '历史记录中没有数据，请翻页或添加数据！'
                            });
                        }
                    }
                });
            },
            initData() {
                if (!window.sessionStorage.getItem("deps")) {
                    this.getRequest('/employee/basic/info/deps').then(resp => {
                        if (resp) {
                            this.allDeps = resp;
                            window.sessionStorage.setItem("deps", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
                }
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initAppatts();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initAppatts();
            },
            checkAppatt(data){
                this.appatt=Object.assign({}, data);
                this.editAppattDialog=true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            isSubmit(cellValue){
                if(cellValue===false)
                    return '未提交';
                else
                    return '已提交';
            },
            isApprove(cellValue){
                if(cellValue===true)
                    return '同意';
                else if(cellValue===false)
                    return '拒绝';
                else
                    return '未决定';
            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.searchValue.depid = data.depid;
                this.searchDepView = !this.searchDepView
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
        }
    }
</script>

<style scoped>
    .top-menu{
        display: flex;
        justify-content: space-between;
    }
    .select-dep{
        width: 130px;
        display: inline-flex;
        font-size: 13px;
        border: 1px solid #dedede;
        height: 26px;
        border-radius: 5px;
        cursor: pointer;
        align-items: center;
        padding-left: 8px;
        box-sizing: border-box;
        margin: 0 10px 0 0;
    }
    .search-input{
        width: 350px;
        margin: 0 10px 0 10px;
    }
</style>