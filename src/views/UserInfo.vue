<template>
    <div v-if="user" class="user-info">
        <el-card class="user-card">
            <div slot="header" class="clearfix">
                <span>{{user.username}}</span>
            </div>
            <div>
                <div class="img-container">
                    <el-upload
                            :show-file-list="false"
                            ref="uploadImage"
                            action="http://upload.qiniup.com"
                            :before-upload="beforeImageUpload"
                            :on-success="uploadImageSuccess"
                            :on-error="uploadImageError"
                            :data="uptoken">
                        <img title="点击修改用户图像" :src="user.userface" class="userface-img" alt="图片服务器崩溃了">
                    </el-upload>
                </div>
                <div class="userinfo-container">
                    <div>用户工号：<el-tag>{{user.workid}}</el-tag></div>
                    <div>系统账户：<el-tag>{{user.username}}</el-tag></div>
                    <div>用户标签：
                        <el-tag type="success" style="margin-right: 5px" v-for="(r,index) in user.roles" :key="index">
                            {{r.zhname}}
                        </el-tag>
                    </div>
                    <div>备注：<el-tag class="remark">{{user.userremark}}</el-tag></div>
                    <div style="display: flex;justify-content: space-around;margin-top: 10px">
                        <el-button type="primary" @click="showUpdateUserInfoView">修改信息</el-button>
                        <el-button type="danger" @click="showUpdatePasswordView">修改密码</el-button>
                    </div>
                </div>
            </div>
        </el-card>
        <el-dialog
                title="修改用户信息"
                :visible.sync="userInfoDialog"
                width="30%">
            <el-form :model="user2" status-icon :rules="rules" ref="userForm">
                <el-form-item label="员工工号: " prop="workid">
                    <el-input disabled size="mini" style="width: 250px" prefix-icon="el-icon-edit" v-model="user2.workid"></el-input>
                </el-form-item>
                <el-form-item label="系统账号: " prop="username">
                    <el-input clearable style="width: 250px" prefix-icon="el-icon-edit" v-model="user2.username"
                              placeholder="请输入系统账号">
                    </el-input>
                </el-form-item>
                <el-form-item label="账户备注: " prop="userremark">
                    <el-input
                            clearable
                            style="width: 100%"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 7}"
                            placeholder="请输入内容"
                            v-model="user2.userremark"
                            minlength="10"
                            maxlength="255"
                            show-word-limit>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userInfoDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改密码"
                :visible.sync="passwordDialog"
                width="30%">
            <div>
                <el-form :model="passwordForm" status-icon :rules="rules" ref="passwordForm" label-position="left" label-width="85px"
                         class="demo-ruleForm">
                    <el-form-item label="旧密码: " prop="oldpassword">
                        <el-input clearable type="password" prefix-icon="el-icon-key" v-model="passwordForm.oldpassword" placeholder="请输入旧密码" show-password autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码: " prop="password">
                        <el-input clearable type="password" prefix-icon="el-icon-key" v-model="passwordForm.password" placeholder="请输入新密码" show-password autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码: " prop="checkPassword">
                        <el-input clearable type="password" prefix-icon="el-icon-key" v-model="passwordForm.checkPassword" placeholder="请再次输入新密码" show-password autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePassword">提交修改</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "UserInfo",
        data(){
            let validUsername = (rule, value, callback) => {
                this.getRequest("/user/check/username/" + value).then(resp => {
                    if (resp) {
                        callback(new Error('用户名已存在!'));
                    } else
                        callback();
                })
            };
            let validOldPassword = (rule, value, callback) => {
                let url="/user/check/password/?password=" + value + "&userid=" + this.user2.userid;
                this.getRequest(url).then(resp => {
                    if (resp) {
                        callback();
                    } else
                        callback(new Error('原密码错误!'));
                })
            };
            let validPassword = (rule, value, callback) => {
                if (this.passwordForm.password !== '') {
                    this.$refs.passwordForm.validateField('checkPassword');
                }
                callback();
            };
            let validCheckpassword = (rule, value, callback) => {
                if (value !== this.passwordForm.password)
                    callback(new Error('两次输入密码不一致!'));
                else
                    callback();
            };
            return {
                passwordForm: {
                    oldpassword: '',
                    password: '',
                    checkPassword: ''
                },
                user: null,
                user2: null,
                userInfoDialog: false,
                passwordDialog: false,
                uptoken: {
                    token: '',
                    key: ''
                },
                rules: {
                    workid: [{required: true, message: '请输入员工工号', trigger: 'blur'}],
                    username: [{required: true, message: '请输入账户名', trigger: 'blur'},{
                        validator: validUsername, trigger: 'blur'
                    }],
                    oldpassword: [{required: true, message: '请输入账户原密码', trigger: 'blur'},{
                        validator: validOldPassword, trigger: 'blur'
                    }],
                    password: [{required: true, message: '请输入账户密码', trigger: 'blur'},{
                        validator: validPassword, trigger: 'blur'
                    }],
                    checkPassword: [{required: true, message: '请再次输入账户密码', trigger: 'blur'},{
                        validator: validCheckpassword, trigger: 'blur'
                    }],
                    userremark: [{required: true, message: '请输入账户备注', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.initUser();
            this.getToken();
        },
        methods: {
            initUser(){
                this.getRequest('/user/info').then(resp =>{
                    if(resp){
                        this.user=resp;
                        this.user2=Object.assign({},this.user)
                        window.sessionStorage.setItem("user", JSON.stringify(resp));
                        this.$store.commit('INIT_CURRENTHR', resp);
                    }
                })
            },
            getToken(){
                this.getRequest("/user/token").then(resp => {
                    if (resp) {
                        this.uptoken.token = resp;
                    }
                });
            },
            showUpdateUserInfoView() {
                this.userInfoDialog = true;
            },
            showUpdatePasswordView() {
                this.passwordDialog = true;
            },
            resetForm() {
                this.$refs['passwordForm'].resetFields();
            },
            updateUserInfo() {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        this.putRequest("/user/info", this.user2).then(resp => {
                            if (resp) {
                                this.userInfoDialog = false;
                                this.initUser();
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            updatePassword(){
                this.$refs['passwordForm'].validate((valid) => {
                    if (valid) {
                        this.passwordForm.userid = this.user.userid;
                        this.putRequest("/user/password", this.passwordForm).then(resp => {
                            if (resp) {
                                this.getRequest("/logout");
                                window.sessionStorage.removeItem("user")
                                this.$store.commit('initRoutes', []);
                                this.$router.replace("/");
                            }
                        })
                    } else {
                        return false;
                    }
                });
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
            uploadImageError(err) {
                const error = JSON.parse(JSON.stringify(err));
                this.$message.error(error.status.toString());
            },
            uploadImageSuccess(response){
                this.imgFlag = false;
                this.percent = 0;
                this.user2.userface='http://storage.emperorws.club/' + response.key;
                this.putRequest("/user/info", this.user2).then(resp => {
                    if (resp) {
                        this.initUser();
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .user-info{
        display: flex;
        justify-content: center;
    }
    .userinfo-container {
        margin-top: 20px;
    }
    .userinfo-container .remark{
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
        white-space: normal;
        word-break: break-all;
    }
    .user-card {
        width: 400px;
        margin: 10px 0 0 10px;
    }
    .img-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .userface-img {
        object-fit: cover;
        width: 102px;
        height: 102px;
        border-radius: 102px;
    }
</style>