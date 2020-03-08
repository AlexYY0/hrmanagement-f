<template>
    <div>
        <div>
            <div class="top-menu">
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
                            action="/employee/basic/info/import">
                        <el-button :disabled="importDataDisabled" type="success" :icon="importDataBtnIcon">
                            {{importDataBtnText}}
                        </el-button>
                    </el-upload>
                    <el-button type="success" icon="el-icon-download" @click="exportData">
                        导出数据
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
                        添加员工
                    </el-button>
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
                                <div class="select-dep" slot="reference"
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
                    max-height="513"
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
                        <el-dropdown trigger="click" style="padding: 3px;margin-left: 8px" @command="moreCommand" >
                            <span class="more-emp-menus"><i class="el-icon-more-outline"></i></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command='{command:"empChange",rowdata:scope.row}'>人事变动</el-dropdown-item>
                                <el-dropdown-item :command='{command:"contract",rowdata:scope.row}'>合同管理</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <div>
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
        </div>
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="80%">
            <div>
                <el-form :model="emp" status-icon :rules="rules" ref="empForm" :disabled="NoModify">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="姓名:" prop="empname">
                                <el-input clearable size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.empname"
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
                                <el-input clearable size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="emp.nativeplace" placeholder="请输入籍贯"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电子邮箱:" prop="email">
                                <el-input clearable size="mini" style="width: 150px" prefix-icon="el-icon-message"
                                          v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="联系地址:" prop="address">
                                <el-input clearable size="mini" style="width: 200px" prefix-icon="el-icon-edit"
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
                                <el-select clearable v-model="emp.hdegree" placeholder="请输入最高学历" size="mini"
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
                                <el-input clearable size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="emp.school" placeholder="请输入毕业院校名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="专业名称:" prop="specialty">
                                <el-input clearable size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.specialty" placeholder="请输入专业名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="8">
                            <el-form-item label="身份证号码:" prop="idcard">
                                <el-input clearable size="mini" style="width: 180px" prefix-icon="el-icon-edit"
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
                                <el-input clearable size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                                          v-model.number="emp.cellphone" placeholder="电话号码"></el-input>
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
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddEmp">确 定</el-button>
            </span>
        </el-dialog>
        <el-drawer
                title="员工人事变动"
                :visible.sync="empChangeDrawer"
                :direction="direction"
                size="30%"
                :before-close="DrawerClose">
            <div style="margin:0 10px 0 10px">
                <div style="display: flex;justify-content: space-between">
                    <div>
                        <el-date-picker
                                v-model="searchEmpChangeData"
                                type="daterange"
                                size="mini"
                                unlink-panels
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="margin-right: 10px;width: 200px">
                        </el-date-picker>
                        <el-button icon="el-icon-search" type="primary" @click="empChangeSearch">
                            搜索
                        </el-button>
                    </div>
                    <div>
                        <el-button style="display: inline-flex" type="primary" icon="el-icon-plus" @click="addEmpChange">
                            人事调整
                        </el-button>
                    </div>
                </div>
                <div style="margin-top: 10px">
                    <el-table
                            stripe
                            border
                            max-height="520"
                            :data="empChanges"
                            style="width: 100%"
                            v-loading="empChangeLoading"
                            element-loading-text="正在加载..."
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.8)"
                            :default-sort = "{prop: 'empchandata', order: 'descending'}">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="emp-change-expand">
                                    <el-form-item label="员工姓名: ">
                                        <span>{{ props.row.employee.empname }}</span>
                                    </el-form-item>
                                    <el-form-item label="员工工号: ">
                                        <span>{{ props.row.workid }}</span>
                                    </el-form-item>
                                    <el-form-item label="调动部门: ">
                                        <span>{{ props.row.department.depname }}</span>
                                    </el-form-item>
                                    <el-form-item label="调动日期: ">
                                        <span>{{ props.row.empchandata }}</span>
                                    </el-form-item>
                                    <el-form-item label="调动备注: ">
                                        <span>{{ props.row.empchanremark }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
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
                                prop="empchandata"
                                label="调动日期"
                                sortable>
                        </el-table-column>
                    </el-table>
                    <div style="display: flex;justify-content: flex-end">
                        <el-pagination
                                background
                                @current-change="empChangeCurrentChange"
                                @size-change="empChangeSizeChange"
                                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                                :total="empChangesTotal">
                        </el-pagination>
                    </div>
                </div>
                <el-dialog
                        :append-to-body="true"
                        title="添加人事调动"
                        :visible.sync="empChangeDialogForm"
                        width="30%">
                    <el-form :model="empchange" status-icon :rules="rules" ref="empChangeForm">
                        <el-form-item label="员工工号: " prop="workid">
                            <el-input style="width: 200px" v-model="empchange.workid" prefix-icon="el-icon-edit" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="调任部门: " prop="afterdepid">
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="200"
                                    trigger="manual"
                                    v-model="empChangePopover">
                                <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                                         @node-click="empChangeHandleNodeClick"></el-tree>
                                <div slot="reference"
                                     style="width: 200px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"
                                     @click="showEmpChangeView">{{inputDepName}}
                                </div>
                            </el-popover>
                        </el-form-item>
                        <el-form-item label="调动日期: " prop="empchandata">
                            <el-date-picker
                                    v-model="empchange.empchandata"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择排班周日日期"
                                    style="width: 200px">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="调动原因: " prop="empchanremark">
                            <el-input
                                    style="width: 100%"
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 7}"
                                    placeholder="请输入内容"
                                    v-model="empchange.empchanremark"
                                    minlength="10"
                                    maxlength="255"
                                    show-word-limit>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="empChangeDialogForm = false">取 消</el-button>
                        <el-button type="primary" @click="confirmAddEmpChange">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-drawer>
        <el-drawer
                title="员工合同管理"
                :visible.sync="contractDrawer"
                :direction="direction"
                size="30%"
                :before-close="DrawerClose">
            <div style="margin:0 10px 0 10px">
                <div style="display: flex;justify-content: space-between">
                    <div>
                        <el-date-picker
                                v-model="searchContractData"
                                type="daterange"
                                size="mini"
                                unlink-panels
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="margin-right: 10px;width: 250px">
                        </el-date-picker>
                        <el-button icon="el-icon-search" type="primary" @click="contractSearch">
                            搜索
                        </el-button>
                    </div>
                    <div>
                        <el-button type="warning" icon="el-icon-plus" circle @click="addContract"></el-button>
                    </div>
                </div>
                <div style="margin-top: 10px">
                    <el-table
                            stripe
                            border
                            max-height="530"
                            :data="contracts"
                            style="width: 100%"
                            v-loading="contractLoading"
                            element-loading-text="正在加载..."
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.8)"
                            :default-sort = "{prop: 'signdata', order: 'descending'}">
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
                                prop="signdata"
                                label="签定日期"
                                sortable>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button
                                        type="primary"
                                        style="padding: 3px"
                                        size="mini"
                                        @click="checkContract(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="display: flex;justify-content: flex-end">
                        <el-pagination
                                background
                                @current-change="contractCurrentChange"
                                @size-change="contractSizeChange"
                                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                                :total="contractTotal">
                        </el-pagination>
                    </div>
                </div>
                <el-dialog
                        :append-to-body="true"
                        :title="contracttitle"
                        :visible.sync="contractDialogForm"
                        width="80%">
                    <el-form :disabled="isContractChange" :model="contract" status-icon :rules="rules" ref="contractForm">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="员工工号: " prop="workid">
                                    <el-input style="width: 150px" v-model="contract.workid" prefix-icon="el-icon-edit" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="合同生效: " prop="begincontract">
                                    <el-date-picker
                                            v-model="contract.begincontract"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width: 150px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="合同结束: " prop="endcontract">
                                    <el-date-picker
                                            v-model="contract.endcontract"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width: 150px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="签署日期: " prop="signdata">
                                    <el-date-picker
                                            v-model="contract.signdata"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width: 150px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item label="合同内容: " prop="content">
                                    <el-upload
                                            :hidden="NotUploadImage"
                                            ref="uploadImage"
                                            action="http://upload.qiniup.com"
                                            multiple
                                            :limit="50"
                                            :file-list="fileLists"
                                            :before-upload="beforeImageUpload"
                                            :on-change="imageChange"
                                            :on-success="uploadImageSuccess"
                                            :on-error="uploadImageError"
                                            :on-progress="uploadProcess"
                                            :data="uptoken"
                                            list-type="picture-card"
                                            :auto-upload="false">
                                        <i slot="default" class="el-icon-plus"></i>
                                        <div slot="file" slot-scope="{file}">
                                            <el-image
                                                    class="el-upload-list__item-thumbnail"
                                                    :src="file.url"
                                                    fit="cover"
                                                    :preview-src-list="fileList">
                                            </el-image>
                                            <el-progress v-if="imgFlag == true" type="circle" :percentage="percent" style="margin-top: 20px"></el-progress>
                                        </div>
                                    </el-upload>
                                    <li :hidden="NotShowImage" class="imageShow" v-for="(item,index) in fileList" :key="index">
                                        <el-image
                                                :append-to-body="true"
                                                style="width: 100px; height: 100px"
                                                :src="item"
                                                fit="cover"
                                                :preview-src-list="fileList">
                                        </el-image>
                                    </li>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button :disabled="NotUploadImage" icon="el-icon-upload" :loading="uploadImageLoading" style="margin-right: 20px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        <el-button @click="contractDialogForm = false">取 消</el-button>
                        <el-button type="primary" @click="confirmAddContract">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-drawer>
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
                empChangeDrawer: false,
                contractDrawer: false,
                direction: 'rtl',
                searchEmpChangeData: null,
                searchContractData: null,
                title: '',
                contracttitle: '',
                standby:'备用框',
                importDataBtnText: '导入数据',
                importDataBtnIcon: 'el-icon-upload2',
                importDataDisabled: false,
                showAdvanceSearchView: false,
                allDeps: [],
                emps: [],
                multipleSelection: [],
                empChanges: [],
                contracts: [],
                loading: false,
                empChangeLoading:false,
                contractLoading: false,
                searchDepView: false,
                empDepView: false,
                dialogVisible: false,
                NoModify: false,
                isContractChange: false,
                empChangePopover: false,
                empChangeDialogForm: false,
                contractDialogForm: false,
                keyword: '',
                page: 1,
                size: 10,
                total: 0,
                empchangepage: 1,
                empchangesize: 10,
                empChangesTotal: 0,
                contractpage: 1,
                contractsize: 10,
                contractTotal: 0,
                currentworkid: 0,
                imgFlag: false,
                percent: 0,
                uptoken: {
                    token: '',
                    key: ''
                },
                fileList: [],
                fileLists: [],
                NotUploadImage: false,
                NotShowImage: false,
                uploadImageLoading: false,
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
                empchange: {
                    workid: "1",
                    afterdepid: 1,
                    empchandata: "2020-1-20",
                    empchanremark: "test"
                },
                contract: {
                    workid: "1",
                    begincontract: "2020-1-20",
                    endcontract: "2020-1-20",
                    content: "test",
                    signdata: "2020-1-20"
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
                    nation: [{required: true, message: '请选择民族', trigger: 'change'}],
                    nativeplace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                    politic: [{required: true, message: '请选择政治面貌', trigger: 'change'}],
                    email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    cellphone: [{required: true, message: '请输入电话号码', trigger: 'blur'},{
                        type: 'number',
                        message: '电话号码必须为数字值',
                        trigger: 'blur'
                    },{
                        pattern:/[0-9]{11}/,
                        message: '电话号码格式不正确',
                        trigger: 'blur'
                    }],
                    address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
                    depid: [{required: true, message: '请选择部门名称', trigger: 'change'}],
                    workstate: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
                    school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
                    specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
                    hdegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
                    afterdepid: [{required: true, message: '请选择部门名称', trigger: 'change'}],
                    empchandata: [{required: true, message: '请输入调动日期', trigger: 'blur'}],
                    empchanremark: [{required: true, message: '请输入调动原因', trigger: 'blur'}],
                    begincontract: [{required: true, message: '请输入合同生效日期', trigger: 'blur'}],
                    endcontract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
                    signdata: [{required: true, message: '请输入签署日期', trigger: 'blur'}],
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
            exportData() {
                this.postRequestExcel("/employee/basic/info/export/",this.multipleSelection).then(resp => {
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
                };
                this.inputDepName = '所属部门';
            },
            emptyEmpChange(){
                this.empchange = {
                    workid: this.currentworkid,
                    afterdepid: "",
                    empchandata: "",
                    empchanremark: ""
                };
                this.inputDepName= "";
            },
            emptyContract(){
                this.contract = {
                    workid: this.currentworkid,
                    begincontract: "",
                    endcontract: "",
                    content: "",
                    signdata: "",
                };
            },
            getMaxWordID() {
                this.getRequest("/employee/basic/info/maxWorkID").then(resp => {
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
                this.NoModify=false;
                this.dialogVisible = true;
                this.$refs['empForm'].resetFields();
            },
            addEmpChange(){
                this.emptyEmpChange();
                this.empChangeDialogForm=true;
                this.$refs['empChangeForm'].resetFields();
            },
            addContract(){
                this.emptyContract();
                this.contracttitle = '添加新合同';
                this.NotShowImage = true;
                this.NotUploadImage = false;
                this.isContractChange = false;
                this.contractDialogForm=true;
                this.$refs['contractForm'].resetFields();
                this.getRequest("/user/token").then(resp => {
                    if (resp) {
                        this.uptoken.token = resp;
                    }
                });
                this.$refs.uploadImage.clearFiles();
            },
            showEditEmpView(data) {
                this.title = '编辑员工信息';
                this.emp = Object.assign({},data);
                this.inputDepName = data.department.depname;
                this.NoModify=false;
                this.dialogVisible = true;
            },
            checkEmpView(data){
                this.title='查看员工信息';
                this.emp = data;
                this.inputDepName = data.department.depname;
                this.NoModify=true;
                this.dialogVisible = true;
            },
            checkContract(data){
                this.contracttitle = '查看合同';
                this.contract=data;
                this.fileList=data.content.split(";");
                this.NotShowImage = false;
                this.NotUploadImage = true;
                this.isContractChange=true;
                this.contractDialogForm=true;
            },
            confirmAddEmpChange(){
                this.$refs['empChangeForm'].validate(valid => {
                    if (valid) {
                        this.postRequest("/employee/basic/change/", this.empchange).then(resp => {
                            if (resp) {
                                this.empChangeDialogForm=false;
                                this.initEmpChange(this.currentworkid);
                            }
                        })
                    }
                });
            },
            confirmAddContract(){
                if (this.contract.contid) {
                    this.contractDialogForm = false;
                    this.isContractChange=false;
                } else if(this.isContractChange == true){
                    this.contractDialogForm=false;
                }
                else {
                    this.$refs['contractForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/employee/basic/contractinfo/", this.contract).then(resp => {
                                if (resp) {
                                    this.contractDialogForm = false;
                                    this.isContractChange=false;
                                    this.initContract(this.currentworkid);
                                }
                            })
                        }
                    });
                }
            },
            deleteEmp(data) {
                this.$confirm('此操作将永久删除【' + data.empname + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employee/basic/info/" + data.workid).then(resp => {
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
                            this.postRequest("/employee/basic/info/", this.emp).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initEmps();
                                    this.standby++;
                                }
                            })
                        }
                    });
                } else if(this.NoModify==true){
                    this.dialogVisible=false;
                }
                else {
                    this.$refs['empForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/employee/basic/info/", this.emp).then(resp => {
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
                    this.postRequest("/employee/basic/info/deleteemps/",this.multipleSelection).then(resp => {
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
            empChangeHandleNodeClick(data){
              this.inputDepName=data.depname;
              this.empchange.afterdepid=data.depid;
              this.empChangePopover=!this.empChangePopover;
            },
            showSearchDepView() {
                this.searchDepView = !this.searchDepView;
            },
            showEmpDepView(){
                this.empDepView=!this.empDepView;
            },
            showEmpChangeView(){
                this.empChangePopover=!this.empChangePopover;
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
                this.initEmps();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initEmps();
            },
            initEmps() {
                this.loading = true;
                let url = '/employee/basic/info/?page=' + this.page + '&size=' + this.size;
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
                        if(resp.data.length===0){
                            this.$notify.error({
                                title: '错误',
                                message: '本页没有数据，请翻页或添加数据！'
                            });
                        }
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
            },
            moreCommand(command){
                switch (command.command) {
                    case "empChange":
                        this.empChangeDrawer=true;
                        this.direction='rtl';
                        this.currentworkid=command.rowdata.workid;
                        this.initEmpChange(this.currentworkid);
                        break;
                    case "contract":
                        this.contractDrawer=true;
                        this.direction='ltr';
                        this.currentworkid=command.rowdata.workid;
                        this.initContract(this.currentworkid);
                        break;
                }
            },
            DrawerClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                        this.initEmps();
                    })
                    .catch(_ => {});
            },
            initEmpChange(data){
                this.empChangeLoading = true;
                let url = '/employee/basic/change/?page=' + this.empchangepage + '&size=' + this.empchangesize+ '&workid=' + data;
                if (this.searchEmpChangeData) {
                    url += "&empchandata=" + this.searchEmpChangeData;
                }
                this.getRequest(url).then(resp => {
                    this.empChangeLoading = false;
                    if (resp) {
                        this.empChanges = resp.data;
                        this.empChangesTotal = resp.total;
                    }
                });
            },
            empChangeSearch(){
                this.initEmpChange(this.currentworkid);
            },
            contractSearch(){
                this.initContract(this.currentworkid);
            },
            empChangeCurrentChange(currentPage){
                this.empchangepage=currentPage;
                this.initEmpChange(this.currentworkid);
            },
            empChangeSizeChange(currentSize){
                this.empchangesize=currentSize;
                this.initEmpChange(this.currentworkid);
            },
            initContract(data){
                this.contractLoading=true;
                let url = '/employee/basic/contractinfo/?page=' + this.contractpage + '&size=' + this.contractsize+ '&workid=' + data;
                if (this.searchContractData) {
                    url += "&signdata=" + this.searchContractData;
                }
                this.getRequest(url).then(resp => {
                    this.contractLoading = false;
                    if (resp) {
                        this.contracts = resp.data;
                        this.contractTotal = resp.total;
                    }
                });
            },
            contractCurrentChange(currentPage){
                this.contractpage=currentPage;
                this.initContract(this.currentworkid);
            },
            contractSizeChange(currentSize){
                this.contractsize=currentSize;
                this.initContract(this.currentworkid);
            },
            beforeImageUpload(file){
                let oldname=file.name;
                let index1=oldname.lastIndexOf(".");
                let index2=oldname.length;
                let type=oldname.substring(index1,index2);
                this.uptoken.key=this.moment().format('YYYY.MM.DD_HH-mm-ss')+ Math.floor(Math.random() * 1000) + type;

                const isJPEG = file.type === "image/jpeg";
                const isPNG = file.type === "image/png";
                const isBMP = file.type === "image/bmp";
                const isJPG = file.type === "image/jpg";
                const isLt10M = file.size / 1024 /1024 < 10;
                if (!isJPG && !isPNG && !isBMP && !isJPEG) {
                    this.$message.error("图片只能是 JPG/JPEG/PNG/BMP 格式!");
                    return false;
                }
                if (!isLt10M) {
                    this.$message.error("图片大小不能超过 10MB!");
                    return false;
                }
            },
            imageChange(file, fileList){
                for(let i=0;i<fileList.length;i++){
                    this.fileList.push(fileList[i].url);
                }
            },
            uploadProcess(event, file, fileList) {
                this.imgFlag = true;
                this.percent = Math.floor(event.percent);
            },
            uploadImageError(err, file, fileList) {
                const error = JSON.parse(JSON.stringify(err));
                this.$message.error(error.status.toString());
                this.imgFlag = false;
                this.percent = 0;
            },
            uploadImageSuccess(response, file, fileList){
                this.imgFlag = false;
                this.percent = 0;
                this.uploadImageLoading=false;
                if(this.contract.content=='')
                    this.contract.content='http://storage.emperorws.club/' + response.key;
                else
                    this.contract.content=this.contract.content+';' + 'http://storage.emperorws.club/' + response.key;
            },
            submitUpload(){
                this.uploadImageLoading=true;
                this.$refs.uploadImage.submit();
            }
            /*customUploadImage(req){
                let oldname=req.file.name;
                let index1=oldname.lastIndexOf(".");
                let index2=oldname.length;
                let type=oldname.substring(index1,index2);
                const formImageDate = new FormData();
                let filename=this.moment().format('YYYY.MM.DD_HH-mm-ss')+ Math.floor(Math.random() * 1000) + type;
                formImageDate.append('file', req.file);
                formImageDate.append('key',filename);
                formImageDate.append('token',this.uptoken.token);
                this.postRequest("http://upload.qiniup.com",formImageDate).then(resp => {
                    if (resp) {
                        if(this.contract.content=='')
                            this.contract.content='http://storage.emperorws.club/' + resp.key;
                        else
                            this.contract.content=this.contract.content+';' + 'http://storage.emperorws.club/' + resp.key;
                    }
                })
            }*/
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
    /deep/ .more-emp-menus {
        cursor: pointer;
        color: #409EFF;
    }
    /deep/ .emp-change-expand {
        font-size: 0;
    }
    /deep/ .emp-change-expand label {
        width: 80px;
        color: #99a9bf;
    }
    /deep/ .emp-change-expand .el-form-item{
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
    /deep/ .emp-change-expand .el-form-item span{
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
        white-space: normal;
        word-break: break-all;
    }
    /deep/ .el-drawer{
        overflow: scroll;
    }
    .imageShow{
        list-style: none;
        float: left;
        margin: 3px;
    }
</style>