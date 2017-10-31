<template>
  <div>
    <h3>
      <router-link :to="{path:'/showChannelControll'}">
        <el-button type="primary">返回</el-button>
      </router-link>
      &nbsp;&nbsp;&nbsp;
      景区名称：测试景区>测试价格体系1
    </h3>
    <el-alert
      title="警告提示的文案"
      type="info"
      :closable="false"
      style="width:200px;margin:20px 0;"
      >
    </el-alert>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="分销商">
        <el-input v-model="formInline.user" placeholder="分销商"></el-input>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select v-model="formInline.region" placeholder="上架状态">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">日志</el-button>
      </el-form-item>
    </el-form>
      <div style="margin-bottom: 20px">
        <el-button>上架</el-button>
        <el-button>下架</el-button>
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
          >
        </el-table-column>
        <el-table-column
          label="分销商名称"
          sortable
          prop="dis_name"
          >
        </el-table-column>
        <el-table-column
          label="渠道上架状态"
          prop="dis_status"
          >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="code"
          >
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small">价格日历</el-button>
            <el-button
              size="small">上架</el-button>
            <el-button
              size="small">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button>上架</el-button>
        <el-button>下架</el-button>
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
  </div>
</template>
<script>
import { getDisForTicket } from '@/api/api'
export default {
  data () {
    return {
      tableData: [{
        id: '1',
        type: 'type',
        name: 'name',
        code: 'code',
        sign: 'sign',
        qouta: 'qouta',
        balance: 'balance',
        status: 'status'
      }],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      formInline: {
        user: '',
        region: ''
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
      value7: '',
      multipleSelection: []
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
    }
  },
  created: function () {
    getDisForTicket(this.$route.query.ticket_id).then((response) => {
      this.tableData = response.data.data
    })
  }
}
</script>
<style scoped>

</style>
