<template>
  <div style="width:420px;">
    <el-card class="box-card">
      <el-form label-width="100px" v-model="form">
        <el-form-item label="价格有效日期:">
          <el-date-picker
            v-model="form.valueDate"
            type="daterange"
            placeholder="选择日期范围"
            :picker-options="pickerOptions"
            @change="datePickerChange"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择条件:">
          <el-radio-group  v-model="form.valuePriceType">
            <el-radio label="week">按周报价</el-radio>
            <el-radio label="some_day">按号报价</el-radio>
            <el-radio label="all_day">天天报价</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="按周报价:" v-show="form.valuePriceType === 'week'">
          <el-checkbox-group v-model="form.valuePriceByWeeks">
            <el-checkbox label="1">一</el-checkbox>
            <el-checkbox label="2">二</el-checkbox>
            <el-checkbox label="3">三</el-checkbox>
            <el-checkbox label="4">四</el-checkbox>
            <el-checkbox label="5">五</el-checkbox>
            <el-checkbox label="6">六</el-checkbox>
            <el-checkbox label="0">七</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按日报价:" v-show="form.valuePriceType === 'some_day'">
          <el-checkbox-group v-model="form.valuePriceByDays">
            <el-checkbox v-for="item in checkboxDays" :key="item" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分销价:">
          <el-input placeholder="请输入价格" v-model="form.distributor_settle_price" :disabled="!switch2" class="width_value">
            <el-switch
              v-model="switch2"
              on-text=""
              off-text=""
              slot="prepend"
              >
            </el-switch>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="售卖价:">
          <el-input placeholder="请输入价格" v-model="form.sales_price" :disabled="!switch4" class="width_value">
            <el-switch
              v-model="switch4"
              on-text=""
              off-text=""
              slot="prepend"
            >
            </el-switch>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存:">
          <el-input placeholder="请输入内容" v-model="form.share_stock" :disabled="!switch3" class="width_value">
            <el-switch
              v-model="switch3"
              on-text=""
              off-text=""
              slot="prepend"
              >
            </el-switch>
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="subHandler" v-if="can('dp.dis.cu_DisDatePrices') && can('dp.ticket.updatePriceDates')">立即提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pickerOptions: {
        disabledDate (currentDay) {
          return currentDay.getTime() < new Date() - 8.64e7
        }
      },
      form: {
        valueDate: '',
        valuePriceType: 'all_day',
        valuePriceByWeeks: [],
        valuePriceByDays: [],
        valueSettlement: '',
        distributor_settle_price: 0,
        share_stock: 0,
        sales_price: 0
      },
      switch2: false,
      switch3: false,
      switch4: false,
      start_date: '',
      end_date: ''
    }
  },
  methods: {
    datePickerChange (value) {
      this.start_date = value.split(' ')[0]
      this.end_date = value.split(' ')[2]
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    subHandler () {
      var params = {
        // distributor_settle_price: this.form.distributor_settle_price,
        // sales_price: this.form.sales_price,
        // share_stock: this.form.share_stock,
        start_date: this.start_date,
        end_date: this.end_date,
        type: this.form.valuePriceType,
        days: this.form.valuePriceByDays,
        weekdays: this.form.valuePriceByWeeks
      }
      if (this.switch2) {
        params.distributor_settle_price = this.form.distributor_settle_price
      }
      if (this.switch4) {
        params.sales_price = this.form.sales_price
      }
      if (this.switch3) {
        params.share_stock = this.form.share_stock
      }
      if (!this.form.valueDate[0]) {
        this.$message.error('请选择日期')
        return
      }
      if (this.form.valuePriceType === 'week' && this.form.valuePriceByWeeks.length === 0) {
        this.$message.error('请选择周几')
        return
      }
      if (this.form.valuePriceType === 'some_day' && this.form.valuePriceByDays.length === 0) {
        this.$message.error('请选择几号')
        return
      }
      if (!this.switch2 && !this.switch4 && !this.switch3) {
        this.$message.error('请选择批量修改的内容')
        return
      }
      this.$emit('submitDatePrices', params)
    },
    clearFormValuePrice () {
      this.form.valuePriceByWeeks = []
      this.form.valuePriceByDays = []
    },
    getLastDayOFMonth (newDate) {
      var year = newDate.getFullYear()
      var month = newDate.getMonth() + 1
      var monthLastDay = new Date(year, month, 0)
      return monthLastDay.getDate()
    }
  },
  computed: {
    checkboxDays () {
      var newDate = new Date()
      var start = 1
      var end = this.getLastDayOFMonth(newDate)
      if (this.form.valueDate) {
        if (!this.form.valueDate[0]) {
          return
        }
        var startDate = this.form.valueDate[0]
        var endDate = this.form.valueDate[1]
        if (startDate.getMonth() === endDate.getMonth()) {
          start = startDate.getDate()
          end = endDate.getDate()
        } else {
          start = 1
          if (this.getLastDayOFMonth(newDate) > this.getLastDayOFMonth(endDate)) {
            end = this.getLastDayOFMonth(newDate)
          } else {
            end = this.getLastDayOFMonth(endDate)
          }
        }
      }
      var ary = []
      for (var i = start; i <= end; i++) {
        ary.push(i)
      }
      return ary
    }
  }
}
</script>
<style scoped>
  .el-form-item{
    margin-bottom:20px;
  }
  .width_value{
    width:240px;
  }
</style>
