<template>
    <div>
        <div style="margin-top: 10px;display: flex;justify-content: center">
            <el-input v-model="keywords" placeholder="通过员工姓名搜索用户..." prefix-icon="el-icon-search"
                      style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"></el-input>
            <el-button style="margin-right: 10px" icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
            <el-button type="text" @click="addUser"><i class="fas fa-user-plus fa-lg"></i></el-button>
        </div>
        <div class="user-container">
            <el-card class="user-card" v-for="(user,index) in users" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{user.employee.empname}}</span>
                    <el-button style="float: right; padding: 3px 0;color: #e30007;" type="text"
                               icon="el-icon-delete" @click="deleteUser(user)"></el-button>
                </div>
                <div>
                    <div class="img-container">
                        <img :src="user.userface" :alt="user.employee.empname" :title="user.employee.empname" class="userface-img">
                    </div>
                    <div class="userinfo-container">
                        <div>用户工号：{{user.workid}}</div>
                        <div>系统账户：{{user.username}}</div>
                        <div>重置密码：<el-button style="color: black" type="text" @click="resetpw(user)"><i class="fas fa-sync-alt"></i></el-button></div>
                        <div>用户状态：
                            <el-switch
                                    v-model="user.enabled"
                                    active-text="启用"
                                    @change="enabledChange(user)"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    inactive-text="禁用">
                            </el-switch>
                        </div>
                        <div>用户角色：
                            <el-tag type="success" style="margin-right: 4px" v-for="(role,indexj) in user.roles"
                                    :key="indexj">{{role.zhname}}
                            </el-tag>
                            <el-popover
                                    placement="right"
                                    title="角色列表"
                                    @show="showPop(user)"
                                    @hide="hidePop(user)"
                                    width="200"
                                    trigger="click">
                                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                    <el-option
                                            v-for="(r,indexk) in allroles"
                                            :key="indexk"
                                            :label="r.zhname"
                                            :value="r.roleid">
                                    </el-option>
                                </el-select>
                                <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                            </el-popover>
                        </div>
                        <div>备注：{{user.userremark}}</div>
                    </div>
                </div>
            </el-card>
        </div>
        <div style="display: flex;justify-content: flex-end">
            <el-pagination
                    background
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    :page-sizes="[8, 24, 56, 80]"
                    layout="sizes, prev, pager, next, jumper, ->, total, slot"
                    :total="total">
            </el-pagination>
        </div>
        <el-dialog
            title="添加账户"
            :visible.sync="addUserDialogForm"
            width="30%">
            <el-form :model="user" status-icon :rules="rules" ref="userForm">
                <el-form-item label="员工工号: " prop="workid">
                    <el-autocomplete
                            clearable
                            style="width: 250px"
                            popper-class="findAllEmp-autocomplete"
                            :popper-append-to-body="false"
                            v-model="user.workid"
                            :fetch-suggestions="querySearch"
                            placeholder="输入员工姓名自动查找"
                            @select="handleSelect">
                        <i class="el-icon-edit el-input__icon" slot="prefix" @click="handleIconClick"></i>
                        <template slot-scope="{ item }">
                            <div class="empname">{{ item.value }}</div>
                            <span class="workid">工号: {{ item.workid }}</span>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="员工账号: " prop="username">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model="user.username"
                              placeholder="请输入员工账号">
                    </el-input>
                </el-form-item>
                <el-form-item label="账户密码: " prop="password">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-key" type="password" v-model="user.password" auto-complete="off"
                              show-password placeholder="请输入密码">
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码: " prop="checkPassword">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-key" type="password" v-model="user.checkPassword" autocomplete="off"
                              show-password placeholder="请再次输入密码">
                    </el-input>
                </el-form-item>
                <el-form-item label="账户状态: " prop="enabled">
                    <el-switch
                            v-model="user.enabled"
                            active-text="启用"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            inactive-text="禁用">
                    </el-switch>
                </el-form-item>
                <el-form-item label="账户备注: " prop="userremark">
                    <el-input
                            style="width: 100%"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 7}"
                            placeholder="请输入内容"
                            v-model="user.userremark"
                            minlength="10"
                            maxlength="255"
                            show-word-limit>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserDialogForm = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddUser">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SysUserrole",
        data() {
            let validWorkid = (rule, value, callback) => {
                this.getRequest("/system/userrole/find?workid=" + value).then(resp => {
                    if (resp) {
                        callback(new Error('该用户已拥有账号!'));
                    } else
                        callback();
                })
            };
            let validUsername = (rule, value, callback) => {
                this.getRequest("/system/userrole/find/" + value).then(resp => {
                    if (resp) {
                        callback(new Error('用户名已存在!'));
                    } else
                        callback();
                })
            };
            let validPassword = (rule, value, callback) => {
                if (this.user.password !== '') {
                    this.$refs.userForm.validateField('checkPassword');
                }
                callback();
            };
            let validCheckpassword = (rule, value, callback) => {
                if (value !== this.user.password)
                    callback(new Error('两次输入密码不一致!'));
                else
                    callback();
            };
            return {
                keywords: null,
                page: 1,
                size: 8,
                total: 0,
                users: [],
                selectedRoles: [],
                allroles: [],
                addUserDialogForm: false,
                employees: [],
                user: {
                    workid: "1",
                    username: "test",
                    password: "123456789",
                    checkPassword: "1234567890",
                    userface: "http://bpic.588ku.com/element_pic/01/40/00/64573ce2edc0728.jpg",
                    enabled: 1,
                    userremark: "test"
                },
                rules: {
                    workid: [{required: true, message: '请输入工号', trigger: 'blur'},{
                        validator: validWorkid, trigger: 'blur'
                    }],
                    username: [{required: true, message: '请输入账户名', trigger: 'blur'},{
                        validator: validUsername, trigger: 'blur'
                    }],
                    password: [{required: true, message: '请输入账户密码', trigger: 'blur'},{
                        validator: validPassword, trigger: 'blur'
                    }],
                    checkPassword: [{required: true, message: '请再次输入账户密码', trigger: 'blur'},{
                        validator: validCheckpassword, trigger: 'blur'
                    }],
                    enabled: [{required: true, message: '请选择账户状态', trigger: 'change'}],
                    userremark: [{required: true, message: '请输入账户备注', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.initUsers();
        },
        methods: {
            emptyUser(){
                this.user = {
                    workid: "",
                    username: "",
                    password: "",
                    checkPassword: "",
                    userface: "http://bpic.588ku.com/element_pic/01/40/00/64573ce2edc0728.jpg",
                    enabled: 0,
                    userremark: ""
                }
            },
            addUser(){
                this.emptyUser();
                this.getAllemployees();
                this.addUserDialogForm=true;
            },
            confirmAddUser(){
                this.$refs['userForm'].validate(valid => {
                    if (valid) {
                        this.postRequest("/system/userrole/user/", this.user).then(resp => {
                            if (resp) {
                                this.addUserDialogForm=false;
                                this.initUsers();
                            }
                        })
                    }
                });
            },
            deleteUser(user) {
                this.$confirm('此操作将永久删除【'+user.employee.empname+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/userrole/"+user.userid).then(resp=>{
                        if (resp) {
                            this.initUsers();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doSearch() {
                this.initUsers();
            },
            hidePop(user) {
                let roles = [];
                Object.assign(roles, user.roles);
                let flag = false;
                if (roles.length != this.selectedRoles.length) {
                    flag = true;
                } else {
                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.selectedRoles.length; j++) {
                            let sr = this.selectedRoles[j];
                            if (role.roleid == sr) {
                                roles.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    if (roles.length != 0) {
                        flag = true;
                    }
                }
                if (flag) {
                    let url = '/system/userrole/role?userid=' + user.userid;
                    this.selectedRoles.forEach(sr => {
                        url += '&roleids=' + sr;
                    });
                    this.putRequest(url).then(resp => {
                        if (resp) {
                            this.initUsers();
                        }
                    });
                }
            },
            showPop(user) {
                this.initAllRoles();
                let roles = user.roles;
                this.selectedRoles = [];
                roles.forEach(r => {
                    this.selectedRoles.push(r.roleid);
                })
            },
            resetpw(user){
                user.password="$2a$10$ySG2lkvjFHY5O0./CPIE1OI8VJsuKYEzOYzqIa7AJR6sEgSzUFOAm";
                this.putRequest("/system/userrole/", user).then(resp => {
                    if (resp) {
                        this.initUsers();
                    }
                })
            },
            enabledChange(user) {
                delete user.roles;
                this.putRequest("/system/userrole/", user).then(resp => {
                    if (resp) {
                        this.initUsers();
                    }
                })
            },
            initAllRoles() {
                this.getRequest("/system/userrole/roles").then(resp => {
                    if (resp) {
                        this.allroles = resp;
                    }
                })
            },
            initUsers() {
                let url="/system/userrole/?page=" + this.page + '&size=' + this.size;
                if(this.keywords){
                    url+="&keywords="+this.keywords;
                }
                this.getRequest(url).then(resp => {
                    if (resp) {
                        this.users = resp.data;
                        this.total = resp.total;
                        if(resp.data.length===0){
                            this.$notify.error({
                                title: '错误',
                                message: '本页没有数据，请翻页或添加数据！'
                            });
                        }
                    }
                })
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initUsers();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initUsers();
            },
            //以下是实时搜索
            querySearch(queryString, cb) {
                let employees = this.employees;
                let results = queryString ? employees.filter(this.createFilter(queryString)) : employees;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (employee) => {
                    return (employee.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            getAllemployees(){
                this.getRequest("/organization/management/employee/").then(resp => {
                    if (resp) {
                        this.employees = resp;
                    }
                })
            },
            handleSelect(item) {
                this.user.workid=item.workid;
            },
            handleIconClick(ev) {
                console.log(ev);
            }
        }
    }
</script>

<style scoped>
    .userinfo-container div {
        font-size: 12px;
        color: #409eff;
    }
    .userinfo-container {
        margin-top: 20px;
    }
    .img-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .userface-img {
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }
    .user-container {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .user-card {
        width: 300px;
        margin-bottom: 20px;
    }
    /deep/ .findAllEmp-autocomplete li{
        line-height: normal;
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