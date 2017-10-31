<template>
  <div>
    <h3>
      <router-link :to="{path:'/showChannelControll'}">
        <el-button type="primary">返回</el-button>
      </router-link>
      &nbsp;&nbsp;&nbsp;
      景区名称：景区名称
      </h3>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="价格体系名称">
        <el-input v-model="formInline.user" placeholder="价格体系名称"></el-input>
      </el-form-item>
      <el-form-item label="价格体系id">
        <el-input v-model="formInline.user" placeholder="价格体系id"></el-input>
      </el-form-item>
      <el-form-item label="分销状态">
        <el-select v-model="formInline.region" placeholder="分销状态">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
      <div style="margin-bottom: 20px">
        <el-button>允许分销</el-button>
        <el-button>禁止分销</el-button>
        <el-button>恢复默认分销价</el-button>
      </div>
      <el-table
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          label="id"
          sortable
          prop="id"
          width="100px"
          >
        </el-table-column>
        <el-table-column
          label="价格计划"
          sortable
          prop="ticket_name"
          >
        </el-table-column>
        <el-table-column
          label="分销状态"
          prop="status"
          >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="code"
          >
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <router-link :to="{path:'/setChannelStockPrice', query: {ticket_id: scope.row.id}}">
              <el-button size="small">详情</el-button>
            </router-link>
            <el-button size="small" @click="showCalendarDialog(scope.row)">
              价格日历
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button>允许分销</el-button>
        <el-button>禁止分销</el-button>
        <el-button>恢复默认分销价</el-button>
      </div>
       <div class="block pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
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
      <el-dialog :visible.sync="dialogFormCalendar" size="large">
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
                  <li>
                    <label for="">供应商结算价</label>
                    <input type="text" readonly class="readonlyIpt">
                  </li>
                  <li>
                    <label for="">默认分销价</label>
                    <input type="text">
                  </li>
                  <li>
                    <label for="">共享库存</label>
                    <input type="text">
                  </li>
                  <button>提交</button>
                </template>
            </full-calendar>
          </el-col>
          <el-col :span="8">
            <v-datepickerWithPrice></v-datepickerWithPrice>
          </el-col>
        </el-row>
      </el-dialog>
  </div>
</template>
<script>
import { getTicketsForScenic } from '@/api/api'
let demoEvents = [
  {
    title: 'Lunfel 2/27-2/28',
    start: '2017-07-01',
    end: '2017-07-28',
    settlement: 22,
    distribution: 22,
    inventoryPooling: 20
  }
]
export default {
  components: {
    'full-calendar': require('@/components/calendar/fullCalendar'),
    vDatepickerWithPrice: require('@/components/datepicker/datepickerWithPrice')
  },
  data () {
    return {
      tableData: [],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      formInline: {
        user: '',
        region: ''
      },
      dialogFormVisible: false,
      dialogFormCalendar: false,
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
      value7: '',
      multipleSelection: [],
      fcEvents: demoEvents
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
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    onSubmit () {
      console.log('submit!')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeMonth (start, end, current) {
      console.log('changeMonth', start.format(), end.format(), current.format())
    },
    eventClick (event, jsEvent, pos) {
      console.log('eventClick', event, jsEvent, pos)
    },
    dayClick (day, jsEvent) {
      console.log('dayClick', day, jsEvent)
    },
    moreClick (day, events, jsEvent) {
      console.log('moreCLick', day, events, jsEvent)
    },
    showCalendarDialog (row) {
      console.log(row)
      this.dialogFormCalendar = true
    }
  },
  created: function () {
    getTicketsForScenic(this.$route.query.scenic_id).then((response) => {
      this.tableData = response.data.data
    })
  }
}
</script>
<style scoped>

</style>
