<template>
  <div>
    <el-dialog title="请选择单门票" :visible.sync="dialogVisible1" size="small">
        <v-step1TravelDialog1 @submitPriceId="submitPriceId" @close="dialogVisible1 = false" :priceType="this.ruleForm.ticket_type"></v-step1TravelDialog1>
    </el-dialog>
    <el-dialog title="请选择套票" :visible.sync="dialogVisible2" size="small">
        <v-step1TravelDialog2 @submitPriceId="submitPriceId" @close="dialogVisible2 = false" :priceType="this.ruleForm.ticket_type"></v-step1TravelDialog2>
    </el-dialog>
    <el-dialog title="请选择travel poi" :visible.sync="poidialogFormVisible" size="small">
      <v-step1TravelPoiDialog :checkList="checkList" @close="poidialogFormVisible = false" @submit="submitScenic"></v-step1TravelPoiDialog>
    </el-dialog>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <el-form-item label="门票类型" prop="ticket_type">
        <el-radio-group v-model="ruleForm.ticket_type" @change="changeTicketType">
          <el-radio label="1">单票</el-radio>
          <el-radio label="2">套票</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品名称" prop="ticket_name">
        <el-row>
          <el-col :span="12">
            <el-input v-model="ruleForm.ticket_name"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="travel产品" prop="name">
        <el-button type="primary" @click="selectTicket">请选择travel门票</el-button>
        <el-tag v-if="price_name" type="warning">{{price_name}}</el-tag>
      </el-form-item>
      <el-form-item label="travel poi">
        <el-button type="primary" @click="selectScenic">请选择travel poi</el-button>
        <el-tag type="success" v-for="secnic in checkScenicList" :closable="true" @close="tagHandleClose(secnic)">{{secnic}}</el-tag>
      </el-form-item>
      <el-form-item label="有效期类型" class="valid_type">
        <template>
          <el-radio-group v-model="ruleForm.travel.exchange_valid_type">
            <el-radio label="0">不限</el-radio>
            <el-radio label="1">绝对有效期</el-radio>
            <el-radio label="2">相对有效期</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="凭证有效天数" prop="name" v-if="ruleForm.travel.exchange_valid_type === '2'">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.travel.validityDays"></el-input>
          </el-col>
          <el-col :span="11" :offset="1">
            (单位:天)
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="开始与结束日期" v-if="ruleForm.travel.exchange_valid_type === '1'" :picker-options="pickerOptions0">
        <el-date-picker
          v-model="exchange_valid_date_range"
          type="daterange"
          :picker-options="pickerOptions0"
           :editable="false"
          placeholder="选择开始与结束日期范围">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至少提前购买时间" prop="name">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.travel.book_early_min"></el-input>
          </el-col>
          <el-col  :span="1" :offset="1">
            天
          </el-col>
          <el-col :span="10">
            <el-time-picker
              class="book_early_time"
              v-model="lastTimePicker"
              format="HH:mm"
              placeholder="任意时间点"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              >
            </el-time-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="最多提前购买时间" prop="name">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.travel.book_early_max"></el-input>
          </el-col>
          <el-col  :span="1" :offset="1">
            天
          </el-col>
          <el-col :span="10">
            <el-time-picker
              class="book_early_time"
              v-model="mostTimePicker"
              :picker-options="{selectableRange: '00:00:01 - 23:59:59'}"
              format="HH:mm"
              placeholder="任意时间点">
            </el-time-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <!--<el-form-item label="生效时间(暂无)" prop="name" class="el-form-item&#45;&#45;width">-->
        <!--<el-input></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="单次最小购买数" prop="name">
        <el-row>
          <el-col :span="5">
          <el-input v-model="ruleForm.travel.least_buy_quantity"></el-input>
          </el-col>
        </el-row>
        <!--{{ruleForm.travel.least_buy_quantity}}-->
      </el-form-item>
      <el-form-item label="单次最大购买数" prop="name">
        <el-row>
          <el-col :span="5">
            <el-input v-model="ruleForm.travel.most_buy_quantity"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleValidSub" :loading="SubBtnLoading" :disabled="SubBtnDisabled">保存进入下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { getTravelTicketById, getTravelScenicList, getTravelTicketGroupById, addTicket, updateTicket, getTicketById } from '@/api/api'
  import ls from '@/common/localStorage.js'
  export default {
    components: {
      vStep1TravelDialog1: require('./step1TravelDialog1'),
      vStep1TravelDialog2: require('./step1TravelDialog2'),
      vStep1TravelPoiDialog: require('./step1TravelPoiDialog')
    },
    data () {
      return {
        currentPage: 1,
        total: 0,
        per_page: 10,
        lastTimePicker: new Date(2017, 1, 1, '00', '00'),
        mostTimePicker: new Date(2017, 1, 1, '00', '00'),
        baseDate: new Date(2017, 1, 1, '00', '00'),
        dialogVisible1: false,
        dialogVisible2: false,
        poidialogFormVisible: false,
        activeNames: ['1'],
        secnicList: [],
        checkList: [],
        checkScenicList: [],
        price_id: null,
        price_name: '',
        ruleForm: {
          ticket_name: '',
          ticket_type: '',
          travel: {
            validityDays: 1,
            exchange_valid_type: '0',
            exchange_valid_start: '',
            exchange_valid_end: '',
            book_early_min: 0,
            book_early_max: 60,
            least_buy_quantity: 1,
            most_buy_quantity: 9
          }
        },
        dialogTableVisible: false,
        formInline: {
          user: '',
          region: ''
        },
        valueDateEnd: '',
        valueDateStart: '',
        SubBtnLoading: false,
        SubBtnDisabled: false,
        ticket_type_old: null,
        rules: {
          ticket_name: [
            { required: true, message: '请输入产品名称', trigger: 'blur' }
          ],
          ticket_type: [
            { required: true, message: '请选择门票类型', trigger: 'change' }
          ]
        },
        pickerOptions0: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        exchange_valid_date_range: [],
        selectedDateRange: [
          [ '2017-10-30T16:00:00.000Z', '2017-11-14T16:00:00.000Z' ]
        ]
      }
    },
    methods: {
      add0 (m) { return m < 10 ? '0' + m : m },
      format (shijianchuo) {
        var time = new Date(shijianchuo)
        var y = time.getFullYear()
        var m = time.getMonth() + 1
        var d = time.getDate()
        return y + '-' + this.add0(m) + '-' + this.add0(d)
      },
      submitPriceId (priceId) {
        this.price_id = priceId
        this.submitPrice()
      },
      selectTicket () {
        if (!this.ruleForm.ticket_type) {
          this.$message.error('请选择门票类型')
          return
        }
        if (this.ruleForm.ticket_type === '1') {
          this.dialogVisible1 = true
        } else {
          this.dialogVisible2 = true
        }
      },
      selectScenic () {
        this.poidialogFormVisible = true
        getTravelScenicList().then((response) => {
          this.secnicList = response.data.data.data
        })
      },
      submitPrice () {
        if (this.ruleForm.ticket_type === '1') {
          getTravelTicketById(this.price_id).then((response) => {
            this.price_name = response.data.data.price_name
            this.ruleForm.travel.scenic_id = response.data.data.scenic_id
            this.ruleForm.travel.price_name = response.data.data.price_name
          })
        } else {
          getTravelTicketGroupById(this.price_id).then((response) => {
            this.price_name = response.data.data.name
            this.ruleForm.travel.scenic_id = response.data.data.scenic_id
            this.ruleForm.travel.price_name = response.data.data.price_name
          })
        }
      },
      submitScenic (checkList) {
        checkList.map((item) => {
          this.checkList.push(item.id)
          this.checkScenicList.push(item.scenic_name)
        })
        this.poidialogFormVisible = false
      },
      handleValidSub () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (!this.price_id && this.price_id !== 0) {
              this.$message.error('请选择travel产品')
              return
            }
            if (this.checkList.length <= 0) {
              this.$message.error('请选择travel poi')
              return
            }
            if (this.ruleForm.travel.exchange_valid_type === '1') {
              if (this.exchange_valid_date_range.length <= 0 || !this.exchange_valid_date_range[0]) {
                this.$message.error('选择开始与结束日期范围')
                return
              }
            }
            if (this.ruleForm.travel.least_buy_quantity > this.ruleForm.travel.most_buy_quantity) {
              this.$message.error('单次最小购买数不能大于单次最大购买数')
              return
            }
            var A1 = Number(this.ruleForm.travel.book_early_min)
            var B1 = new Date(this.lastTimePicker).getHours()
            var C1 = new Date(this.lastTimePicker).getMinutes()
            var A2 = Number(this.ruleForm.travel.book_early_max)
            var B2 = new Date(this.mostTimePicker).getHours()
            var C2 = new Date(this.mostTimePicker).getMinutes()
            var bookEarlyMin = A1 * 24 * 60 - B1 * 60 - C1
            var bookEarlyMax = A2 * 24 * 60 - B2 * 60 - C2
            if (bookEarlyMin >= bookEarlyMax) {
              this.$message.error('至少提前购买时间不可大于最多提前购买时间')
              return
            }
            this.handleSub()
          } else {
            return false
          }
        })
      },
      handleSub () {
        this.SubBtnLoading = true
        this.SubBtnDisabled = true
        var params = {
          travel: {}
        }
        params.price_id = this.price_id
        params.price_name = this.price_name
        var A1 = Number(this.ruleForm.travel.book_early_min)
        var B1 = new Date(this.lastTimePicker).getHours()
        var C1 = new Date(this.lastTimePicker).getMinutes()
        var A2 = Number(this.ruleForm.travel.book_early_max)
        var B2 = new Date(this.mostTimePicker).getHours()
        var C2 = new Date(this.mostTimePicker).getMinutes()
        params.travel.book_early_min = A1 * 24 * 60 + B1 * 60 + C1
        params.travel.book_early_max = A2 * 24 * 60 + B2 * 60 + C2
        params.price_type = this.ruleForm.price_type
        params.ticket_name = this.ruleForm.ticket_name
        params.ticket_type = this.ruleForm.ticket_type
        params.travel.validityDays = this.ruleForm.travel.validityDays
        params.travel.exchange_valid_type = this.ruleForm.travel.exchange_valid_type
        this.ruleForm.travel.exchange_valid_start = this.exchange_valid_date_range[0]
        this.ruleForm.travel.exchange_valid_end = this.exchange_valid_date_range[1]
        var exchangeValidStart = new Date(this.ruleForm.travel.exchange_valid_start).getFullYear() + '-' + (new Date(this.ruleForm.travel.exchange_valid_start).getMonth() + 1) + '-' + new Date(this.ruleForm.travel.exchange_valid_start).getDate()
        var exchangeValidEnd = new Date(this.ruleForm.travel.exchange_valid_end).getFullYear() + '-' + (new Date(this.ruleForm.travel.exchange_valid_end).getMonth() + 1) + '-' + new Date(this.ruleForm.travel.exchange_valid_end).getDate()
        params.travel.exchange_valid_start = parseInt(new Date(exchangeValidStart + ' ' + '0:0:0').getTime()) / 1000
        params.travel.exchange_valid_end = parseInt(new Date(exchangeValidEnd + ' ' + '0:0:0').getTime()) / 1000
        params.travel.least_buy_quantity = this.ruleForm.travel.least_buy_quantity
        params.travel.most_buy_quantity = this.ruleForm.travel.most_buy_quantity
        params.scenic_id = this.checkList.join(',')
        if (this.$route.query.ticket_id || ls.getItem('ticketId')) {
          params.id = this.$route.query.ticket_id || ls.getItem('ticketId')
          updateTicket(params).then((res) => {
            if (res.data.code === 10000) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$store.commit('updateDataWithStep1345', null)
              this.handleNext()
              this.$emit('changeStatus', false)
            } else {
              this.$message({
                message: '提交失败',
                type: 'warning'
              })
            }
            this.SubBtnLoading = false
            this.SubBtnDisabled = false
          })
          return
        }
        if (!ls.getItem('ticketId')) {
          addTicket(params).then((res) => {
            if (res.data.code === 10000) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$store.commit('updateDataWithStep1345', null)
              this.$store.commit('updateProductId', res.data.data)
              ls.setItem('ticketId', res.data.data)
              this.handleNext()
              this.$emit('changeStatus', false)
            } else {
              this.$message({
                message: '提交失败',
                type: 'warning'
              })
            }
          })
        }
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
        this.$store.commit('updateProductType', this.ruleForm.ticket_type)
      },
      tagHandleClose (secnic) {
        this.secnicList.map((item) => {
          if (item.scenic_name === secnic) {
            this.checkList.splice(this.checkList.indexOf(item.id), 1)
          }
        })
        this.checkScenicList.splice(this.checkScenicList.indexOf(secnic), 1)
      },
      changeTicketType () {
        if (!this.ticket_type_old) {
          this.ticket_type_old = this.ruleForm.ticket_type
          return
        }
        this.price_name = ''
        this.price_id = null
      },
      handleGet () {
        if (this.$store.getters.getDataWithStep1345 && this.$store.getters.getDataWithStep1345.ticket_name) {
          this.ruleForm.ticket_type = this.$store.getters.getDataWithStep1345.ticket_type.toString()
          this.ruleForm.ticket_name = this.$store.getters.getDataWithStep1345.ticket_name
          this.price_id = this.$store.getters.getDataWithStep1345.price_id
          this.price_name = this.$store.getters.getDataWithStep1345.price_name.price_name
          this.ruleForm.travel.validityDays = this.$store.getters.getDataWithStep1345.validity_days
          this.ruleForm.travel.exchange_valid_type = this.$store.getters.getDataWithStep1345.validity_type.toString()
          if (this.$store.getters.getDataWithStep1345.validity_start) {
            this.ruleForm.travel.exchange_valid_start = this.format(parseInt(this.$store.getters.getDataWithStep1345.validity_start) * 1000)
            this.exchange_valid_date_range[0] = this.ruleForm.travel.exchange_valid_start
          }
          if (this.$store.getters.getDataWithStep1345.validity_end) {
            this.ruleForm.travel.exchange_valid_end = this.format(parseInt(this.$store.getters.getDataWithStep1345.validity_end) * 1000)
            this.exchange_valid_date_range[1] = this.ruleForm.travel.exchange_valid_end
          }
          this.ruleForm.travel.least_buy_quantity = this.$store.getters.getDataWithStep1345.min_num
          this.ruleForm.travel.most_buy_quantity = this.$store.getters.getDataWithStep1345.max_num
          this.ruleForm.travel.book_early_min = Math.floor(this.$store.getters.getDataWithStep1345.book_early_min / 60 / 24)
          this.lastTimePicker = new Date(Number(this.baseDate.getTime()) + Number(this.$store.getters.getDataWithStep1345.book_early_min % (60 * 24) * 60 * 1000))
          this.ruleForm.travel.book_early_max = Math.floor(this.$store.getters.getDataWithStep1345.book_early_max / 60 / 24)
          this.mostTimePicker = new Date(Number(this.baseDate.getTime()) + Number(this.$store.getters.getDataWithStep1345.book_early_max % (60 * 24) * 60 * 1000))
          if (this.$store.getters.getDataWithStep1345.scenic_id) {
            this.$store.getters.getDataWithStep1345.scenic_id.split(',').map((val) => {
              this.checkList.push(Number(val))
            })
          }
          this.secnicList = this.$store.getters.getDataWithStep1345.scenics
          this.$store.getters.getDataWithStep1345.scenics.map((item) => {
            this.checkScenicList.push(item.scenic_name)
          })
          // this.submitPrice()
          // this.showSelectScenic()
          this.$store.commit('updateProductType', this.$store.getters.getDataWithStep1345.ticket_type.toString())
        } else {
          var ticketId = null
          if (!this.$route.query.ticket_id && !ls.getItem('ticketId')) {
            return
          } else {
            ticketId = this.$route.query.ticket_id || ls.getItem('ticketId')
          }
          this.$store.commit('updateProductId', ticketId)
          getTicketById(ticketId).then((response) => {
            this.ruleForm.ticket_name = response.data.data.ticket_name
            this.price_id = response.data.data.price_id
            this.price_name = response.data.data.price_name.price_name
            this.ruleForm.travel.validityDays = response.data.data.validity_days
            this.ruleForm.ticket_type = response.data.data.ticket_type.toString()
            this.ruleForm.travel.exchange_valid_type = response.data.data.validity_type.toString()
            if (response.data.data.validity_start) {
              this.ruleForm.travel.exchange_valid_start = this.format(parseInt(response.data.data.validity_start) * 1000)
              this.exchange_valid_date_range[0] = this.ruleForm.travel.exchange_valid_start
            }
            if (response.data.data.validity_end) {
              this.ruleForm.travel.exchange_valid_end = this.format(parseInt(response.data.data.validity_end) * 1000)
              this.exchange_valid_date_range[1] = this.ruleForm.travel.exchange_valid_end
            }
            this.ruleForm.travel.least_buy_quantity = response.data.data.min_num
            this.ruleForm.travel.most_buy_quantity = response.data.data.max_num
            this.ruleForm.travel.book_early_min = Math.floor(response.data.data.book_early_min / 60 / 24)
            this.lastTimePicker = new Date(Number(this.baseDate.getTime()) + Number(response.data.data.book_early_min % (60 * 24) * 60 * 1000))
            this.ruleForm.travel.book_early_max = Math.floor(response.data.data.book_early_max / 60 / 24)
            this.mostTimePicker = new Date(Number(this.baseDate.getTime()) + Number(response.data.data.book_early_max % (60 * 24) * 60 * 1000))
            if (response.data.data.scenic_id) {
              response.data.data.scenic_id.split(',').map((val) => {
                this.checkList.push(Number(val))
              })
            }
            this.secnicList = response.data.data.scenics
            response.data.data.scenics.map((item) => {
              this.checkScenicList.push(item.scenic_name)
            })
            // this.submitPrice()
            // this.showSelectScenic()
            this.$store.commit('updateProductType', response.data.data.ticket_type.toString())
            this.$store.commit('updateDataWithStep1345', response.data.data)
          })
        }
      }
    },
    mounted: function () {
      this.handleGet()
    },
    computed: {
      pickerOptions1: {
        disabledDate (time) {
          // for (var item in selectedDateRange) {
          //   console.log(item)
          // }
          return time < new Date('2017-10-30T16:00:00.000Z')
        }
      }
    }
  }
</script>
<style scoped>
  .book_early{
    width: 100px;
  }
  .book_early_time{
    width:120px;
  }
  .valid_type{
    width:420px;
  }
</style>
