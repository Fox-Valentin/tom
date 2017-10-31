<template>
  <el-row>
    <el-col :span="16">
      <full-calendar class="test-fc" :events="fcEvents"
        first-day='1' locale="zh_CN"
        @changeMonth="changeMonth"
        @eventClick="eventClick"
        @dayClick="dayClick"
        @moreClick="moreClick">
          <template slot="fc-header-right">
          </template>
          <template slot="fc-event-card" scope="p">
              <p>{{ p.event.title }}</p>
          </template>
          <template slot="body-card-form">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="结算价：">
                  <el-input v-model="form.supplier_settle_price" size="small" :disabled="true"></el-input>
                </el-form-item>
               <el-form-item label="分销价(元)：">
                 <el-input v-model="form.distributor_settle_price" size="small"></el-input>
               </el-form-item>
              <el-form-item label="售卖价(元)：">
                <el-input v-model="form.sales_price" size="small"></el-input>
              </el-form-item>
               <el-form-item label="库存(张)：">
                 <el-input v-model="form.share_stock" size="small"></el-input>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" @click="updateOrCreateDatePrice" size="small" v-if="can('dp.ticket.updatePriceDate')">提交</el-button>
               </el-form-item>
            </el-form>
          </template>
      </full-calendar>
      <div style="padding-left:80px;">
        <el-button type="warning" @click="handleBack">返回上一步</el-button>
      <el-button type="primary" @click="handleNext">进入下一步</el-button>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="datepicker-title"></div>
      <v-datepickerWithPrice @submitDatePrices="updateOrCreateDatePrices"></v-datepickerWithPrice>
    </el-col>
  </el-row>
</template>
<script>
  import { getDatePriceById, updateOrCreateDatePrice, updateOrCreateDatePrices } from '@/api/api'
  import ls from '@/common/localStorage.js'
  export default {
    components: {
      'full-calendar': require('@/components/calendar/fullCalendar'),
      vDatepickerWithPrice: require('@/components/datepicker/datepickerWithPrice')
    },
    data () {
      return {
        fcEvents: [],
        form: {
          share_stock: 0,
          sales_price: 0,
          distributor_settle_price: 0,
          product_id: null,
          price_date: null,
          showCard: false,
          SubBtnDisabled: false
        }
      }
    },
    methods: {
      changeMonth (start, end, current) {
        var params = {
          type: 'month',
          month: current.format('YYYY-MM')
        }
        var ticketId = null
        if (!this.$route.query.ticket_id && !ls.getItem('ticketId')) {
          return
        } else {
          ticketId = this.$route.query.ticket_id || ls.getItem('ticketId')
          params.product_id = ticketId
          this.getDatePriceById(params)
        }
      },
      eventClick (event, jsEvent, pos) {
        console.log('eventClick', event, jsEvent, pos)
      },
      dayClick (day, jsEvent) {
        console.log('dayClick', day, jsEvent)
      },
      moreClick (day, events, jsEvent) {
        this.form.supplier_settle_price = events[0].supplier_settle_price
        this.form.distributor_settle_price = events[0].distributor_settle_price
        this.form.sales_price = events[0].sales_price
        this.form.share_stock = events[0].share_stock
        this.form.product_id = events[0].product_id
        this.price_date = events[0].price_date
      },
      updateOrCreateDatePrice () {
        if (this.SubBtnDisabled) {
          return
        }
        this.SubBtnDisabled = true
        var params = {
          price_date: this.price_date,
          sales_price: this.form.sales_price,
          settle_price: this.form.settle_price,
          share_stock: this.form.share_stock,
          distributor_settle_price: this.form.distributor_settle_price,
          fix_price: 1
        }
        if (this.$route.query.ticket_id) {
          params.product_id = this.$route.query.ticket_id
        } else {
          params.product_id = this.$store.getters.getTicketId
        }
        var productId = params.product_id
        updateOrCreateDatePrice(params).then((res) => {
          this.$store.commit('updateCardShowStatus', false)
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            var params = {
              type: 'month',
              month: new Date(this.price_date).getFullYear() + '-' + (new Date(this.price_date).getMonth() + 1),
              product_id: productId
            }
            this.getDatePriceById(params)
          }
          this.SubBtnDisabled = false
        })
      },
      updateOrCreateDatePrices (params) {
        if (this.SubBtnDisabled) {
          return
        }
        this.SubBtnDisabled = true
        if (this.$route.query.ticket_id) {
          params.product_id = this.$route.query.ticket_id
        } else {
          params.product_id = this.$store.getters.getTicketId
        }
        var productId = params.product_id
        var month = new Date(params.start_date).getFullYear() + '-' + (new Date(params.start_date).getMonth() + 1)
        updateOrCreateDatePrices(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            var params = {
              type: 'month',
              month: month,
              product_id: productId
            }
            this.getDatePriceById(params)
          }
          this.SubBtnDisabled = false
        })
      },
      getDatePriceById (params) {
        getDatePriceById(params).then((res) => {
          res.data.map((ary) => {
            ary.start = ary.price_date
            ary.end = ary.price_date
            ary.share_stock = ary.share_stock
            ary.distributor_settle_price = ary.distributor_settle_price / 100
            ary.sales_price = ary.sales_price / 100
            ary.supplier_settle_price = ary.supplier_settle_price
          })
          this.fcEvents = res.data
        })
      },
      handleBack () {
        var key = Number(this.$store.getters.getActiveKey)
        var activeNames = this.$store.getters.getActiveNames
        if (key <= 0) {
          return
        }
        key--
        var activeName = activeNames[key]
        this.$store.commit('updateActiveKey', key)
        this.$emit('changeTab', activeName)
      },
      handleNext () {
        var key = Number(this.$store.getters.getActiveKey)
        var activeNames = this.$store.getters.getActiveNames
        if (key >= activeNames.length) {
          return
        }
        key++
        var activeName = activeNames[key]
        this.$store.commit('updateActiveKey', key)
        this.$emit('changeTab', activeName)
      }
    }
  }
</script>
<style scoped>
    .el-form--inline .el-form-item{
      margin-right: 0px;
    }
    .datepicker-title {
      height:80px;
      line-height:80px;
      text-align:center;
      font-size:30px;
    }
</style>
