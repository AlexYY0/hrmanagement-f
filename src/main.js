import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import moment from "moment";

import { Pie } from "@antv/g2plot";
import { Radar  } from '@antv/g2plot';
import { Bar } from '@antv/g2plot';
import { Area } from '@antv/g2plot';

import {postRequestExcel} from "./utils/api";
import {postRequest} from "./utils/api";
import {postKeyValueRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {initMenu} from "./utils/menus";
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/brands.css';

Vue.prototype.postRequestExcel=postRequestExcel;
Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

Vue.prototype.moment = moment;
Vue.prototype.Pie = Pie;
Vue.prototype.Radar = Radar ;
Vue.prototype.Bar = Bar;
Vue.prototype.Area = Area;

Vue.config.productionTip = false;

Vue.use(ElementUI,{size:'small'});

router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    next();
  }else {
    if (window.sessionStorage.getItem("user")) {
      initMenu(router, store);
      next();
    }else{
      next('/?redirect='+to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
