/**
 * Created by hangweiping on 2017/7/14.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import ticketSysModule from './modules/ticketSysModule'
import calendarCard from './modules/calendarCard'
import VueClipboards from 'vue-clipboards'
Vue.use(Vuex)
Vue.use(VueClipboards)
export default new Vuex.Store({
  modules: {
    ticketSysModule,
    calendarCard
  }
})
