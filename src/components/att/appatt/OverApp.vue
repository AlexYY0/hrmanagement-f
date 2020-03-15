<template>
    <div style="width: 100%">
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
                        <el-col :span="24">
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
        name: "OverApp",
        data(){
            return{
                page: 1,
                size: 10,
                total: 0,
                appatts: [],
                appattLoading: false,
                editAppattDialog: false,
                multipleSelection: [],
                category: ['请假','调休','出差','加班'],
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
        },
        methods: {
            initAppatts(){
                this.appattLoading=true;
                this.getRequest('/attendance/transactionapp/overappatt/?page=' + this.page + '&size=' + this.size).then(resp => {
                    this.appattLoading = false;
                    if (resp) {
                        this.appatts = resp.data;
                        this.total = resp.total;
                        if(resp.data.length===0){
                            this.$notify.error({
                                title: '错误',
                                message: '已完成中没有数据，请翻页或添加数据！'
                            });
                        }
                    }
                });
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
            }
        }
    }
</script>

<style scoped>

</style>