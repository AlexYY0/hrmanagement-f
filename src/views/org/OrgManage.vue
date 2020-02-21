<template>
    <div style="width: 500px;">
        <el-input
                placeholder="请输入部门名称进行搜索..."
                prefix-icon="el-icon-search"
                v-model="filterText">
        </el-input>

        <div class="organization-tree">
            <el-tree
                    :data="deps"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    ref="tree">
                <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%;"
                      slot-scope="{ node, data }">
                    <span>{{data.depname }}(领导: {{data.leadername}})</span>
                    <span>
                        <el-button
                                type="info"
                                size="mini"
                                class="depBtn"
                                @click="() => showUpdateDepView(data)">
                        修改
                        </el-button>
                        <el-button
                              type="primary"
                              size="mini"
                              class="depBtn"
                              @click="() => showAddDepView(data)">
                        添加
                        </el-button>

                        <el-button
                              type="danger"
                              size="mini"
                              class="depBtn"
                              @click="() => deleteDep(data)">
                            删除
                        </el-button>
                    </span>
                </span>
            </el-tree>
            <el-dialog
                    title="修改部门"
                    :visible.sync="updateDialogVisible"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td>
                                <el-tag>部门名称</el-tag>
                            </td>
                            <td>
                                <el-input v-model="dep.depname" placeholder="请输入部门名称..."></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag>领导工号</el-tag>
                            </td>
                            <td>
                                <el-autocomplete
                                        popper-class="findAllEmp-autocomplete"
                                        :popper-append-to-body="false"
                                        v-model="dep.leaderid"
                                        :fetch-suggestions="querySearch"
                                        placeholder="输入领导姓名自动查找"
                                        @select="handleSelect">
                                    <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                    </i>
                                    <template slot-scope="{ item }">
                                        <div class="empname">{{ item.value }}</div>
                                        <span class="workid">工号: {{ item.workid }}</span>
                                    </template>
                                </el-autocomplete>
                            </td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doUpdateDep">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                    title="添加部门"
                    :visible.sync="addDialogVisible"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td>
                                <el-tag>上级部门</el-tag>
                            </td>
                            <td>{{pname}}</td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag>部门名称</el-tag>
                            </td>
                            <td>
                                <el-input v-model="dep.depname" placeholder="请输入部门名称..."></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag>领导工号</el-tag>
                            </td>
                            <td>
                                <el-autocomplete
                                        popper-class="findAllEmp-autocomplete"
                                        :popper-append-to-body="false"
                                        v-model="dep.leaderid"
                                        :fetch-suggestions="querySearch"
                                        placeholder="输入领导姓名自动查找"
                                        @select="handleSelect">
                                    <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                    </i>
                                    <template slot-scope="{ item }">
                                        <div class="empname">{{ item.value }}</div>
                                        <span class="workid">工号: {{ item.workid }}</span>
                                    </template>
                                </el-autocomplete>
                            </td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doAddDep">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OrgManage",
        data() {
            return {
                addDialogVisible: false,
                updateDialogVisible:false,
                filterText: '',
                dep: {
                    depname: '',
                    parentid: -1
                },
                pname: '',
                deps: [],
                defaultProps: {
                    children: 'children',
                    label: 'depname'
                },
                employees: [],
                state: ''
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted() {
            this.initDeps();
            this.getAllemployees();
        },
        methods: {
            initDep() {
                this.dep = {
                    depname: '',
                    parentid: -1
                }
                this.pname = '';
            },
            updateDep2Deps(deps, dep){
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.depid == dep.depid) {
                        d.leadername=dep.leadername;
                        return;
                    } else {
                        this.updateDep2Deps(d.children, dep);
                    }
                }
            },
            doUpdateDep(){
                this.putRequest("/organization/management/update/", this.dep).then(resp => {
                    if (resp) {
                        this.updateDep2Deps(this.deps, resp.obj);
                        this.updateDialogVisible = false;
                        //初始化变量
                        this.initDep();
                    }
                })
            },
            addDep2Deps(deps, dep) {
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.depid == dep.parentid) {
                        d.children = d.children.concat(dep);
                        if (d.children.length > 0) {
                            d.parent = true;
                        }
                        return;
                    } else {
                        this.addDep2Deps(d.children, dep);
                    }
                }
            },
            doAddDep() {
                this.postRequest("/organization/management/", this.dep).then(resp => {
                    if (resp) {
                        this.addDep2Deps(this.deps, resp.obj);
                        this.addDialogVisible = false;
                        //初始化变量
                        this.initDep();
                    }
                })
            },
            removeDepFromDeps(p,deps, depid) {
                for(let i=0;i<deps.length;i++){
                    let d = deps[i];
                    if (d.depid == depid) {
                        deps.splice(i, 1);
                        if (deps.length == 0) {
                            p.parent = false;
                        }
                        return;
                    }else{
                        this.removeDepFromDeps(d,d.children, depid);
                    }
                }
            },
            deleteDep(data) {
                if (data.parent) {
                    this.$message.error("父部门删除失败");
                } else {
                    this.$confirm('此操作将永久删除【' + data.depname + '】部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/organization/management/"+data.depid).then(resp=>{
                            if (resp) {
                                this.removeDepFromDeps(null,this.deps,data.depid);
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            showUpdateDepView(data){
                this.dep.depid=data.depid;
                this.dep.depname=data.depname;
                this.dep.parentid=data.parentid;
                this.updateDialogVisible = true;
            },
            showAddDepView(data) {
                this.pname = data.depname;
                this.dep.parentid = data.depid;
                this.addDialogVisible = true;
            },
            initDeps() {
                this.getRequest("/organization/management/").then(resp => {
                    if (resp) {
                        this.deps = resp;
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.depname.indexOf(value) !== -1;
            },
            //以下是实时搜索
            querySearch(queryString, cb) {
                var employees = this.employees;
                var results = queryString ? employees.filter(this.createFilter(queryString)) : employees;
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
                this.dep.leaderid=item.workid;
                console.log(item);
            },
            handleIconClick(ev) {
                console.log(ev);
            }
        }
    }
</script>

<style scoped>
    .organization-tree{
        margin-top: 7px;
    }
    .depBtn {
        padding: 2px;
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