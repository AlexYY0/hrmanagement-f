<template>
    <div>
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
                    核算日期:
                    <el-date-picker
                            v-model="searchValue.payoffdate"
                            type="datetimerange"
                            size="mini"
                            unlink-panels
                            align="right"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            range-separator="至"
                            end-placeholder="结束日期"
                            style="width: 320px"
                            :default-time="['09:00:00', '18:00:00']">
                    </el-date-picker>
                    <el-input class="search-input" placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initSalInfo"
                              v-model="searchValue.empname"
                              @keydown.enter.native="initSalInfo">
                    </el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initSalInfo">
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
        <div>
            <div style="margin-top: 10px">
                <el-table
                        style="width: 100%"
                        ref="multipleTable"
                        stripe
                        border
                        max-height="513"
                        :data="salInfos"
                        v-loading="salInfoLoading"
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
                            prop="basicsalary"
                            width="100"
                            align="left"
                            label="基础薪资">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="absenteeism"
                            width="100"
                            align="left"
                            label="缺勤扣除工资">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="overtime"
                            width="100"
                            align="left"
                            label="加班工资">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="busitrip"
                            width="100"
                            align="left"
                            label="出差补助">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="endowment"
                            width="100"
                            align="left"
                            label="养老保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="medical"
                            width="100"
                            align="left"
                            label="医疗保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="unemployment"
                            width="100"
                            align="left"
                            label="失业保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="injury"
                            width="100"
                            align="left"
                            label="工伤保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="maternity"
                            width="100"
                            align="left"
                            label="生育保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="addmedical"
                            width="100"
                            align="left"
                            label="补充医疗保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="housing"
                            width="100"
                            align="left"
                            label="住房公积金">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="enterprisep"
                            width="100"
                            align="left"
                            label="企业年金">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="childedu"
                            width="100"
                            align="left"
                            label="子女教育">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="conedu"
                            width="100"
                            align="left"
                            label="继续教育">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="sermedical"
                            width="100"
                            align="left"
                            label="大病医疗">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="housingloan"
                            width="100"
                            align="left"
                            label="住房贷款利息">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="rental"
                            width="100"
                            align="left"
                            label="住房租金">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="supportold"
                            width="100"
                            align="left"
                            label="赡养老人">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="traffic"
                            width="100"
                            align="left"
                            label="交通补贴">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="catering"
                            width="100"
                            align="left"
                            label="餐饮补贴">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="communication"
                            width="100"
                            align="left"
                            label="通信补贴">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="other"
                            width="100"
                            align="left"
                            label="其它补贴">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="bonus"
                            width="100"
                            align="left"
                            label="奖金">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="sums"
                            width="100"
                            align="left"
                            label="合计">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="salfirstday"
                            width="145"
                            align="left"
                            label="发月薪月首日">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="salendday"
                            width="145"
                            align="left"
                            label="发月薪月末日">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="payoffdate"
                            width="140"
                            align="left"
                            label="计算薪资时间">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            fixed="right"
                            width="60"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="checkSalInfoView(scope.row)" style="padding: 3px" size="mini" type="primary">查看</el-button>
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
        </div>
        <el-dialog
            title="员工历史薪资信息"
            :visible.sync="salInfoDialog"
            width="80%">
            <div>
                <el-form :model="salInfo" disabled label-position="left" label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="员工工号:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.workid"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="员工姓名:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.employee.empname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属部门:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.department.depname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="基础薪资:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.basicsalary"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="扣除工资:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.absenteeism"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="加班工资:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.overtime"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="出差补助:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.busitrip"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="养老保险:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.endowment"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="医疗保险:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.medical"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="失业保险:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.unemployment"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工伤保险:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.injury"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="生育保险:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.maternity"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="补充医疗保险:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.addmedical"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="住房公积金:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.housing"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="企业年金:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.enterprisep"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="子女教育:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.childedu"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="继续教育:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.conedu"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="大病医疗:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.sermedical"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="住房贷款利息:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.housingloan"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="住房租金:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.rental"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="赡养老人:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.supportold"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="交通补贴:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.traffic"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="餐饮补贴:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.catering"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="通信补贴:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.communication"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="其它补贴:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.other"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="奖金:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.bonus"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合计:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.sums"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="月薪月首日:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.salfirstday"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="月薪月末日:">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salInfo.salendday"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="计算薪资时间:">
                                <el-input size="mini" style="width: 150px" v-model="salInfo.payoffdate"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="salInfoDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalInfo",
        data(){
            return {
                searchValue: {
                    empname: null,
                    depid: null,
                    payoffdate: null,
                },
                page: 1,
                size: 10,
                total: 0,
                searchDepView: false,
                salInfoLoading: false,
                salInfoDialog: false,
                inputDepName: '所属部门',
                allDeps: [],
                salInfos: [],
                multipleSelection: [],
                salInfo: {
                    employee: {},
                    department: {}
                },
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                }
            }
        },
        mounted() {
            this.initSalInfo();
            this.initData();
        },
        methods:{
            initSalInfo(){
                this.salInfoLoading=true;
                let url="/salary/information/?page=" + this.page + '&size=' + this.size;
                if(this.searchValue.empname){
                    url+="&empname="+this.searchValue.empname;
                }
                if(this.searchValue.depid){
                    url+="&depid="+this.searchValue.depid;
                }
                if(this.searchValue.payoffdate){
                    url+="&payoffdate="+this.searchValue.payoffdate;
                }
                this.getRequest(url).then(resp => {
                    this.salInfoLoading = false;
                    if (resp) {
                        this.salInfos = resp.data;
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
            exportData(){
                this.postRequestExcel("/salary/information/export/",this.multipleSelection).then(resp => {
                    if (resp) {
                        const content = resp;
                        const blob = new Blob([content],{type: 'application/vnd.ms-excel'});
                        const fileName = this.moment().format('YYYY.MM.DD_HH-mm-ss')+'员工历史薪资信息表.xls';
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
            checkSalInfoView(data){
                this.salInfo=data;
                this.salInfoDialog=true;
            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.searchValue.depid = data.depid;
                this.searchDepView = !this.searchDepView
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initSalInfo();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initSalInfo();
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
        margin: 0 10px 0 3px;
    }
    .search-input{
        width: 350px;
        margin: 0 10px 0 10px;
    }
</style>
