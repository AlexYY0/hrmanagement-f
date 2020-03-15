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
                    统计日期:
                    <el-date-picker
                            v-model="searchValue.caldate"
                            type="daterange"
                            unlink-panels
                            align="right"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            range-separator="至"
                            end-placeholder="结束日期"
                            style="width: 340px">
                    </el-date-picker>
                    <el-input class="search-input" placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initAtteMon"
                              v-model="searchValue.empname"
                              @keydown.enter.native="initAtteMon">
                    </el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initAtteMon">
                        搜索
                    </el-button>
                </div>
                <div>
                    <el-button type="statistics" @click="statistics"><i style="margin-right: 8px" class="fas fa-calculator fa-lg"/>统计</el-button>
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
                    :data="atteMons"
                    v-loading="atteMonLoading"
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
                        prop="attelogmonid"
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
                        prop="totalh"
                        width="100"
                        align="left"
                        label="总工时">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="normalh"
                        width="100"
                        align="left"
                        label="正常工时">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="absenth"
                        width="100"
                        align="left"
                        label="缺勤工时">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="leaveh"
                        width="100"
                        align="left"
                        label="请假工时">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="vacateh"
                        width="100"
                        align="left"
                        label="调休工时">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="businessh"
                        width="100"
                        align="left"
                        label="出差工时">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="overtimeh"
                        width="100"
                        align="left"
                        label="加班工时">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="firstday"
                        width="145"
                        align="left"
                        label="被统计月第一天">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="endday"
                        width="145"
                        align="left"
                        label="被统计月最后一天">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="caldate"
                        width="145"
                        align="left"
                        label="统计时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        width="100px"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="checkAtteMon(scope.row)" style="color: #15aabf"><i class="fas fa-eye fa-lg"/></el-button>
                        <el-button type="text" @click="editAtteMonView(scope.row)"><i class="fas fa-edit  fa-lg"/></el-button>
                        <el-button type="text" @click="deleteAtteMon(scope.row)" style="color: #e30007"><i class="fas fa-trash-alt fa-lg"/></el-button>
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
                :visible.sync="atteMonDialog"
                width="60%">
            <div>
                <el-form :model="atteMon" status-icon :rules="rules" ref="atteMonForm" :disabled="NoModify" label-position="left" label-width="90px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="员工工号:" prop="workid">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteMon.workid" placeholder="请输入工号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="总工时:" prop="totalh">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteMon.totalh" placeholder="请输入总工时"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="实际工时:" prop="normalh">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteMon.normalh" placeholder="请输入实际工时"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="缺勤工时:" prop="absenth">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteMon.absenth" placeholder="请输入缺勤工时"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="请假工时:" prop="leaveh">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteMon.leaveh" placeholder="请输入请假工时"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="调休工时:" prop="vacateh">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteMon.vacateh" placeholder="请输入调休工时"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出差工时:" prop="businessh">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteMon.businessh" placeholder="请输入出差工时"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="加班工时:" prop="overtimeh">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="atteMon.overtimeh" placeholder="请输入加班工时"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="统计首日:" prop="firstday">
                                <el-date-picker
                                        v-model="atteMon.firstday"
                                        size="mini"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择被统计月第一天"
                                        style="width: 90%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="统计末日:" prop="endday">
                                <el-date-picker
                                        v-model="atteMon.endday"
                                        size="mini"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择被统计月最后一天"
                                        style="width: 90%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="统计时间:" prop="caldate">
                                <el-date-picker
                                        v-model="atteMon.caldate"
                                        size="mini"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择统计时间"
                                        style="width: 90%"
                                        default-time="09:00:00">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="atteMonDialog = false">取 消</el-button>
                <el-button type="primary" @click="doAddAtteMon">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="月末统计"
                :visible.sync="statisticsDialog"
                width="50%">
            <div>
                <el-steps :active="activeItemIndex" finish-status="success" align-center>
                    <el-step title="选择日期范围" description="选择统计的时间范围1~31"></el-step>
                    <el-step title="选择统计方式" description="选择统计的方式(按部门或按工号)"></el-step>
                    <el-step title="选择被统计员工" description="选择被统计员工"></el-step>
                </el-steps>
                <div style="margin-top: 10px;display: flex;justify-content: center">
                    <div v-show="activeItemIndex==0">
                        <el-date-picker
                                v-model="statisticsValue.monthday"
                                type="daterange"
                                unlink-panels
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="统计开始日期"
                                end-placeholder="统计结束日期"
                                style="width: 300px">
                        </el-date-picker>
                    </div>
                    <div v-show="activeItemIndex==1">
                        <el-radio-group v-model="way">
                            <el-radio label="0">所有员工</el-radio>
                            <el-radio label="1">按照部门</el-radio>
                            <el-radio label="2">按照员工</el-radio>
                        </el-radio-group>
                    </div>
                    <div v-show="activeItemIndex==2">
                        <div v-show="way==1">
                            所属部门:
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="200"
                                    trigger="manual"
                                    v-model="statisticsDepView">
                                <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                                         @node-click="statisticsViewHandleNodeClick"></el-tree>
                                <div class="select-dep" slot="reference"
                                     @click="showStatisticsDepView">{{inputStatisticsDepName}}
                                </div>
                            </el-popover>
                        </div>
                        <div v-show="way==2">
                            <el-select v-model="selectedEmps" value-key="workid" multiple placeholder="请选择" :popper-append-to-body="false" class="findAllEmp-autocomplete">
                                <el-option
                                        v-for="item in employees"
                                        :key="item.workid"
                                        :label="item.label"
                                        :value="item">
                                    <div class="empname">{{ item.label }}</div>
                                    <span class="workid">工号: {{ item.workid }}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="preStep">{{activeItemIndex==2?'取消':'上一步'}}</el-button>
                <el-button type="primary" @click="nextStep">{{activeItemIndex==2?'完成':'下一步'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AttManaOfMon",
        data(){
            return{
                searchValue: {
                    empname: null,
                    depid: null,
                    caldate: null,
                },
                statisticsValue: {
                    monthday: null,
                    depid: null,
                },
                title: '',
                page: 1,
                size: 10,
                total: 0,
                way: '0',
                atteMonDialog: false,
                searchDepView: false,
                statisticsDepView: false,
                atteMonLoading: false,
                statisticsDialog: false,
                NoModify: false,
                activeItemIndex: 0,
                inputDepName: '所属部门',
                inputStatisticsDepName: '所属部门',
                atteMons: [],
                allDeps: [],
                employees: [],
                selectedEmps: [],
                multipleSelection: [],
                atteMon: {},
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                },
                rules: {
                    workid: [{required: true, message: '请输入工号', trigger: 'blur'}],
                    totalh: [{required: true, message: '请输入总工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '总工时必须为数字值',
                        trigger: 'blur'
                    }],
                    normalh: [{required: true, message: '请输入实际工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '实际工时必须为数字值',
                        trigger: 'blur'
                    }],
                    absenth: [{required: true, message: '请输入缺勤工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '缺勤工时必须为数字值',
                        trigger: 'blur'
                    }],
                    leaveh: [{required: true, message: '请输入请假工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '请假工时必须为数字值',
                        trigger: 'blur'
                    }],
                    vacateh: [{required: true, message: '请输入调休工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '调休工时必须为数字值',
                        trigger: 'blur'
                    }],
                    businessh: [{required: true, message: '请输入出差工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '出差工时必须为数字值',
                        trigger: 'blur'
                    }],
                    overtimeh: [{required: true, message: '请输入加班工时', trigger: 'blur'}, {
                        type: 'number',
                        message: '加班工时必须为数字值',
                        trigger: 'blur'
                    }],
                    firstday: [{required: true, message: '请选择被统计月第一天', trigger: 'blur'}],
                    endday: [{required: true, message: '请选择被统计月最后一天', trigger: 'blur'}],
                    caldate: [{required: true, message: '请选择统计时间', trigger: 'blur'}],
                }
            }
        },
        mounted(){
            this.initData();
            this.initAtteMon();
        },
        methods:{
            initAtteMon(){
                this.atteMonLoading=true;
                let url="/attendance/managementofmonth/?page=" + this.page + "&size=" + this.size;
                if(this.searchValue.empname){
                    url+="&empname="+this.searchValue.empname;
                }
                if(this.searchValue.depid){
                    url+="&depid="+this.searchValue.depid;
                }
                if(this.searchValue.caldate){
                    url+="&caldate="+this.searchValue.caldate;
                }
                this.getRequest(url).then(resp => {
                    this.atteMonLoading = false;
                    if (resp) {
                        this.atteMons = resp.data;
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
            checkAtteMon(data){
                this.title='查看员工考勤月度统计数据';
                this.atteMon = data;
                this.NoModify=true;
                this.atteMonDialog = true;
            },
            editAtteMonView(data){
                this.title = '编辑员工考勤月度统计数据';
                this.atteMon = Object.assign({},data);
                this.NoModify=false;
                this.atteMonDialog=true;
                this.$refs['atteMonForm'].resetFields();
            },
            deleteAtteMon(data){
                this.$confirm('此操作将永久删除【' + data.employee.empname + '】的考勤月度统计数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/attendance/managementofmonth/" + data.attelogmonid).then(resp => {
                        if (resp) {
                            this.initAtteMon();
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
                this.$confirm('此操作将永久删除所选中的所有员工考勤月度统计数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/attendance/managementofmonth/deleteattemons/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initAtteMon();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddAtteMon(){
                if(this.NoModify==true){
                    this.atteMonDialog=false;
                    return;
                }
                this.$refs['atteMonForm'].validate(valid => {
                    if (valid) {
                        this.putRequest("/attendance/managementofmonth/", this.atteMon).then(resp => {
                            if (resp) {
                                this.atteMonDialog=false;
                                this.initAtteMon();
                            }
                        });
                    }
                });
            },
            preStep() {
                if (this.activeItemIndex == 0) {
                    return;
                } else if (this.activeItemIndex == 2) {
                    //关闭对话框
                    this.statisticsDialog = false;
                    return;
                }
                this.activeItemIndex--;
            },
            nextStep() {
                if (this.activeItemIndex == 2) {
                    if(this.way==0){
                        this.getRequest("/attendance/managementofmonth/calcall?monthday=" + this.statisticsValue.monthday).then(resp => {
                            if (resp) {
                                this.initAtteMon();
                                this.statisticsDialog = false;
                            }
                        });
                    }else if(this.way==1){
                        this.getRequest("/attendance/managementofmonth/calcbydepid?depid=" + this.statisticsValue.depid + "&monthday=" + this.statisticsValue.monthday).then(resp => {
                            if (resp) {
                                this.initAtteMon();
                                this.statisticsDialog = false;
                            }
                        });
                    }else {
                        this.postRequest("/attendance/managementofmonth/calcbyworkid?monthday=" + this.statisticsValue.monthday,this.selectedEmps).then(resp => {
                            if (resp) {
                                this.initAtteMon();
                                this.statisticsDialog = false;
                            }
                        });
                    }
                }
                this.activeItemIndex++;
            },
            emptyStatistics(){
                this.statisticsValue.monthday='';
                this.way='0';
                this.selectedEmps=[];
                this.inputStatisticsDepName = '所属部门';
            },
            statistics(){
                this.emptyStatistics();
                this.statisticsDialog=true;
                this.activeItemIndex=0;
                if(!window.sessionStorage.getItem("emps")){
                    this.getRequest("/organization/management/employee/").then(resp => {
                        if (resp) {
                            this.employees = resp;
                            window.sessionStorage.setItem("emps", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.employees = JSON.parse(window.sessionStorage.getItem("emps"));
                }
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initAtteMon();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initAtteMon();
            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.searchValue.depid = data.depid;
                this.searchDepView = !this.searchDepView;
            },
            statisticsViewHandleNodeClick(data){
                this.inputStatisticsDepName = data.depname;
                this.statisticsValue.depid=data.depid;
                this.statisticsDepView = !this.statisticsDepView;
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
            showStatisticsDepView(){
                this.statisticsDepView = !this.statisticsDepView;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            exportData(){
                this.postRequestExcel("/attendance/managementofmonth/export/",this.multipleSelection).then(resp => {
                    if (resp) {
                        const content = resp;
                        const blob = new Blob([content],{type: 'application/vnd.ms-excel'});
                        const fileName = this.moment().format('YYYY.MM.DD_HH-mm-ss')+'员工考勤月度统计表.xls';
                        if ('download' in document.createElement('a')) { // 非IE下载
                            const elink = document.createElement('a');
                            elink.download = fileName;
                            elink.style.display = 'none';
                            elink.href = URL.createObjectURL(blob);
                            document.body.appendChild(elink);
                            elink.click()
                            URL.revokeObjectURL(elink.href); // 释放URL 对象
                            document.body.removeChild(elink);
                        } else { // IE10+下载
                            navigator.msSaveBlob(blob, fileName);
                        }
                    }
                });
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
    .el-button--statistics{
        color: white;
        background: #13ce66;
    }
    /deep/ .findAllEmp-autocomplete li{
        line-height: normal;
        height: 50px;
        padding: 7px;
    }
    /deep/ .findAllEmp-autocomplete li .empname {
        text-overflow: ellipsis;
        overflow: hidden;
    }
    /deep/ .findAllEmp-autocomplete li .workid {
        font-size: 12px;
        color: #b4b4b4;
    }
    /deep/ .findAllEmp-autocomplete li.highlighted .workid{
        color: #ddd;
    }
</style>
