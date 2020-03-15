<template>
    <div style="width: 100%">
        <div>
            <el-steps :active="activeItemIndex" finish-status="success" align-center>
                <el-step title="选择日期范围" description="选择薪资计算的时间范围1~31"></el-step>
                <el-step title="选择计算方式" description="选择薪资的计算方式(月薪或年终奖)"></el-step>
                <el-step title="选择被计算员工的方式" description="选择薪资被计算员工的方式(按部门或按工号)"></el-step>
                <el-step title="选择被计算员工" description="选择被统计员工"></el-step>
            </el-steps>
            <div style="margin-top: 10px">
                <div v-show="activeItemIndex==0">
                    <el-form :model="checkValue" status-icon :rules="rules" ref="salCheckForm" label-position="left" label-width="90px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="时间范围:" prop="timerange">
                                    <el-date-picker
                                            v-model="checkValue.timerange"
                                            type="daterange"
                                            unlink-panels
                                            value-format="yyyy-MM-dd"
                                            range-separator="至"
                                            start-placeholder="薪资计算开始日期"
                                            end-placeholder="薪资计算结束日期"
                                            style="width: 90%">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="加班费:" prop="overtimesal">
                                    <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="checkValue.overtimesal" placeholder="请输入加班费"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出差补助:" prop="businesssal">
                                    <el-input size="mini" style="width: 90%" prefix-icon="el-icon-edit" v-model.number="checkValue.businesssal" placeholder="请输入出差补助"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div v-show="activeItemIndex==1" style="display: flex;justify-content: center">
                    <el-select filterable clearable v-model="checkmethod" placeholder="请选择薪资计算方案" size="mini" style="width: 200px;">
                        <el-option
                                v-for="item in salsches"
                                :key="item.ssid"
                                :label="item.ssname"
                                :value="item.ssid">
                        </el-option>
                    </el-select>
                </div>
                <div v-show="activeItemIndex==2" style="display: flex;justify-content: center">
                    <el-radio-group v-model="way">
                        <el-radio label="0">所有员工</el-radio>
                        <el-radio label="1">按照部门</el-radio>
                        <el-radio label="2">按照员工</el-radio>
                    </el-radio-group>
                </div>
                <div v-show="activeItemIndex==3" style="display: flex;justify-content: center">
                    <div v-show="way==1">
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
            <div style="display: flex;justify-content: flex-end">
                <el-button @click="preStep">{{activeItemIndex==3?'取消':'上一步'}}</el-button>
                <el-button v-loading.fullscreen.lock="salCheckLoading" type="primary" @click="nextStep">{{activeItemIndex==3?'完成':'下一步'}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SalCheck",
        data(){
            return{
                checkValue: {
                    timerange: null,
                    depid: null,
                    overtimesal: null,
                    businesssal: null
                },
                way: '0',
                checkmethod: null,
                activeItemIndex: 0,
                searchDepView: false,
                salCheckLoading: false,
                allDeps: [],
                employees: [],
                salsches: [],
                selectedEmps: [],
                inputDepName: '所属部门',
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                },
                rules: {
                    timerange: [{required: true, message: '请输入薪资计算时间范围', trigger: 'blur'}],
                    overtimesal: [{required: true, message: '请输入加班费', trigger: 'blur'}, {
                        type: 'number',
                        message: '加班费必须为数字值',
                        trigger: 'blur'
                    }],
                    businesssal: [{required: true, message: '请输入出差补助', trigger: 'blur'}, {
                        type: 'number',
                        message: '出差补助必须为数字值',
                        trigger: 'blur'
                    }],
                }
            };
        },
        mounted(){
            this.initData();
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
                if(!window.sessionStorage.getItem("salsches")){
                    this.getRequest("/salary/scheme/").then(resp => {
                        if (resp) {
                            this.salsches = resp;
                            window.sessionStorage.setItem("salsches", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.salsches = JSON.parse(window.sessionStorage.getItem("salsches"));
                }
            },
            preStep() {
                if (this.activeItemIndex == 0) {
                    return;
                } else if (this.activeItemIndex == 3) {
                    this.$router.replace('/home')
                    return;
                }
                this.activeItemIndex--;
            },
            nextStep() {
                if(this.activeItemIndex == 0) {
                    this.$refs['salCheckForm'].validate(valid => {
                        if (valid) {
                            this.activeItemIndex++;
                        }
                    });
                    return;
                }
                if (this.activeItemIndex == 3) {
                    this.salCheckLoading=true;
                    if(this.checkmethod==1) {
                        if (this.way == 0) {
                            this.getRequest("/salary/check/checkall?timerange=" + this.checkValue.timerange + "&overtimesal=" + this.checkValue.overtimesal + "&businesssal=" + this.checkValue.businesssal).then(resp => {
                                if (resp) {
                                    this.salCheckLoading=false;
                                    this.$router.push('/sal/info');
                                }
                            });
                        } else if (this.way == 1) {
                            this.getRequest("/salary/check/checkbydepid?depid=" + this.checkValue.depid + "&timerange=" + this.checkValue.timerange + "&overtimesal=" + this.checkValue.overtimesal + "&businesssal=" + this.checkValue.businesssal).then(resp => {
                                if (resp) {
                                    this.salCheckLoading=false;
                                    this.$router.push('/sal/info');
                                }
                            });
                        } else {
                            this.postRequest("/salary/check/checkbyworkid?timerange=" + this.checkValue.timerange + "&overtimesal=" + this.checkValue.overtimesal + "&businesssal=" + this.checkValue.businesssal, this.selectedEmps).then(resp => {
                                if (resp) {
                                    this.salCheckLoading=false;
                                    this.$router.push('/sal/info');
                                }
                            });
                        }
                    }else{
                        if (this.way == 0) {
                            this.getRequest("/salary/check/yearcheckall?timerange=" + this.checkValue.timerange + "&n=" + this.checkmethod).then(resp => {
                                if (resp) {
                                    this.salCheckLoading=false;
                                    this.$router.push('/sal/info');
                                }
                            });
                        } else if (this.way == 1) {
                            this.getRequest("/salary/check/yearcheckbydepid?depid=" + this.checkValue.depid + "&timerange=" + this.checkValue.timerange + "&n=" + this.checkmethod).then(resp => {
                                if (resp) {
                                    this.salCheckLoading=false;
                                    this.$router.push('/sal/info');
                                }
                            });
                        } else {
                            this.postRequest("/salary/check/yearcheckbyworkid?timerange=" + this.checkValue.timerange + "&n=" + this.checkmethod, this.selectedEmps).then(resp => {
                                if (resp) {
                                    this.salCheckLoading=false;
                                    this.$router.push('/sal/info');
                                }
                            });
                        }
                    }
                }
                this.activeItemIndex++;
                console.log(this.activeItemIndex);
            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.checkValue.depid = data.depid;
                this.searchDepView = !this.searchDepView;
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
        }
    }
</script>

<style scoped>
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
        margin: 0 0 0 0;
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