<template>
    <div class="activePublic ">
          <el-tabs  @tab-click="handleClick" :activeName="activeName">
            <el-tab-pane label="基本信息" name="first">
              <el-row>
                <el-col :span="12">
                  <template v-if="activeName === 'first'">
                    <v-ticketStep1 @changeTab="changeTab" @changeStatus="changeStatus" ></v-ticketStep1>
                  </template>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="购买须知" name="second" :disabled="isDisabled || !can('dp.ticket.buyNote')">
              <template v-if="activeName === 'second'">
                <v-ticketStep2 @changeTab="changeTab"></v-ticketStep2>
              </template>
            </el-tab-pane>
            <el-tab-pane label="退改规则" name="third" :disabled="isDisabled || !can('dp.ticket.refundRule')">
              <template v-if="activeName === 'third'">
                <v-ticketStep3 @changeTab="changeTab"></v-ticketStep3>
              </template>
            </el-tab-pane>
            <el-tab-pane label="基本风控" name="fourth" :disabled="isDisabled || !can('dp.ticket.riskControl')">
              <template v-if="activeName === 'fourth'">
                <v-ticketStep4 @changeTab="changeTab"></v-ticketStep4>
              </template>
            </el-tab-pane>
            <el-tab-pane label="游客信息" name="fifth" :disabled="isDisabled || !can('dp.ticket.riskControl')">
              <template v-if="activeName === 'fifth'">
                <v-ticketStep5 @changeTab="changeTab"></v-ticketStep5>
              </template>
            </el-tab-pane>
            <el-tab-pane label="库存价格" name="sixth" :disabled="isDisabled || !can('dp.ticket.visitorInfoRule')">
              <template v-if="activeName === 'sixth'">
                <v-ticketStep6 @changeTab="changeTab"></v-ticketStep6>
              </template>
            </el-tab-pane>
            <el-tab-pane label="其他" name="seventh" :disabled="isDisabled">
              <template v-if="activeName === 'seventh'">
                <v-ticketStep7 @changeTab="changeTab"></v-ticketStep7>
              </template>
            </el-tab-pane>
            <el-tab-pane label="单票价格" name="eighth" :disabled="isDisabled || isGroupTicket">
              <template v-if="activeName === 'eighth'">
                <v-ticketStep8 @changeTab="changeTab"></v-ticketStep8>
              </template>
            </el-tab-pane>
          </el-tabs>
    </div>
</template>

<script>
  //  import { getTicketById } from '@/api/api'
   import ls from '@/common/localStorage.js'
   export default {
     components: {
       vTicketStep1: require('./step1'),
       vTicketStep2: require('./step2'),
       vTicketStep3: require('./step3'),
       vTicketStep4: require('./step4'),
       vTicketStep5: require('./step5'),
       vTicketStep6: require('./step6'),
       vTicketStep7: require('./step7'),
       vTicketStep8: require('./step8')
     },
     name: 'ticketStep1',
     data: function () {
       return {
         preview: true,
         preStep: false,
         nextStep: true,
         publish: false,
         activeName: 'first',
         isDisabled: true
       }
     },
     computed: {
       isGroupTicket () {
         return !(this.$store.getters.getTicketType === '2')
       }
     },
     methods: {
       handleClick (tab, event) {
         this.activeName = tab.name
         this.$store.commit('updateActiveKey', tab.index)
         ls.setItem('ticketActiveKey', tab.index)
         ls.setItem('ticketActiveName', this.activeName)
       },
       changeTab (activeName) {
         this.activeName = activeName
         ls.setItem('ticketActiveName', activeName)
       },
       changeStatus (status) {
         this.isDisabled = status
       },
       handleGet () {
        //  if (this.$route.query.ticket_id) {
        //    this.$store.commit('updateProductId', this.$route.query.ticket_id)
        //    let loadingInstance = Loading.service('fullscreen')
        //    getTicketById(this.$route.query.ticket_id).then((response) => {
        //      this.$store.commit('updateDataWithStep1345', response.data.data)
        //      this.$store.commit('updateProductType', response.data.data.ticket_type.toString())
        //      loadingInstance.close()
        //      this.$router.push({ path: 'ticketAdd', query: { ticket_id: this.$route.query.ticket_id } })
        //    })
        //  }
       }
     },
     created () {
       if (this.$route.query.ticket_id || ls.getItem('ticketId')) {
         this.isDisabled = false
       }
       if (ls.getItem('ticketActiveKey') && ls.getItem('ticketActiveName')) {
         this.$store.commit('updateActiveKey', ls.getItem('ticketActiveKey'))
         this.activeName = ls.getItem('ticketActiveName')
         return
       }
       this.$store.commit('updateActiveKey', 0)
       ls.setItem('ticketActiveName', this.activeName)
       ls.setItem('ticketActiveKey', 0)
      //  if (!this.$store.getters.getDataWithStep1345.ticket_name) {
      //    this.handleGet()
      //  }
     }
   }

</script>
<style>
  .activePublic {margin-left: 100px;}
  .activePublic .router-link{color:#fff;}
  .activePublic .but-group .el-button{margin-right: 20px;}
  .submit-but-right {margin-left: 600px;}
</style>
