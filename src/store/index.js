import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX)

export default new VueX.Store({
    state: {
        ui: {
            header: true,
            aside: true,
            view:true,
            catch:true,
        },
        search: {
            keys: '',
            placeholder: ''
        },
        menu:0,
        view: $$.catch.local('view-type')||2,
        filter: $$.catch.local('curr-filter-type')||{
            value: 0,
            title: '全部文件'
        },
        user: $$.catch.session('curr-login-user'),
    }
})