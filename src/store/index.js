import Vue from 'vue'
import Vuex from 'vuex'
import '../utils/stomp'
import '../utils/sockjs'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},
        hrs: [],
        currentSession: null,
        currentHr: JSON.parse(window.sessionStorage.getItem("user")),
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    mutations: {
        INIT_CURRENTHR(state, hr) {
            state.currentHr = hr;
        },
        initRoutes(state, data) {
            state.routes = data;
        },
        changeCurrentSession(state, currentSession) {
            Vue.set(state.isDot, state.currentHr.username + '#' + currentSession.username, false);
            state.currentSession = currentSession;
        },
        INIT_HR(state, data) {
            state.hrs = data;
        }
    },
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;