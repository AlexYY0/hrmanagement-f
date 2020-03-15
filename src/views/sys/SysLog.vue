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
                    操作时间:
                    <el-date-picker
                            v-model="searchValue.logtime"
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
                              @clear="initSystemlog"
                              v-model="searchValue.empname"
                              @keydown.enter.native="initSystemlog">
                    </el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initSystemlog">
                        搜索
                    </el-button>
                </div>
                <el-button type="danger" icon="el-icon-delete" @click="batchDeleteSystemlog">批量删除日志</el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    stripe
                    border
                    max-height="513"
                    :data="systemlogs"
                    v-loading="systemlogLoading"
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
                        prop="syslogid"
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
                        prop="broswer"
                        width="100"
                        align="left"
                        label="浏览器类型">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="version"
                        width="110"
                        align="left"
                        label="浏览器版本">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="ip"
                        width="100"
                        align="left"
                        label="操作IP地址">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        header-align="center"
                        prop="description"
                        width="150"
                        align="left"
                        label="日志描述">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        header-align="center"
                        prop="logcontent"
                        width="330"
                        align="left"
                        label="日志内容">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="logtime"
                        width="140"
                        align="left"
                        label="操作时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        width="80px"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="checkSystemlog(scope.row)" style="color: #15aabf"><i class="fas fa-eye fa-lg"/></el-button>
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
                title="查看日志"
                :visible.sync="systemlogDialog"
                width="50%">
            <div>
                <el-form :model="systemlog" disabled label-position="left" label-width="100px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="员工工号:">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model="systemlog.workid"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="员工姓名:">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model="systemlog.employee.empname"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="所属部门:">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model="systemlog.department.depname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="浏览器类型:">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model="systemlog.broswer"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="浏览器版本:">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model="systemlog.version"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="操作IP:">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model="systemlog.ip"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="操作时间:">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model="systemlog.logtime"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="日志描述:">
                                <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model="systemlog.description"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="日志内容:">
                                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" size="mini" style="width: 95%" prefix-icon="el-icon-edit" v-model="systemlog.logcontent"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="systemlogDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SysLog",
        data(){
            return{
                searchValue: {
                    empname: null,
                    depid: null,
                    logtime: null,
                },
                page: 1,
                size: 10,
                total: 0,
                searchDepView: false,
                systemlogLoading: false,
                systemlogDialog: false,
                inputDepName: '所属部门',
                allDeps: [],
                systemlogs: [],
                multipleSelection: [],
                systemlog: {
                    employee: {},
                    department: {}
                },
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                },
            }
        },
        mounted(){
            this.initSystemlog();
            this.initData();
        },
        methods:{
            initSystemlog(){
                this.systemlogLoading=true;
                let url="/system/log/?page=" + this.page + '&size=' + this.size;
                if(this.searchValue.empname){
                    url+="&empname="+this.searchValue.empname;
                }
                if(this.searchValue.depid){
                    url+="&depid="+this.searchValue.depid;
                }
                if(this.searchValue.logtime){
                    url+="&logtime="+this.searchValue.logtime;
                }
                this.getRequest(url).then(resp => {
                    this.systemlogLoading = false;
                    if (resp) {
                        this.systemlogs = resp.data;
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
            batchDeleteSystemlog(){
                this.$confirm('此操作将永久删除所选中的所有日志, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/system/log/deletesystemlogs/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initSystemlog();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            checkSystemlog(data){
                this.systemlog=data;
                this.systemlogDialog=true;
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initSystemlog();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initSystemlog();
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