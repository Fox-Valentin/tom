<template>
  <div style="margin-top: 30px;">
    <div style="float: left;">
      <router-link :to="{path:'/showChannelAdmin'}">
        <el-button type="primary">返回</el-button>
      </router-link>
      <el-button type="primary" @click="showChargeDialog">提现</el-button>
    </div>

    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="float: right;">
      <!--<el-form-item label="订单号">-->
      <!--<el-input v-model="formInline.user" placeholder="订单号"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="提现时间">
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          align="right"
          placeholder="提现时间"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchByDate()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      :default-sort = "{prop: 'date', order: 'descending'}"
      border
    >
      <el-table-column
        label="id"
        sortable
        prop="id"
        width="100px"
      >
      </el-table-column>
      <el-table-column
        label="提现时间"
      >
        <template scope="scope">
          {{new Date(scope.row.created_at*1000).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column
        label="金额(元)"
        prop="cashback_value"
      >
        <template scope="scope">
          {{(scope.row.cashback_value / 100)}}
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
      >
      </el-table-column>
      <el-table-column
        label="提现人"
        prop="creator"
      >
      </el-table-column>
    </el-table>
    <div class="block pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
      </el-pagination>
    </div>
    <el-dialog title="分销商提现" :visible.sync="dialogFormVisible" size="tiny">
      <el-form :model="form" ref="form" :rules="rules" style="margin-right: 50px;" v-loading="dialogLoading">
        <el-form-item label="分销商名称" :label-width="formLabelWidth">
          {{form.dis_name}}
        </el-form-item>
        <el-form-item label="授信额度" :label-width="formLabelWidth">
          {{form.credit_value}}
        </el-form-item>
        <el-form-item label="余额" :label-width="formLabelWidth">
          {{form.balance}}
        </el-form-item>
        <el-form-item label="可用金额" :label-width="formLabelWidth">
          {{form.credit_value + form.balance}}
        </el-form-item>
        <el-form-item label="提现金额(元)" :label-width="formLabelWidth" prop="value">
          <el-input v-model.number="form.value" auto-complete="off" placeholder="金额大于0"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.remark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="SubBtnLoading" :disabled="SubBtnDisabled">提现</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import { getCashbackLog, cashback, dislist } from '@/api/api'
  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value <= 0) {
          callback('金额必须大于零')
        } else if (value > this.form.balance) {
          callback('金额必须小于等于余额')
        } else {
          callback()
        }
      }
      return {
        tableData: [],
        formInline: {
          user: '',
          region: ''
        },
        dialogFormVisible: false,
        form: {
          dis_id: this.$route.query.dis_id,
          balance: 0,
          credit_value: 0,
          value: null,
          remark: null,
          creator: JSON.parse(localStorage.getItem('user')).name
        },
        formLabelWidth: '120px',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value7: '',
        currentPage: 1,
        total: 0,
        per_page: 10,
        searchDate: [],
        rules: {
          value: [
            { required: true, message: '金额不能为空' },
            { type: 'number', message: '金额必须为数字值' },
            { validator: validatePass, trigger: 'blur' }
          ]
        },
        SubBtnLoading: false,
        SubBtnDisabled: false,
        dialogLoading: false
      }
    },
    methods: {
      handleEdit (index, row) {
        console.log(index, row)
      },
      handleDelete (index, row) {
        console.log(index, row)
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
        this.per_page = val
        this.handleGet()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.handleGet()
        console.log(`当前页: ${val}`)
      },
      searchByDate () {
        this.date = this.searchDate.map(ele => {
          return Date.parse(new Date(ele)) / 1000
        })
        let params = {
          dis_id: this.$route.query.dis_id,
          page: this.currentPage,
          page_size: this.per_page,
          search: this.date[0] === undefined ? null : [this.date[0], this.date[1]]
        }
        getCashbackLog(params).then((response) => {
          this.tableData = response.data.data.data
        })
      },
      submitForm () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.SubBtnLoading = true
            this.SubBtnDisabled = true
            cashback(this.form).then((response) => {
              if (response.data.data === '余额不足') {
                this.$notify({
                  title: '警告',
                  message: `余额不足`,
                  type: 'warning'
                })
                this.dialogFormVisible = false
                return
              }
              if (response.data.data) {
                this.$notify({
                  title: '成功',
                  message: `提现成功`,
                  type: 'success'
                })
                this.handleGet()
                this.handleGetDis()
                this.dialogFormVisible = false
                let _this = this
                setTimeout(function () {
                  _this.resetForm()
                  _this.SubBtnLoading = false
                  _this.SubBtnDisabled = false
                }, 500)
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm () {
        this.form.value = null
        this.form.remark = null
      },
      handleGet () {
        var params = {
          dis_id: this.$route.query.dis_id,
          page: this.currentPage,
          page_size: this.per_page
        }
        getCashbackLog(params).then((response) => {
          this.tableData = response.data.data.data
          this.total = response.data.data.total
        })
      },
      handleGetDis () {
        var params = {
          search: {
            searchKey: this.form.dis_id
          }
        }
        dislist(params).then((response) => {
          this.form.balance = response.data.data.data[0].balance / 100
          this.form.credit_value = response.data.data.data[0].credit_value / 100
          this.form.remark = response.data.data.data[0].remark
        })
      },
      handleSearch () {
        this.dialogLoading = true
        var params = {
          search: {
            searchKey: this.$route.query.dis_id
          }
        }
        dislist(params).then((response) => {
          let data = response.data.data.data[0]
          this.form.dis_name = data.dis_name
          this.form.balance = data.balance / 100
          this.form.credit_value = data.credit_value / 100
          this.dialogLoading = false
        })
      },
      showChargeDialog () {
        this.dialogFormVisible = true
        this.handleSearch()
      }
    },
    created () {
      this.handleSearch()
      this.handleGet()
    }
  }
</script>
<style scoped>
  .search-from{
    float: right;
  }
</style>
