<template>
  <div style="width:520px;">
    <el-card class="box-card">
      <el-form label-width="100px">
        <el-form-item label="价格有效日期:">
          <el-date-picker
            v-model="valueDate"
            type="daterange"
            placeholder="选择日期范围"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择条件:">
          <el-radio-group  v-model="valuePriceType">
            <el-radio label="weeks">按周报价</el-radio>
            <el-radio label="days">按号报价</el-radio>
            <el-radio label="everyday">天天报价</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="按周报价:" v-show="valuePriceType === 'weeks'">
          <el-checkbox-group v-model="valuePriceByWeeks">
            <el-checkbox label="1">一</el-checkbox>
            <el-checkbox label="2">二</el-checkbox>
            <el-checkbox label="3">三</el-checkbox>
            <el-checkbox label="4">四</el-checkbox>
            <el-checkbox label="5">五</el-checkbox>
            <el-checkbox label="6">六</el-checkbox>
            <el-checkbox label="7">七</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按日报价:" v-show="valuePriceType === 'days'">
          <el-checkbox-group v-model="valuePriceByDays">
            <el-checkbox v-for="item in checkboxDays" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="供应商结算价:">
          <el-input placeholder="请输入价格" v-model="valueSettlement" :disabled="!switch1">
            <el-switch
              v-model="switch1"
              on-text=""
              off-text=""
              slot="prepend"
              >
            </el-switch>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="默认分销价:">
          <el-input placeholder="请输入价格" v-model="valueDistribution" :disabled="!switch2">
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
        <el-form-item label="共享库存:">
          <el-input placeholder="请输入内容" v-model="valueInventoryPooling" :disabled="!switch3">
            <el-switch
              v-model="switch3"
              on-text=""
              off-text=""
              slot="prepend"
              >
            </el-switch>
            <template slot="append">张/份</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="">立即提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    {{valueSettlement}}
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
      valueDate: '',
      valuePriceType: '',
      valuePriceByWeeks: [],
      valuePriceByDays: [],
      switch1: false,
      switch2: false,
      switch3: false,
      valueSettlement: '',
      valueDistribution: '',
      valueInventoryPooling: ''
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  },
  computed: {
    checkboxDays () {
      var ary = []
      for (var i = 1; i <= 31; i++) {
        ary.push(i)
      }
      return ary
    }
  }
}
</script>
<style scoped>
</style>
