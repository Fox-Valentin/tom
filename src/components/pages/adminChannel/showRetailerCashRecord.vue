<template>
  <div style="margin-top: 30px;">
    <div style="float: left;">
      <router-link :to="{path:'/showChannelAdmin'}">
        <el-button type="primary">返回</el-button>
      </router-link>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="float: right;">
      <!--<el-form-item label="骏途订单号">-->
        <!--<el-input v-model="formInline.user" placeholder="骏途订单号"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="交易类型">-->
        <!--<el-select v-model="formInline.region" placeholder="活动区域">-->
          <!--<el-option label="区域一" value="shanghai"></el-option>-->
          <!--<el-option label="区域二" value="beijing"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="订单号">
        <el-input v-model="formInline.order_id" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="交易时间">
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          align="right"
          placeholder="交易时间"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
      <!--<p  style="margin-bottom:20px;">-->
        <!--&nbsp;&nbsp;&nbsp;<strong> 时间：</strong>2017-05-31 16:28:16 <strong>至</strong> 2017-05-31 16:28:16 &nbsp;&nbsp;&nbsp;<strong> 支出：</strong>2323232<strong> &nbsp;&nbsp;&nbsp;收入：</strong>2323232-->
      <!--</p>-->
      <el-table
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
        >
        <el-table-column
          label="订单号"
          sortable
          >
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.order_id }}</span>
            <!--<span style="margin-left: 10px">+</span>-->
            <!--<span style="margin-left: 10px">{{ scope.row.distributor_id }}</span>-->
          </template>
        </el-table-column>
        <el-table-column
          label="交易时间"
          sortable
          prop="created_at"
          >
          <template scope="scope">
            {{new Date(scope.row.created_at*1000).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column
          label="产品"
          prop="order_name"
          >
        </el-table-column>
        <el-table-column
          label="交易金额(元)"
          prop="consume_value"
          >
          <template scope="scope">
            {{(scope.row.consume_value)/100}}
          </template>
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
          :total="total">
        </el-pagination>
      </div>
      <el-dialog title="分销商充值" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="分销商名称" :label-width="formLabelWidth">
            测试分销商
          </el-form-item>
          <el-form-item label="操作人" :label-width="formLabelWidth">
            当前账号
          </el-form-item>
          <el-form-item label="当前可用金额" :label-width="formLabelWidth">
            333
          </el-form-item>
          <el-form-item label="余额" :label-width="formLabelWidth">
            333
          </el-form-item>
          <el-form-item label="充值金额" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import { getconsumelog } from '@/api/api'
export default {
  data () {
    return {
      tableData: [{
        id: '1',
        consume_value: '',
        status: 'status'
      }],
      formInline: {
        order_id: ''
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
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
      searchDate: '',
      currentPage: 1,
      total: 0,
      per_page: 10
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
      this.per_page = val
      this.handleGet()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.handleGet()
    },
    onSubmit () {
      let date = this.searchDate && this.searchDate.map(ele => {
        return Date.parse(new Date(ele)) / 1000
      })
      let params = {
        order_id: this.trim(this.formInline.order_id),
        dis_id: this.$route.query.dis_id,
        page_size: this.per_page,
        search: date[0] === undefined ? null : [date[0], date[1]]
      }
      getconsumelog(params).then((response) => {
        this.tableData = response.data.data.data
        this.total = response.data.data.total
      })
    },
    handleGet () {
      var params = {
        dis_id: this.$route.query.dis_id,
        page: this.currentPage,
        page_size: this.per_page
      }
      getconsumelog(params).then((response) => {
        this.tableData = response.data.data.data
        this.total = response.data.data.total
      })
    }
  },
  created: function () {
    this.handleGet()
  }
}
</script>
<style scoped>

</style>
