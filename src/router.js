import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import UserInfo from './views/UserInfo.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login,
            hidden:true
        }, {
            path: '/home',
            name: 'Home',
            component: Home,
            hidden:true,
            meta:{
                roles:['admin','user']
            },
            children:[
                {
                    path: '/userinfo',
                    name: '个人中心',
                    component: UserInfo,
                    hidden:true
                }
            ]
        }
    ]
})