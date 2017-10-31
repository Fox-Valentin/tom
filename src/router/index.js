import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
// import Hello from '@/components/Hello.vue'
import showChannelAdmin from '@/components/pages/adminChannel/showChannelAdmin.vue'
import addChanelAdmin from '@/components/pages/adminChannel/addChanelAdmin.vue'
import showRetailerCharge from '@/components/pages/adminChannel/showRetailerCharge.vue'
import showRetailerCash from '@/components/pages/adminChannel/showRetailerCash.vue'
import showRetailerFund from '@/components/pages/adminChannel/showRetailerFund.vue'
import showRetailerCashRecord from '@/components/pages/adminChannel/showRetailerCashRecord.vue'
import showDisTickets from '@/components/pages/adminChannel/showDisTickets.vue'
import showChannelControll from '@/components/pages/controllChannel/showChannelControll.vue'
import showChannelControllDetail from '@/components/pages/controllChannel/showChannelControllDetail.vue'
import setChannelStockPrice from '@/components/pages/controllChannel/setChannelStockPrice.vue'
import ticket from '@/components/pages/controllChannel/ticket.vue'
import ticketAdd from '@/components/pages/controllChannel/ticketsSys/index.vue'
import showTicketDiss from '@/components/pages/controllChannel/showTicketDiss.vue'
import Login from '@/components/pages/login.vue'
import order from '@/components/pages/order/order.vue'
import showRetailerStatements from '@/components/pages/adminChannel/showRetailerStatements'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      name: '渠道管理',
      iconCls: 'el-icon-message', // 图标样式class
      children: [
        { path: '/showChannelAdmin', component: showChannelAdmin, name: '分销商管理', privilege: 'dp.dis' },
        { path: '/addChanelAdmin', component: addChanelAdmin, name: '增加分销商', hidden: true },
        { path: '/showRetailerCharge', component: showRetailerCharge, name: '分销商充值', hidden: true },
        { path: '/showRetailerCash', component: showRetailerCash, name: '分销商提现', hidden: true },
        { path: '/showRetailerFund', component: showRetailerFund, name: '分销商账户', hidden: true },
        { path: '/showRetailerCashRecord', component: showRetailerCashRecord, name: '分销商消费记录', hidden: true },
        { path: '/showDisTickets', component: showDisTickets, name: '分销门票', hidden: true },
        { path: '/showRetailerStatements', component: showRetailerStatements, name: '流水记录', hidden: true }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '产品管理',
      iconCls: 'el-icon-menu',
      children: [
        { path: '/showChannelControll', component: showChannelControll, name: '渠道管控', hidden: true },
        { path: '/ticket', component: ticket, name: '门票列表', privilege: 'dp.ticket' },
        { path: '/scenic', component: showChannelControll, name: 'POI列表' },
        { path: '/showTicketDiss', component: showTicketDiss, name: '门票分销商管理', hidden: true },
        {
          path: '/ticketAdd',
          component: ticketAdd,
          name: '添加产品',
          hidden: true
        },
        { path: '/showChannelControllDetail', component: showChannelControllDetail, name: '管控详情', hidden: true },
        { path: '/setChannelStockPrice', component: setChannelStockPrice, name: '库存管控', hidden: true }
      ]
    },
    { path: '/login', component: Login, hidden: true },
    {
      path: '/',
      component: Home,
      name: '订单管理',
      iconCls: 'el-icon-menu',
      children: [
        { path: '/order', component: order, name: '退单处理' }
      ]
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    }
  ]
})
