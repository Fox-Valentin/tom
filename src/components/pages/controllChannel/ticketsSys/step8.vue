<template>
  <div class="search-form-top">
    <div class="btn-wrap">
      <el-button type="warning" @click="handleBack">返回上一步</el-button>
    </div>
      <el-table
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
        >
        <el-table-column
          label="id"
          sortable
          prop="id"
          >
        </el-table-column>
        <el-table-column
          label="景区id"
          sortable
          prop="scenic_id"
          >
        </el-table-column>
        <el-table-column
          label="门票id"
          sortable
          prop="ticket_id"
          >
        </el-table-column>
        <el-table-column
          label="景区名称"
          prop="scenic_name"
          >
        </el-table-column>
        <el-table-column
          label="门票名称"
          prop="ticket_name"
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="create_time"
          >
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button @click="showDatePrice(scope.row.t_id)">
              价格日历
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogFormCalendar" size="full">
        <el-row>
          <el-col :span="16">
            <full-calendar class="test-fc" :events="fcEvents"
              first-day='1' locale="zh_CN"
              @changeMonth="changeMonth"
              @moreClick="moreClick"
              >
                <template slot="fc-header-right">
                </template>
                <template slot="fc-event-card" scope="p">
                    <p>{{ p.event.title }}</p>
                </template>
                <template slot="body-card-form">
                  <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="结算价：">
                      <el-input v-model="form.settle_price" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateOrCreateDatePrice" size="small">提交</el-button>
                    </el-form-item>
                  </el-form>
                </template>
            </full-calendar>
          </el-col>
          <el-col :span="8">
            <div class="datepicker-title"></div>
            <v-datepickerWithPrice @submitDatePrices="updateOrCreateDatePrices"></v-datepickerWithPrice>
          </el-col>
        </el-row>
      </el-dialog>
  </div>
</template>
<script>
import { getGroupPerTicket, getGroupPerTicketDatePrice, recordGroupSingleTicketDatePrice, recordGroupSingleTicketDatePrices } from '@/api/api'
import moment from 'moment'
import ls from '@/common/localStorage.js'
export default {
  components: {
    'full-calendar': require('@/components/calendar/fullCalendarSingleTicket'),
    vDatepickerWithPrice: require('@/components/datepicker/datepickerWithPriceSinglePrice')
  },
  data () {
    return {
      dialogFormCalendar: false,
      fcEvents: [],
      tableData: [{
        id: null,
        scenic_id: null,
        ticket_id: null,
        scenic_name: '',
        ticket_name: '',
        create_time: '',
        name: 'name'
      }],
      form: {
        settle_price: null
      },
      formLabelWidth: '120px',
      price_date: null,
      product_id: null,
      ticket_id: null,
      SubBtnDisabled: false
    }
  },
  methods: {
    showDatePrice (ticketId) {
      this.dialogFormCalendar = true
      this.product_id = this.$store.getters.getTicketId
      this.ticket_id = ticketId
      var params = {
        type: 'month',
        month: moment().format('YYYY-MM'),
        product_id: this.product_id,
        ticket_id: this.ticket_id
      }
      this.getGroupPerTicketDatePrice(params)
    },
    changeMonth (start, end, current) {
      var params = {
        type: 'month',
        month: current.format('YYYY-MM'),
        product_id: this.product_id,
        ticket_id: this.ticket_id
      }
      this.getGroupPerTicketDatePrice(params)
    },
    moreClick (day, events, jsEvent) {
      this.form.settle_price = events[0].settle_price
      this.price_date = events[0].price_date
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
    handleGet () {
      var ticketId = null
      if (!this.$route.query.ticket_id && !ls.getItem('ticketId')) {
        return
      } else {
        ticketId = this.$route.query.ticket_id || ls.getItem('ticketId')
      }
      console.log(ticketId)
      getGroupPerTicket(ticketId).then((res) => {
        this.tableData = res.data.data
        this.tableData.map((item) => {
          item.create_time = moment(item.create_time * 1000).format('YYYY-MM-DD')
        })
      })
    },
    handleDatePrice () {
      var params = {
        type: 'month',
        month: moment().format('YYYY-MM'),
        product_id: this.$store.getters.getTicketId,
        ticket_id: 59
      }
      getGroupPerTicketDatePrice(params).then((res) => {
        console.log(res.data.data)
      })
    },
    updateOrCreateDatePrice () {
      if (this.SubBtnDisabled) {
        return
      }
      this.SubBtnDisabled = true
      var params = {
        price_date: this.price_date,
        settle_price: this.form.settle_price * 100,
        product_id: this.product_id,
        ticket_id: this.ticket_id
      }
      recordGroupSingleTicketDatePrice(params).then((res) => {
        this.$store.commit('updateCardShowStatus', false)
        if (res.data.code === 10000) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          var month = new Date(this.price_date).getFullYear() + '-' + (new Date(this.price_date).getMonth() + 1)
          var params = {
            type: 'month',
            month: month,
            product_id: this.product_id,
            ticket_id: this.ticket_id
          }
          this.getGroupPerTicketDatePrice(params)
        }
        this.SubBtnDisabled = false
      })
    },
    getGroupPerTicketDatePrice (params) {
      getGroupPerTicketDatePrice(params).then((res) => {
        console.log(res.data.data)
        res.data.data.map((ary) => {
          ary.start = ary.price_date
          ary.end = ary.price_date
          ary.settle_price = Number(ary.settle_price) / 100
        })
        this.fcEvents = res.data.data
      })
    },
    updateOrCreateDatePrices (params) {
      if (this.SubBtnDisabled) {
        return
      }
      this.SubBtnDisabled = true
      params.product_id = this.product_id
      params.ticket_id = this.ticket_id
      var month = new Date(params.start_date).getFullYear() + '-' + (new Date(params.start_date).getMonth() + 1)
      recordGroupSingleTicketDatePrices(params).then((res) => {
        if (res.data.code === 10000) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          var params = {
            type: 'month',
            month: month,
            product_id: this.product_id,
            ticket_id: this.ticket_id
          }
          this.getGroupPerTicketDatePrice(params)
        }
        this.SubBtnDisabled = false
      })
    }
  },
  mounted () {
    this.handleGet()
  }
}
</script>
<style scoped>
  .search-form-top{
    margin-top: 20px;
  }
  .search-form{
    margin-left: 100px;
    float: right;
  }
  .btn-wrap {
    margin-bottom:20px;
  }
</style>
