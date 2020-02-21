<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="basicSearch"
                              style="width: 350px;margin-right: 10px" v-model="keyword"
                              @keydown.enter.native="basicSearch" :disabled="showAdvanceSearchView"></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="basicSearch" :disabled="showAdvanceSearchView">
                        搜索
                    </el-button>
                    <el-button type="primary" @click="showAdvanceSearchView = !showAdvanceSearchView">
                        <i :class="showAdvanceSearchView?'fas fa-angle-double-up':'fas fa-angle-double-down'"
                           aria-hidden="true"></i>
                        高级搜索
                    </el-button>
                </div>
                <div>
                    <el-upload
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :disabled="importDataDisabled"
                            style="display: inline-flex;margin-right: 8px"
                            action="/employee/basic/import">
                        <el-button :disabled="importDataDisabled" type="success" :icon="importDataBtnIcon">
                            {{importDataBtnText}}
                        </el-button>
                    </el-upload>
                    <el-button type="success" icon="el-icon-download" @click="exportData">
                        导出数据
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
                        添加用户
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
                </div>
            </div>
            <transition name="slide-fade">
                <div v-show="showAdvanceSearchView"
                     style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
                    <el-row>
                        <el-col :span="5">
                            政治面貌:
                            <el-select clearable v-model="searchValue.politic" placeholder="请选择政治面貌" size="mini"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in politics"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.label">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            民族:
                            <el-select clearable v-model="searchValue.nation" placeholder="请选择民族" size="mini"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in nations"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.label">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5">
                            所属部门:
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="200"
                                    trigger="manual"
                                    v-model="searchDepView">
                                <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                                         @node-click="searvhViewHandleNodeClick"></el-tree>
                                <div slot="reference"
                                     style="width: 130px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;margin-left: 3px"
                                     @click="showSearchDepView">{{inputDepName}}
                                </div>
                            </el-popover>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 10px">
                        <el-col :span="11">
                            任职状态:
                            <el-radio-group v-model="searchValue.workstate">
                                <el-radio label="在职">在职</el-radio>
                                <el-radio label="离职">离职</el-radio>
                                <el-radio label="退休">退休</el-radio>
                                <el-radio label="实习">实习</el-radio>
                                <el-radio label="兼职">兼职</el-radio>
                                <el-radio label="其他">其他</el-radio>
                            </el-radio-group>
                        </el-col>
                        <el-col :span="5" :offset="0">
                            <el-button size="mini" @click="cleanAll">取消</el-button>
                            <el-button size="mini" icon="el-icon-search" type="primary" @click="advancedSearch">搜索</el-button>
                        </el-col>
                    </el-row>
                </div>
            </transition>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    ref="multipleTable"
                    :data="emps"
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="empname"
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
                        prop="gender"
                        label="性别"
                        align="left"
                        width="50">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="birthday"
                        width="95"
                        align="left"
                        label="出生日期">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="idcard"
                        width="150"
                        align="left"
                        label="身份证号码">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="marital"
                        width="70"
                        label="婚姻状况">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="nation"
                        width="85"
                        label="民族">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="nativeplace"
                        width="80"
                        label="籍贯">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="politic"
                        width="110"
                        label="政治面貌">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="email"
                        width="180"
                        align="left"
                        label="电子邮件">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="cellphone"
                        width="100"
                        align="left"
                        label="电话号码">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="address"
                        width="220"
                        align="left"
                        label="联系地址">
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
                        prop="workstate"
                        width="100"
                        align="left"
                        label="任职状态">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="school"
                        width="120"
                        align="left"
                        label="毕业院校">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="specialty"
                        width="150"
                        align="left"
                        label="专业">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="hdegree"
                        width="80"
                        align="left"
                        label="最高学历">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        fixed="right"
                        width="170"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditEmpView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button @click="checkEmpView(scope.row)" style="padding: 3px" size="mini" type="primary">查看</el-button>
                        <el-button @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                        <el-dropdown trigger="click" style="padding: 3px;margin-left: 8px" @command="handleCommand" >
                            <span class="el-dropdown-link"><i class="el-icon-more-outline"></i></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                                <el-dropdown-item command="b">狮子头</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
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
                :title="title"
                :visible.sync="dialogVisible"
                width="80%">
            <div>
                <el-form :model="emp" :rules="rules" ref="empForm" :disabled="NoModify">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="姓名:" prop="empname">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.empname"
                                          placeholder="请输入员工姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="性别:" prop="gender">
                                <el-radio-group v-model="emp.gender">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="出生日期:" prop="birthday">
                                <el-date-picker
                                        v-model="emp.birthday"
                                        size="mini"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        style="width: 150px;"
                                        placeholder="出生日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="政治面貌:" prop="politic">
                                <el-select v-model="emp.politic" clearable filterable placeholder="请选择政治面貌" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in politics"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="民族:" prop="nation">
                                <el-select v-model="emp.nation" clearable filterable placeholder="请选择民族" size="mini" style="width: 150px;">
                                    <el-option
                                            v-for="item in nations"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="籍贯:" prop="nativeplace">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="emp.nativeplace" placeholder="请输入籍贯"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电子邮箱:" prop="email">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                                          v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="联系地址:" prop="address">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.address" placeholder="请输入联系地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工号:" prop="workid">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="emp.workid" placeholder="请输入工号" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="学历:" prop="hdegree">
                                <el-select v-model="emp.hdegree" placeholder="请输入最高学历" size="mini"
                                           style="width: 150px;">
                                    <el-option
                                            v-for="item in hdegrees"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="毕业院校:" prop="school">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="emp.school" placeholder="请输入毕业院校名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="专业名称:" prop="specialty">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.specialty" placeholder="请输入专业名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="8">
                            <el-form-item label="身份证号码:" prop="idcard">
                                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                                          v-model="emp.idcard" placeholder="请输入身份证号码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="备用:" prop="standby">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="standby" placeholder="员工备用属性" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属部门:" prop="depid">
                                <el-popover
                                        :disabled="NoModify"
                                        placement="right"
                                        title="请选择部门"
                                        width="200"
                                        trigger="manual"
                                        v-model="empDepView">
                                    <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                                             @node-click="empViewhandleNodeClick"></el-tree>
                                    <div slot="reference"
                                         style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"
                                         @click="showEmpDepView">{{inputDepName}}
                                    </div>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="电话号码:" prop="cellphone">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                                          v-model="emp.cellphone" placeholder="电话号码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="任职状态:" prop="workstate">
                                <el-radio-group v-model="emp.workstate">
                                    <el-radio label="在职">在职</el-radio>
                                    <el-radio label="离职">离职</el-radio>
                                    <el-radio label="退休">退休</el-radio>
                                    <el-radio label="实习">实习</el-radio>
                                    <el-radio label="兼职">兼职</el-radio>
                                    <el-radio label="其他">其他</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :offset="1">
                            <el-form-item label="婚姻状况:" prop="marital">
                                <el-radio-group v-model="emp.marital">
                                    <el-radio label="已婚">已婚</el-radio>
                                    <el-radio label="未婚">未婚</el-radio>
                                    <el-radio label="离异">离异</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取 消</el-button>
            <el-button type="primary" @click="confirmDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'EmpBasic',
        data() {
            return {
                searchValue: {
                    politic: null,
                    nation: null,
                    depid: null,
                    workstate: null
                },
                searchType: null,
                title: '',
                standby:'备用框',
                importDataBtnText: '导入数据',
                importDataBtnIcon: 'el-icon-upload2',
                importDataDisabled: false,
                showAdvanceSearchView: false,
                allDeps: [],
                emps: [],
                multipleSelection: [],
                loading: false,
                searchDepView: false,
                empDepView: false,
                dialogVisible: false,
                NoModify: false,
                total: 0,
                page: 1,
                keyword: '',
                size: 10,
                nations: [{value:'0',label:''},{value:'1',label:'汉族'}, {value:'2',label:'蒙古族'},{value:'3',label:'回族'},{value:'4',label:'藏族'},{value:'5',label:'维吾尔族'},{value:'6',label:'苗族'},{value:'7',label:'彝族'},{value:'8',label:'壮族'},{value:'9',label:'布依族'},{value:'10',label:'朝鲜族'},{value:'11',label:'满族'},{value:'12',label:'侗族'},{value:'13',label:'瑶族'}, {value:'14',label:'白族'}, {value:'15',label:'土家族'}, {value:'16',label:'哈尼族'}, {value:'17',label:'哈萨克族'},{value:'18',label:'傣族'}, {value:'19',label:'黎族'}, {value:'20',label:'傈僳族'}, {value:'21',label:'佤族'}, {value:'22',label:'畲族'}, {value:'23',label:'高山族'}, {value:'24',label:'拉祜族'}, {value:'25',label:'水族'}, {value:'26',label:'东乡族'},{value:'27',label:'纳西族'},{value:'28',label:'景颇族'},{value:'29',label:'柯尔克孜族'},{value:'30',label:'土族'},{value:'31',label:'达斡尔族'},{value:'32',label:'仫佬族'},{value:'33',label:'羌族'},{value:'34',label:'布朗族'},{value:'35',label:'撒拉族'},{value:'36',label:'毛难族'},{value:'37',label:'仡佬族'},{value:'38',label:'锡伯族'},{value:'39',label:'阿昌族'},{value:'40',label:'普米族'},{value:'41',label:'塔吉克族'},{value:'42',label:'怒族'},{value:'43',label:'乌孜别克族'},{value:'44',label:'俄罗斯族'},{value:'45',label:'鄂温克族'},{value:'46',label:'崩龙族'},{value:'47',label:'保安族'},{value:'48',label:'裕固族'},{value:'49',label:'京族'},{value:'50',label:'塔塔尔族'},{value:'51',label:'独龙族'},{value:'52',label:'鄂伦春族'},{value:'53',label:'赫哲族'},{value:'54',label:'门巴族'},{value:'55',label:'珞巴族'},{value:'56',label:'基诺族'}],
                politics: [{value:'0',label:''},{value:'1',label:'中共党员'},{value:'2',label:'中共预备党员'},{value:'3',label:'共青团员'},{value:'4',label:'民革党员'},{value:'5',label:'民盟盟员'},{value:'6',label:'民建会员'},{value:'7',label:'民进会员'},{value:'8',label:'农工党党员'},{value:'9',label:'致公党党员'},{value:'10',label:'九三学社社员'},{value:'11',label:'台盟盟员'},{value:'12',label:'无党派民主人士'}, {value:'13',label:'普通公民'}],
                hdegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
                inputDepName: '所属部门',
                emp: {
                    empname: "EmperorWS",
                    gender: "男",
                    birthday: "1989-12-31",
                    idcard: "610122199001011256",
                    marital: "已婚",
                    nation: "汉族",
                    nativeplace: "陕西",
                    politic: "共青团员",
                    email: "laowang@qq.com",
                    cellphone: "18565558897",
                    address: "深圳市南山区",
                    depid: 1,
                    hdegree: "本科",
                    specialty: "信息管理与信息系统",
                    school: "深圳大学",
                    workstate: "在职",
                    workid: "00000000057"
                },
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                },
                rules: {
                    empname: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    workid: [{required: true, message: '请输入工号', trigger: 'blur'}],
                    gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
                    birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
                    idcard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }],
                    marital: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
                    nation: [{required: true, message: '请输入民族', trigger: 'blur'}],
                    nativeplace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                    politic: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
                    email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    cellphone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
                    address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
                    depid: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
                    workstate: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
                    school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
                    specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
                    hdegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
                    standby: [{required: false, message: '请输入备用', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.initEmps();
            this.initData();
        },
        methods: {
            onError(err, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
            },
            onSuccess(response, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
                this.initEmps();
            },
            beforeUpload() {
                this.importDataBtnText = '正在导入';
                this.importDataBtnIcon = 'el-icon-loading';
                this.importDataDisabled = true;
            },
            exportData() {
                this.postRequestExcel("/employee/basic/export/",this.multipleSelection).then(resp => {
                    if (resp) {
                        const content = resp;
                        const blob = new Blob([content],{type: 'application/vnd.ms-excel'});
                        const fileName = this.moment().format('YYYY.MM.DD_HH-mm-ss')+'员工信息表.xls';
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
                //window.open('/employee/basic/export','_parent',this.multipleSelection);
            },
            emptyEmp() {
                this.emp = {
                    empname: "",
                    workid: "",
                    gender: "",
                    birthday: "",
                    idcard: "",
                    marital: "",
                    nation: "汉族",
                    nativeplace: "",
                    politic: "中共党员",
                    email: "",
                    cellphone: "",
                    address: "",
                    depid: null,
                    school: "",
                    specialty: "",
                    hdegree: ""
                }
                this.inputDepName = '';
            },
            getMaxWordID() {
                this.getRequest("/employee/basic/maxWorkID").then(resp => {
                    if (resp) {
                        this.emp.workid = resp.obj;
                        this.standby=resp.obj;
                    }
                })
            },
            showAddEmpView() {
                this.emptyEmp();
                this.title = '添加新员工';
                this.getMaxWordID();
                this.dialogVisible = true;
            },
            showEditEmpView(data) {
                this.title = '编辑员工信息';
                this.emp = data;
                this.inputDepName = data.department.depname;
                this.dialogVisible = true;
            },
            checkEmpView(data){
                this.title='查看员工信息';
                this.emp = data;
                this.inputDepName = data.department.depname;
                this.dialogVisible = true;
                this.NoModify=true;
            },
            cancelDialog(){
                this.dialogVisible = false;
                this.NoModify=false;
            },
            confirmDialog(){
                this.doAddEmp();
                this.NoModify=false;
            },
            deleteEmp(data) {
                this.$confirm('此操作将永久删除【' + data.empname + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employee/basic/" + data.workid).then(resp => {
                        if (resp) {
                            this.initEmps();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddEmp() {
                if (this.emp.workid==this.standby) {
                    this.$refs['empForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/employee/basic/", this.emp).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initEmps();
                                    this.standby++;
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['empForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/employee/basic/", this.emp).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initEmps();
                                }
                            })
                        }
                    });
                }
            },
            batchDelete(){
                this.$confirm('此操作将永久删除所选中的所有员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/employee/basic/deleteemps/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initEmps();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.searchValue.depid = data.depid;
                this.searchDepView = !this.searchDepView
            },
            empViewhandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.emp.depid = data.depid;
                this.empDepView = !this.empDepView;
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
            showEmpDepView(){
                this.empDepView=!this.empDepView;
            },
            initData() {
                if (!window.sessionStorage.getItem("deps")) {
                    this.getRequest('/employee/basic/deps').then(resp => {
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
                this.initEmps();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initEmps();
            },
            initEmps() {
                this.loading = true;
                let url = '/employee/basic/?page=' + this.page + '&size=' + this.size;
                if (this.searchType && this.searchType == 'advanced') {
                    if (this.searchValue.politic) {
                        url += '&politic=' + this.searchValue.politic;
                    }
                    if (this.searchValue.nation) {
                        url += '&nation=' + this.searchValue.nation;
                    }
                    if (this.searchValue.depid) {
                        url += '&depid=' + this.searchValue.depid;
                    }
                    if (this.searchValue.workstate) {
                        url += '&workstate=' + this.searchValue.workstate;
                    }
                } else {
                    url += "&empname=" + this.keyword;
                }
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.emps = resp.data;
                        this.total = resp.total;
                    }
                });
            },
            cleanAll(){
                this.searchType=null;
                this.showAdvanceSearchView = !this.showAdvanceSearchView;
                this.initEmps();
            },
            basicSearch(){
                this.searchType=null;
                this.initEmps();
            },
            advancedSearch(){
                this.searchType='advanced';
                this.initEmps();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    /deep/ .slide-fade-enter-active {
        transition: all .8s ease;
    }

    /deep/ .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    /deep/ .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(10px);
        opacity: 0;
    }
</style>