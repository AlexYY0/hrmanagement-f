<template>
    <div
            v-loading="globalLoading"
            element-loading-text="正在添加..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="permissManaTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.enname">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名" v-model="role.zhname"
                      @keydown.enter.native="doAddRole"></el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
        </div>
        <div class="permissManaMain">
            <el-collapse v-model="activeName"
                         v-loading="loading"
                         element-loading-text="正在加载..."
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)"
                         accordion
                         @change="change">
                <el-collapse-item :title="r.zhname" :name="r.roleid" v-for="(r,index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: #ff0000;"
                                       icon="el-icon-delete" type="text" @click="deleteRole(r)">
                            </el-button>
                        </div>
                        <div>
                            <el-tree
                                    show-checkbox
                                    node-key="pid"
                                    ref="tree"
                                    :key="index"
                                    :default-checked-keys="selectedPermissions"
                                    :data="allpermissions" :props="defaultProps"></el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button @click="cancelUpdate">取消修改</el-button>
                                <el-button type="primary" @click="doUpdate(r.roleid,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
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
    </div>
</template>

<script>
    export default {
        name: "SysRolep",
        data() {
            return {
                role: {
                    enname: '',
                    zhname: ''
                },
                allpermissions: [],
                selectedPermissions: [],
                activeName: -1,
                roles: [],
                page: 1,
                size: 10,
                total: 0,
                loading: false,
                globalLoading: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            deleteRole(role) {
                this.$confirm('此操作将永久删除【' + role.zhname + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.globalLoading = true;
                    this.deleteRequest("/system/rolepermission/role/" + role.roleid).then(resp => {
                        this.globalLoading = false;
                        if (resp) {
                            this.page=1;
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddRole() {
                if (this.role.enname && this.role.zhname) {
                    this.globalLoading = true;
                    this.postRequest("/system/rolepermission/role", this.role).then(resp => {
                        this.globalLoading = false;
                        if (resp) {
                            this.role.enname = '';
                            this.role.zhname = '';
                            this.initRoles();
                        }
                    })
                } else {
                    this.$message.error('数据不可以为空');
                }
            },
            cancelUpdate() {
                this.activeName = -1;
            },
            doUpdate(roleid, index) {
                let tree = this.$refs.tree[index];
                let selectedKeys = tree.getCheckedKeys(true);
                let url = '/system/rolepermission/?roleid=' + roleid;
                selectedKeys.forEach(key => {
                    url += '&pids=' + key;
                });
                this.putRequest(url).then(resp => {
                    if (resp) {
                        this.activeName = -1;
                    }
                })
            },
            change(roleid) {
                if (roleid) {
                    this.initAllPermissions();
                    this.initSelectedPermissions(roleid);
                }
            },
            initSelectedPermissions(roleid) {
                this.getRequest("/system/rolepermission/pids/" + roleid).then(resp => {
                    if (resp) {
                        this.selectedPermissions = resp;
                    }
                })
            },
            initAllPermissions() {
                this.getRequest("/system/rolepermission/permissions").then(resp => {
                    if (resp) {
                        this.allpermissions = resp;
                    }
                })
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initRoles();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initRoles();
            },
            initRoles() {
                this.loading = true;
                let url='/system/rolepermission/?page=' + this.page + '&size=' + this.size;
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.roles = resp.data;
                        this.total=resp.total;
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .permissManaTool {
        display: flex;
        justify-content: flex-start;
    }

    .permissManaTool .el-input {
        width: 300px;
        margin-right: 6px;
    }

    .permissManaMain {
        margin-top: 10px;
        width: 700px;
    }
</style>