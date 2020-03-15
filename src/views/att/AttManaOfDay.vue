<template>
    <div style="width: 87%">
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
                    打卡日期:
                    <el-date-picker
                            v-model="searchValue.clockinday"
                            type="daterange"
                            unlink-panels
                            align="right"
                            style="width: 250px"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                    <el-input class="search-input" placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initAtteDay"
                              v-model="searchValue.empname"
                              @keydown.enter.native="initAtteDay">
                    </el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initAtteDay">
                        搜索
                    </el-button>
                </div>
                <div>
                    <el-button type="success" icon="el-icon-download" @click="exportData">
                        导出
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
                    :data="atteDays"
                    v-loading="atteDayLoading"
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
                        prop="attelogdayid"
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
                        prop="clockinday"
                        width="100"
                        align="left"
                        label="打卡日期">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="signintime"
                        width="100"
                        align="left"
                        label="签到时间">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="signouttime"
                        width="100"
                        align="left"
                        label="签退时间">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="attestatus.attestaname"
                        width="100"
                        align="left"
                        label="考勤状态">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="needhours"
                        width="100"
                        align="left"
                        label="需要工作时间">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="workinghours"
                        width="100"
                        align="left"
                        label="实际工作时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        width="100px"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="checkAtteDay(scope.row)" style="color: #15aabf"><i class="fas fa-eye fa-lg"/></el-button>
                        <el-button type="text" @click="editAtteDayView(scope.row)"><i class="fas fa-edit  fa-lg"/></el-button>
                        <el-button type="text" @click="deleteAtteDay(scope.row)" style="color: #e30007"><i class="fas fa-trash-alt fa-lg"/></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="display: flex;justify-content: space-between">
            <el-button type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
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
                :visible.sync="atteDayDialog"
                width="50%">
            <div>
                <el-form :model="atteDay" status-icon :rules="rules" ref="atteDayForm" :disabled="NoModify" label-position="left" label-width="90px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="员工工号:" prop="workid">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteDay.workid" placeholder="请输入工号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="打卡日期:" prop="clockinday">
                                <el-date-picker
                                        v-model="atteDay.clockinday"
                                        size="mini"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择打卡日期"
                                        style="width: 90%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="签到时间: " prop="signintime">
                                <el-time-picker
                                        style="width: 90%"
                                        v-model="atteDay.signintime"
                                        value-format="HH:mm:ss"
                                        :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                        placeholder="请选择签到时间">
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="签退时间: " prop="signouttime">
                                <el-time-picker
                                        style="width: 90%"
                                        v-model="atteDay.signouttime"
                                        value-format="HH:mm:ss"
                                        :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                        placeholder="请选择签退时间">
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="考勤状态:" prop="clockinflag">
                                <el-select style="width: 90%" v-model="atteDay.clockinflag" clearable placeholder="请选择考勤状态" size="mini">
                                    <el-option
                                            v-for="item in attestatus"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="需要工时:" prop="needhours">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteDay.needhours" placeholder="请输入需要工时"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="实际工时:" prop="workinghours">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteDay.workinghours" placeholder="请输入实际工时"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="atteDayDialog = false">取 消</el-button>
                <el-button type="primary" @click="doAddAtteDay">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AttManagOfDay",
        data(){
            return{
                searchValue: {
                    empname: null,
                    depid: null,
                    clockinday: null,
                },
                searchDepView: false,
                atteDayLoading: false,
                NoModify: false,
                atteDayDialog: false,
                page: 1,
                size: 10,
                total: 0,
                title: '',
                inputDepName: '所属部门',
                allDeps: [],
                multipleSelection: [],
                atteDays: [],
                atteDay: {},
                attestatus: [{value:0,label:'旷工'},{value:1,label:'正常'}, {value:2,label:'异常'},{value:3,label:'请假'},{value:4,label:'加班'},{value:5,label:'出差'},{value:6,label:'调休'}],
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                },
                rules: {
                    workid: [{required: true, message: '请输入工号', trigger: 'blur'}],
                    clockinday: [{required: true, message: '请输入打卡日期', trigger: 'blur'}],
                    signintime: [{required: true, message: '请输入签到时间', trigger: 'blur'}],
                    signouttime: [{required: true, message: '请输入签退时间', trigger: 'blur'}],
                    clockinflag: [{required: true, message: '请选择考勤状态', trigger: 'change'}],
                    needhours: [{required: true, message: '请输入需要工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '需要工时必须为数字值',
                        trigger: 'blur'
                    }],
                    workinghours: [{required: true, message: '请输入实际工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '实际工时必须为数字值',
                        trigger: 'blur'
                    }],
                }
            };
        },
        mounted(){
            this.initData();
            this.initAtteDay();
        },
        methods:{
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
            initAtteDay(){
                this.atteDayLoading=true;
                let url="/attendance/managementofday/?page=" + this.page + '&size=' + this.size;
                if(this.searchValue.empname){
                    url+="&empname="+this.searchValue.empname;
                }
                if(this.searchValue.depid){
                    url+="&depid="+this.searchValue.depid;
                }
                if(this.searchValue.clockinday){
                    url+="&clockinday="+this.searchValue.clockinday;
                }
                this.getRequest(url).then(resp => {
                    this.atteDayLoading = false;
                    if (resp) {
                        this.atteDays = resp.data;
                        this.total = resp.total;
                        if(resp.data.length==0){
                            this.$notify.error({
                                title: '错误',
                                message: '记录中没有统计数据，请翻页或添加数据！'
                            });
                        }
                    }
                });
            },
            checkAtteDay(data){
                this.title='查看员工考勤信息';
                this.atteDay = data;
                this.NoModify=true;
                this.atteDayDialog = true;
            },
            editAtteDayView(data){
                this.title = '编辑员工考勤信息';
                this.atteDay = Object.assign({},data);
                this.NoModify=false;
                this.atteDayDialog=true;
                this.$refs['atteDayForm'].resetFields();
            },
            deleteAtteDay(data){
                this.$confirm('此操作将永久删除【' + data.employee.empname + '】的考勤信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/attendance/managementofday/" + data.attelogdayid).then(resp => {
                        if (resp) {
                            this.initAtteDay();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            batchDelete(){
                this.$confirm('此操作将永久删除所选中的所有员工每日考勤数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/attendance/managementofday/deleteattedays/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initAtteDay();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddAtteDay(){
                if(this.NoModify==true){
                    this.atteDayDialog=false;
                    return;
                }
                this.$refs['atteDayForm'].validate(valid => {
                    if (valid) {
                        this.putRequest("/attendance/managementofday/", this.atteDay).then(resp => {
                            if (resp) {
                                this.atteDayDialog=false;
                                this.initAtteDay();
                            }
                        });
                    }
                });
            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.searchValue.depid = data.depid;
                this.searchDepView = !this.searchDepView;
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initAtteDay();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initAtteDay();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
        width: 320px;
        margin: 0 10px 0 10px;
    }
</style>