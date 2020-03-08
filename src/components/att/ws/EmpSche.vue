<template>
    <div style="width: 100%">
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
                排班日期:
                <el-date-picker
                        v-model="firstOfWeek"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期"
                        style="width: 200px">
                </el-date-picker>
                <el-input class="search-input" placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                          clearable
                          @clear="initWS"
                          v-model="searchValue.empname"
                          @keydown.enter.native="initWS"></el-input>
                <el-button icon="el-icon-search" type="primary" @click="initWS">
                    搜索
                </el-button>
            </div>
            <div>
                <el-button type="success" @click="autoDo"><i style="margin-right: 8px" class="fas fa-robot fa-lg"/>本周自动排班</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="batchDeleteSche">批量删除排班</el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <div class="datatitle">
                <el-button type="text" @click="lastweek" style="color: black"><i class="fas fa-arrow-left fa-lg"/></el-button>
                <div>
                    <span>{{firstOfWeek}} 星期日</span>
                    <span> - {{endOfWeek}} 星期六</span>
                </div>
                <el-button type="text" @click="nextweek" style="color: black"><i class="fas fa-arrow-right fa-lg"/></el-button>
            </div>
            <div>
                <el-table
                        style="width: 100%"
                        ref="multipleTable"
                        stripe
                        border
                        max-height="513"
                        :data="wss"
                        v-loading="wsInfoLoading"
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
                            width="110">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="workid"
                            label="工号"
                            align="left"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="department.depname"
                            width="110"
                            align="left"
                            label="所属部门">
                    </el-table-column>
                    <el-table-column :label="firstOfWeek" header-align="center">
                        <el-table-column
                                header-align="center"
                                width="110"
                                align="left"
                                label="星期日">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.sun" placeholder="请选择排班">
                                    <el-option
                                            v-for="item in businesshours"
                                            :key="item.busihoursid"
                                            :label="item.busihoursname"
                                            :value="item.busihoursid">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="this.moment(this.firstOfWeek).day(1).format('YYYY-MM-DD')" header-align="center">
                        <el-table-column
                                header-align="center"
                                width="110"
                                align="left"
                                label="星期一">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.mon" placeholder="请选择排班">
                                    <el-option
                                            v-for="item in businesshours"
                                            :key="item.busihoursid"
                                            :label="item.busihoursname"
                                            :value="item.busihoursid">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="this.moment(this.firstOfWeek).day(2).format('YYYY-MM-DD')" header-align="center">
                        <el-table-column
                                header-align="center"
                                width="110"
                                align="left"
                                label="星期二">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.tue" placeholder="请选择排班">
                                    <el-option
                                            v-for="item in businesshours"
                                            :key="item.busihoursid"
                                            :label="item.busihoursname"
                                            :value="item.busihoursid">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="this.moment(this.firstOfWeek).day(3).format('YYYY-MM-DD')" header-align="center">
                        <el-table-column
                                header-align="center"
                                width="110"
                                align="left"
                                label="星期三">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.wed" placeholder="请选择排班">
                                    <el-option
                                            v-for="item in businesshours"
                                            :key="item.busihoursid"
                                            :label="item.busihoursname"
                                            :value="item.busihoursid">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="this.moment(this.firstOfWeek).day(4).format('YYYY-MM-DD')" header-align="center">
                        <el-table-column
                                header-align="center"
                                width="110"
                                align="left"
                                label="星期四">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.thu" placeholder="请选择排班">
                                    <el-option
                                            v-for="item in businesshours"
                                            :key="item.busihoursid"
                                            :label="item.busihoursname"
                                            :value="item.busihoursid">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="this.moment(this.firstOfWeek).day(5).format('YYYY-MM-DD')" header-align="center">
                        <el-table-column
                                header-align="center"
                                width="110"
                                align="left"
                                label="星期五">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.fri" placeholder="请选择排班">
                                    <el-option
                                            v-for="item in businesshours"
                                            :key="item.busihoursid"
                                            :label="item.busihoursname"
                                            :value="item.busihoursid">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="this.moment(this.firstOfWeek).day(6).format('YYYY-MM-DD')" header-align="center">
                        <el-table-column
                                header-align="center"
                                width="100"
                                align="left"
                                label="星期六">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.sat" placeholder="请选择排班">
                                    <el-option
                                            v-for="item in businesshours"
                                            :key="item.busihoursid"
                                            :label="item.busihoursname"
                                            :value="item.busihoursid">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            fixed="right"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="submitSchedule(scope.row)" style="color: #495057"><i class="fas fa-user-check fa-lg"/></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="display: flex;justify-content: space-between">
                <el-button type="warning" icon="el-icon-upload2" @click="batchUpdate">批量更新</el-button>
                <el-pagination
                        background
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EmpSche",
        data(){
            return{
                searchValue: {
                    empname: null,
                    depid: null,
                },
                firstOfWeek: '',
                endOfWeek: '',
                page: 1,
                size: 10,
                total: 0,
                searchDepView: false,
                wsInfoLoading: false,
                wss: [],
                allDeps: [],
                businesshours: [],
                multipleSelection: [],
                inputDepName: '所属部门',
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                }
            }
        },
        mounted(){
            this.initData();
            this.initWS();
        },
        methods:{
            initData(){
                this.firstOfWeek=this.moment().startOf('week').format('YYYY-MM-DD');
                this.endOfWeek=this.moment(this.firstOfWeek).day(6).format('YYYY-MM-DD');
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
                if (!window.sessionStorage.getItem("businesshours")) {
                    this.getRequest("/attendance/workingschedule/busihour/").then(resp => {
                        if (resp) {
                            this.businesshours = resp;
                            window.sessionStorage.setItem("businesshours", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.businesshours = JSON.parse(window.sessionStorage.getItem("businesshours"));
                }
            },
            initWS(){
                this.wsInfoLoading=true;
                let url="/attendance/workingschedule/schedule/?page=" + this.page + '&size=' + this.size + '&firstofweek=' + this.firstOfWeek;
                if(this.searchValue.empname){
                    url+="&empname="+this.searchValue.empname;
                }
                if(this.searchValue.depid){
                    url+="&depid="+this.searchValue.depid;
                }
                this.getRequest(url).then(resp => {
                    this.wsInfoLoading = false;
                    if (resp) {
                        this.wss = resp.data;
                        this.total = resp.total;
                        if(resp.data.length===0){
                            this.$notify.error({
                                title: '错误',
                                message: '本页员工排班没有数据，请翻页或添加数据！'
                            });
                        }
                    }
                });
            },
            lastweek(){
                this.firstOfWeek=this.moment(this.firstOfWeek).day(-7).format('YYYY-MM-DD');
                this.endOfWeek=this.moment(this.endOfWeek).day(-1).format('YYYY-MM-DD');
                this.initWS();
            },
            nextweek(){
                this.firstOfWeek=this.moment(this.firstOfWeek).day(7).format('YYYY-MM-DD');
                this.endOfWeek=this.moment(this.endOfWeek).day(13).format('YYYY-MM-DD');
                this.initWS();
            },
            autoDo(){
                this.getRequest("/attendance/workingschedule/schedule/autodo/?firstofweek=" + this.firstOfWeek).then(resp => {
                    if (resp) {
                        this.initWS();
                    }
                });
            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.searchValue.depid = data.depid;
                this.searchDepView = !this.searchDepView
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initWS();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initWS();
            },
            submitSchedule(data){
                this.$confirm('此操作将提交【' + data.employee.empname + '】的排班计划, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.putRequest("/attendance/workingschedule/schedule/", data).then(resp => {
                        if (resp) {
                            this.initWS();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    });
                });
            },
            batchUpdate(){
                this.$confirm('此操作将提交所选中的所有的排班计划, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/attendance/workingschedule/schedule/batchupdate/", this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initWS();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    });
                });
            },
            batchDeleteSche(){
                this.$confirm('此操作将删除所选中的所有的排班计划, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/attendance/workingschedule/schedule/batchdelete/", this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initWS();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    });
                });
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
    .datatitle{
        display: flex;
        justify-content: space-between	;
    }
</style>