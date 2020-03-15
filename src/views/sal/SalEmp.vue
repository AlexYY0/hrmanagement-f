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
                    <el-input class="search-input" placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initEmpSals"
                              v-model="searchValue.empname"
                              @keydown.enter.native="initEmpSals"></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initEmpSals">
                        搜索
                    </el-button>
                </div>
                <div>
                    <el-upload
                            class="upload-button"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :disabled="importDataDisabled"
                            action="/salary/employee/import">
                        <el-button :disabled="importDataDisabled" type="success" :icon="importDataBtnIcon">
                            {{importDataBtnText}}
                        </el-button>
                    </el-upload>
                    <el-button type="success" icon="el-icon-download" @click="exportData">
                        导出数据
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpSalView">
                        添加员工薪酬
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
                        :data="empSals"
                        v-loading="empSalLoading"
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
                            prop="endowment"
                            width="100"
                            align="left"
                            :formatter="isChoose"
                            label="养老保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="medical"
                            width="100"
                            align="left"
                            :formatter="isChoose"
                            label="医疗保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="unemployment"
                            width="100"
                            align="left"
                            :formatter="isChoose"
                            label="失业保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="injury"
                            width="100"
                            align="left"
                            :formatter="isChoose"
                            label="工伤保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="maternity"
                            width="100"
                            align="left"
                            :formatter="isChoose"
                            label="生育保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="addmedical"
                            width="100"
                            align="left"
                            :formatter="isChoose"
                            label="补充医疗保险">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="housing"
                            width="100"
                            align="left"
                            :formatter="isChoose"
                            label="住房公积金">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="enterprisep"
                            width="100"
                            align="left"
                            :formatter="isChoose"
                            label="企业年金">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="speadd1.sadname"
                            width="200"
                            align="left"
                            label="子女教育">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="speadd2.sadname"
                            width="200"
                            align="left"
                            label="继续教育">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="speadd3.sadname"
                            width="200"
                            align="left"
                            label="大病医疗">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="speadd4.sadname"
                            width="200"
                            align="left"
                            label="住房贷款利息">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="speadd5.sadname"
                            width="200"
                            align="left"
                            label="住房租金">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            prop="speadd6.sadname"
                            width="200"
                            align="left"
                            label="赡养老人">
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            width="100"
                            align="left"
                            label="福利补贴">
                        <template slot-scope="scope">
                            <el-tooltip placement="right" v-if="scope.row.welfare">
                                <div slot="content">
                                    <table>
                                        <tr>
                                            <td>交通补贴</td>
                                            <td>{{scope.row.welfare.traffic}}</td>
                                        </tr>
                                        <tr>
                                            <td>餐饮补贴</td>
                                            <td>{{scope.row.welfare.catering}}</td>
                                        </tr>
                                        <tr>
                                            <td>通信补贴</td>
                                            <td>{{scope.row.welfare.communication}}</td>
                                        </tr>
                                        <tr>
                                            <td>奖金</td>
                                            <td>{{scope.row.welfare.bonus}}</td>
                                        </tr>
                                        <tr>
                                            <td>其它</td>
                                            <td>{{scope.row.welfare.other}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <el-tag>{{scope.row.welfare.welname}}</el-tag>
                            </el-tooltip>
                            <el-tag v-else>暂未设置</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            header-align="center"
                            fixed="right"
                            width="125"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="checkEmpSalView(scope.row)" style="padding: 3px" size="mini" type="primary">查看</el-button>
                            <el-button @click="deleteEmpSal(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                            <el-dropdown trigger="click" style="padding: 3px;margin-left: 8px" @command="moreCommand" >
                                <span class="more-emp-menus"><i class="el-icon-more-outline"></i></span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command='{command:"empSalAdj",rowdata:scope.row}'>薪资调整</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
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
        </div>
        <el-dialog
                :title="title"
                :visible.sync="empSalDialog"
                width="80%">
            <div>
                <el-form :model="empSal" status-icon :rules="rules" ref="empSalForm" :disabled="NoModify">
                    <el-row>
                        <el-col v-if="!isEmpSalAdj" :span="6">
                            <el-form-item label="员工姓名:" prop="workid">
                                <el-select
                                        style="width: 200px"
                                        :popper-append-to-body="false" class="findAllEmp-autocomplete"
                                        clearable v-model="empSal.workid" filterable placeholder="请选择员工姓名">
                                    <el-option
                                            v-for="item in employees"
                                            :key="item.workid"
                                            :label="item.label"
                                            :value="item.workid">
                                        <div class="empname">{{ item.label }}</div>
                                        <span class="workid">工号: {{ item.workid }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="isEmpSalAdj" :span="6">
                            <el-form-item label="员工工号:" prop="workid" :rules="[{required: true, message: '请输入工号', trigger: 'blur'}]">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="empSal.workid" placeholder="请输入工号" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="基础薪资:" prop="basicsalary">
                                <el-input clearable style="width: 200px" prefix-icon="el-icon-edit" v-model.number="empSal.basicsalary"
                                          placeholder="请输入基础薪资">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="子女教育:" prop="childedu">
                                <el-select filterable clearable v-model="empSal.childedu" placeholder="请选择子女教育" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in speadds"
                                            :key="item.sadid"
                                            :label="item.sadname"
                                            :value="item.sadid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="继续教育:" prop="conedu">
                                <el-select filterable clearable v-model="empSal.conedu" placeholder="请选择继续教育" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in speadds"
                                            :key="item.sadid"
                                            :label="item.sadname"
                                            :value="item.sadid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="大病医疗:" prop="sermedical">
                                <el-select filterable clearable v-model="empSal.sermedical" placeholder="请选择大病医疗" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in speadds"
                                            :key="item.sadid"
                                            :label="item.sadname"
                                            :value="item.sadid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="住房贷款:" prop="housingloan">
                                <el-select filterable clearable v-model="empSal.housingloan" placeholder="请选择住房贷款" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in speadds"
                                            :key="item.sadid"
                                            :label="item.sadname"
                                            :value="item.sadid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="住房租金:" prop="rental">
                                <el-select filterable clearable v-model="empSal.rental" placeholder="请选择住房租金" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in speadds"
                                            :key="item.sadid"
                                            :label="item.sadname"
                                            :value="item.sadid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="赡养老人:" prop="supportold">
                                <el-select filterable clearable v-model="empSal.supportold" placeholder="请选择赡养老人" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in speadds"
                                            :key="item.sadid"
                                            :label="item.sadname"
                                            :value="item.sadid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="福利补贴:" prop="welid">
                                <el-select filterable clearable v-model="empSal.welid" placeholder="请选择福利补贴" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in wels"
                                            :key="item.welid"
                                            :label="item.welname"
                                            :value="item.welid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="养老保险:" prop="endowment">
                                <el-switch
                                        v-model="empSal.endowment"
                                        active-text="启用"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="医疗保险:" prop="medical">
                                <el-switch
                                        v-model="empSal.medical"
                                        active-text="启用"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="失业保险:" prop="unemployment">
                                <el-switch
                                        v-model="empSal.unemployment"
                                        active-text="启用"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工伤保险:" prop="injury">
                                <el-switch
                                        v-model="empSal.injury"
                                        active-text="启用"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="生育保险:" prop="maternity">
                                <el-switch
                                        v-model="empSal.maternity"
                                        active-text="启用"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="补充医疗保险:" prop="addmedical">
                                <el-switch
                                        v-model="empSal.addmedical"
                                        active-text="启用"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="住房公积金:" prop="housing">
                                <el-switch
                                        v-model="empSal.housing"
                                        active-text="启用"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="企业年金:" prop="enterprisep">
                                <el-switch
                                        v-model="empSal.enterprisep"
                                        active-text="启用"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="isEmpSalAdj" :span="6">
                            <el-form-item label="调薪日期:" prop="empSalAdj.sadate">
                                <el-date-picker
                                        v-model="empSal.empSalAdj.sadate"
                                        size="mini"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择调薪日期"
                                        style="width: 200px;"
                                        default-time="09:00:00">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="isEmpSalAdj" :span="12">
                            <el-form-item label="调薪备注:" prop="empSalAdj.saremark">
                                <el-input
                                        style="width: 100%"
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 7}"
                                        placeholder="请输入内容"
                                        v-model="empSal.empSalAdj.saremark"
                                        minlength="10"
                                        maxlength="255"
                                        show-word-limit>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="empSalDialog = false">取 消</el-button>
                <el-button type="primary" @click="doAddEmpSal">确 定</el-button>
            </span>
        </el-dialog>
        <el-drawer
                title="员工薪资调整"
                :visible.sync="empSalAdjDrawer"
                :direction="direction"
                size="35%"
                :before-close="DrawerClose">
            <div style="margin:0 10px 0 10px">
                <div style="display: flex;justify-content: space-between">
                    <div>
                        <el-date-picker
                                v-model="searchEmpSalAdj"
                                type="datetimerange"
                                size="mini"
                                unlink-panels
                                align="right"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                range-separator="至"
                                end-placeholder="结束日期"
                                style="margin-right: 10px;width: 320px"
                                :default-time="['09:00:00', '18:00:00']">
                        </el-date-picker>
                        <el-button icon="el-icon-search" type="primary" @click="empSalAdjSearch">
                            搜索
                        </el-button>
                    </div>
                    <div>
                        <el-button style="display: inline-flex" type="primary" icon="el-icon-plus" @click="addEmpSalAdj">
                            薪资调整
                        </el-button>
                    </div>
                </div>
                <div style="margin-top: 10px">
                    <el-table
                            stripe
                            border
                            max-height="520"
                            :data="empSalAdjs"
                            style="width: 100%"
                            v-loading="empSalAdjLoading"
                            element-loading-text="正在加载..."
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.8)"
                            :default-sort = "{prop: 'sadate', order: 'descending'}">
                        <el-table-column
                                header-align="center"
                                prop="employee.empname"
                                label="姓名"
                                width="90">
                        </el-table-column>
                        <el-table-column
                                header-align="center"
                                prop="workid"
                                label="工号"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                header-align="center"
                                prop="sadate"
                                label="调薪日期"
                                sortable width="140">
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button
                                        type="primary"
                                        style="padding: 3px"
                                        size="mini"
                                        @click="checkEmpSalAdj(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="display: flex;justify-content: flex-end">
                        <el-pagination
                                background
                                @current-change="empSalAdjCurrentChange"
                                @size-change="empSalAdjSizeChange"
                                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                                :total="empsaladjtotal">
                        </el-pagination>
                    </div>
                </div>
                <el-dialog
                        :append-to-body="true"
                        title="查看员工薪资调整"
                        :visible.sync="empSalAdjDialogForm"
                        width="30%">
                    <el-form :model="empSalAdj" disabled>
                        <el-form-item label="员工工号: " prop="workid">
                            <el-input style="width: 200px" v-model="empSalAdj.workid" prefix-icon="el-icon-edit"></el-input>
                        </el-form-item>
                        <el-form-item label="调薪日期: " prop="sadate">
                            <el-date-picker
                                    v-model="empSalAdj.sadate"
                                    size="mini"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择调薪日期"
                                    style="width: 200px;"
                                    default-time="09:00:00">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="调薪备注: " prop="saremark">
                            <el-input
                                    style="width: 100%"
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 7}"
                                    placeholder="请输入内容"
                                    v-model="empSalAdj.saremark"
                                    minlength="10"
                                    maxlength="255"
                                    show-word-limit>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="info" @click="empSalAdjDialogForm = false">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    export default {
        name: "SalEmp",
        data() {
            let validWorkid = (rule, value, callback) => {
                this.getRequest("/salary/employee/find?workid=" + value).then(resp => {
                    if (resp) {
                        callback(new Error('该员工已拥有薪资信息!'));
                    } else
                        callback();
                })
            };
            return {
                searchValue: {
                    empname: null,
                    depid: null
                },
                searchEmpSalAdj: null,
                searchDepView: false,
                empSalLoading: false,
                importDataDisabled: false,
                empSalDialog: false,
                salAdjDialog: false,
                NoModify: false,
                empSalAdjDrawer: false,
                empSalAdjLoading: false,
                isEmpSalAdj: false,
                empSalAdjDialogForm: false,
                direction: 'rtl',
                currentEmpSal: [],
                allDeps: [],
                empSals: [],
                speadds: [],
                wels: [],
                multipleSelection: [],
                employees: [],
                empSalAdjs: [],
                title: '',
                inputDepName: '所属部门',
                importDataBtnText: '导入数据',
                importDataBtnIcon: 'el-icon-upload2',
                page: 1,
                size: 10,
                total: 0,
                empsaladjpage: 1,
                empsaladjsize: 10,
                empsaladjtotal: 0,
                empSalAdj: {
                    sadate: "",
                    saremark: ""
                },
                empSal: {
                    workid: 1,
                    basicsalary: 6000,
                    endowment: 0,
                    medical: 0,
                    unemployment: 0,
                    injury: 0,
                    maternity: 0,
                    addmedical: 0,
                    housing: 0,
                    enterprisep: 0,
                    childedu: 1,
                    conedu: 1,
                    sermedical: 1,
                    housingloan: 1,
                    rental: 1,
                    supportold: 1,
                    welid: 1,
                    empSalAdj: {
                        sadate: '',
                        saremark: ''
                    }
                },
                rules: {
                    workid: [{required: true, message: '请输入工号', trigger: 'blur'}, {
                        validator: validWorkid, trigger: 'blur'
                    }],
                    basicsalary: [{required: true, message: '请输入基础薪资', trigger: 'blur'},{
                        type: 'number',
                        message: '基础薪资必须为数字值',
                        trigger: 'blur'
                    }],
                    endowment: [{required: true, message: '请选择养老保险', trigger: 'blur'}],
                    medical: [{required: true, message: '请选择医疗保险', trigger: 'blur'}],
                    unemployment: [{required: true, message: '请选择失业保险', trigger: 'blur'}],
                    injury: [{required: true, message: '请选择工伤保险', trigger: 'blur'}],
                    maternity: [{required: true, message: '请选择生育保险', trigger: 'blur'}],
                    addmedical: [{required: true, message: '请选择补充医疗保险', trigger: 'blur'}],
                    housing: [{required: true, message: '请选择住房公积金', trigger: 'blur'}],
                    enterprisep: [{required: true, message: '请选择企业年金', trigger: 'blur'}],
                    welid: [{required: true, message: '请选择福利补贴', trigger: 'change'}],
                    childedu: [{required: true, message: '请选择子女教育', trigger: 'change'}],
                    conedu: [{required: true, message: '请选择继续教育', trigger: 'change'}],
                    sermedical: [{required: true, message: '请选择大病医疗', trigger: 'change'}],
                    housingloan: [{required: true, message: '请选择住房贷款利息', trigger: 'change'}],
                    rental: [{required: true, message: '请选择住房租金', trigger: 'change'}],
                    supportold: [{required: true, message: '请选择赡养老人', trigger: 'change'}],
                    'empSalAdj.sadate': [{required: true, message: '请输入调薪日期', trigger: 'blur'}],
                    'empSalAdj.saremark': [{required: true, message: '请输入调薪备注', trigger: 'blur'}]
                },
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                }
            }
        },
        mounted() {
            this.initEmpSals();
            this.initData();
        },
        methods: {
            initEmpSals(){
                this.empSalLoading=true;
                let url="/salary/employee/?page=" + this.page + '&size=' + this.size;
                if(this.searchValue.empname){
                    url+="&empname="+this.searchValue.empname;
                }
                if(this.searchValue.depid){
                    url+="&depid="+this.searchValue.depid;
                }
                this.getRequest(url).then(resp => {
                    this.empSalLoading = false;
                    if (resp) {
                        this.empSals = resp.data;
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
                if (!window.sessionStorage.getItem("speadds")) {
                    this.getRequest("/salary/specialadditionaldeduction/?page=-1&size=-1").then(resp => {
                        if (resp) {
                            this.speadds = resp.data;
                            window.sessionStorage.setItem("speadds", JSON.stringify(resp.data));
                        }
                    })
                } else {
                    this.speadds = JSON.parse(window.sessionStorage.getItem("speadds"));
                }
                if (!window.sessionStorage.getItem("wels")) {
                    this.getRequest("/salary/welfare/?page=-1&size=-1").then(resp => {
                        if (resp) {
                            this.wels = resp.data;
                            window.sessionStorage.setItem("wels", JSON.stringify(resp.data));
                        }
                    })
                } else {
                    this.wels = JSON.parse(window.sessionStorage.getItem("wels"));
                }
            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.depname;
                this.searchValue.depid = data.depid;
                this.searchDepView = !this.searchDepView
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
            onError() {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
            },
            onSuccess() {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
                this.initEmpSals();
            },
            beforeUpload(file) {
                const isExcel = file.type === "application/vnd.ms-excel";
                if (!isExcel) {
                    this.$message.error("上传文件只能是 xlsx/xls 格式!");
                    return false;
                }
                this.importDataBtnText = '正在导入';
                this.importDataBtnIcon = 'el-icon-loading';
                this.importDataDisabled = true;
            },
            exportData(){
                this.postRequestExcel("/salary/employee/export/",this.multipleSelection).then(resp => {
                    if (resp) {
                        const content = resp;
                        const blob = new Blob([content],{type: 'application/vnd.ms-excel'});
                        const fileName = this.moment().format('YYYY.MM.DD_HH-mm-ss')+'员工薪资信息表.xls';
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
            emptyEmpSal(){
                this.empSal= {
                    workid: "",
                    basicsalary: "",
                    endowment: 0,
                    medical: 0,
                    unemployment: 0,
                    injury: 0,
                    maternity: 0,
                    addmedical: 0,
                    housing: 0,
                    enterprisep: 0,
                    childedu: "",
                    conedu: "",
                    sermedical: "",
                    housingloan: "",
                    rental: "",
                    supportold: "",
                    welid: "",
                    empSalAdj: {
                        sadate: '2019-01-01',
                        saremark: 'test'
                    }
                }
            },
            checkEmpSalView(data){
                this.title='查看员工薪酬信息';
                this.isEmpSalAdj=false;
                this.empSal = data;
                this.NoModify=true;
                this.empSalDialog = true;
            },
            showAddEmpSalView(){
                this.emptyEmpSal();
                this.title = '添加员工新薪酬';
                this.isEmpSalAdj=false;
                this.NoModify=false;
                this.empSalDialog=true;
                this.$refs['empSalForm'].resetFields();
            },
            batchDelete(){
                this.$confirm('此操作将永久删除所选中的所有员工薪资信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/salary/employee/deleteempsals/",this.multipleSelection).then(resp => {
                        if (resp) {
                            this.initEmpSals();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteEmpSal(data){
                this.$confirm('此操作将永久删除【' + data.employee.empname + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/employee/" + data.esid).then(resp => {
                        if (resp) {
                            this.initEmpSals();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddEmpSal(){
                if(this.empSal.esid){
                    if(this.NoModify===true){
                        this.empSalDialog=false;
                        return;
                    }
                    this.$refs['empSalForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/salary/employee/", this.empSal).then(resp => {
                                if (resp) {
                                    //this.initEmpSals();
                                }
                            });
                            let empSalAdj=this.empSal.empSalAdj;
                            empSalAdj.workid=this.empSal.workid;
                            this.postRequest("/salary/employee/saladj/", empSalAdj).then(resp => {
                                if (resp) {
                                    this.empSalDialog = false;
                                    this.initEmpSalAdj(this.currentEmpSal);
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['empSalForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/salary/employee/", this.empSal).then(resp => {
                                if (resp) {
                                    this.empSalDialog = false;
                                    this.initEmpSals();
                                }
                            })
                        }
                    });
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            isChoose(row, column, cellValue){
                if(cellValue===false)
                    return '否';
                else
                    return '是';
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initSads();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initSads();
            },
            moreCommand(command){
                switch (command.command) {
                    case "empSalAdj":
                        this.empSalAdjDrawer=true;
                        this.direction='rtl';
                        this.currentEmpSal=Object.assign({},command.rowdata);
                        this.initEmpSalAdj(this.currentEmpSal);
                        break;
                }
            },
            DrawerClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                        this.initEmpSals();
                    })
                    .catch(_ => {});
            },
            initEmpSalAdj(data){
                this.empSalAdjLoading = true;
                let url = '/salary/employee/saladj/?page=' + this.empsaladjpage + '&size=' + this.empsaladjsize+ '&workid=' + data.workid;
                if (this.searchEmpSalAdj) {
                    url += "&sadate=" + this.searchEmpSalAdj;
                }
                this.getRequest(url).then(resp => {
                    this.empSalAdjLoading = false;
                    if (resp) {
                        this.empSalAdjs = resp.data;
                        this.empsaladjtotal = resp.total;
                    }
                });
            },
            empSalAdjSearch(){
                this.initEmpSalAdj(this.currentEmpSal);
            },
            addEmpSalAdj(){
                this.title = '调整员工薪酬';
                this.empSal = Object.assign({},this.currentEmpSal);
                this.empSalAdj={
                    sadate: "",
                    saremark: ""
                };
                this.empSal.empSalAdj=this.empSalAdj;
                this.isEmpSalAdj=true;
                this.NoModify=false;
                this.empSalDialog = true;
                this.$refs['empSalForm'].clearValidate();
            },
            empSalAdjCurrentChange(currentPage){
                this.empsaladjpage=currentPage;
                this.initEmpSalAdj(this.currentEmpSal);
            },
            empSalAdjSizeChange(currentSize){
                this.empsaladjsize=currentSize;
                this.initEmpSalAdj(this.currentEmpSal);
            },
            checkEmpSalAdj(data){
                this.empSalAdj=data;
                this.empSalAdjDialogForm=true;
            }
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
        margin-left: 3px;
    }
    .search-input{
        width: 350px;
        margin: 0 10px 0 10px;
    }
    .upload-button{
        display: inline-flex;
        margin-right: 8px;
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