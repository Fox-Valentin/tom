<template>
  <div style="margin-top: 30px;" v-if="can('dp.ticket.index')">
    <el-form :inline="true" :model="formSearch" class="demo-form-inline search-form">
      <el-form-item>
        <el-input v-model="formSearch.search" placeholder="产品名称或id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px;float: left;">
      <el-button type="primary" v-if="can('dp.ticket.store')" class="float-left" @click="toTicketAdd(null)">添加产品</el-button>
      <el-button type="success" @click="allowDis()">允许分销</el-button>
      <el-button type="danger" @click="forbiddenDis()">禁止分销</el-button>
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
        label="产品名称"
        sortable
        prop="ticket_name"
      >
      </el-table-column>
      <el-table-column
        label="产品类别"
        sortable
        prop="ticket_type"
        width="150px"
      >
        <template scope="scope">
          <el-tag :type="scope.row.ticket_type === 1?'success':'warning'">{{scope.row.ticket_type === 1?'单票':'套票'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否分销" width="150px">
        <template scope="scope">
          <el-switch
            v-model="scope.row.status"
            on-color="#13ce66"
            off-color="#f7ba2a"
            :on-value="switchOnVal"
            :off-value="switchOffVal"
            on-text="是"
            off-text="否"
            @change="disAction(scope.row.id, scope.row.status)"
            :disabled="!can('dp.ticket.enables')"
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="300px">
        <template scope="scope">
          <el-button type="primary" size="small" @click="toTicketAdd(scope.row.id)" v-if="can('dp.ticket.update')">编辑</el-button>
          <el-button size="small" type="danger" @click="dropTicketById(scope.row.id)" v-if="can('ticket.destroy')">
            删除
          </el-button>
          <router-link :to="{path:'/showTicketDiss', query: {ticket_id: scope.row.id}}" v-if="can('dp.ticket.disList')">
            <el-button size="small">分销商管理</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 8, 10, 20]"
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
  import { ticketsList, updateTicketsStatus, dropTicket, getTicketById } from '@/api/api'
  import ls from '@/common/localStorage.js'
  import { Loading } from 'element-ui'
  export default {
    data () {
      return {
        tableData: [],
        currentPage: 1,
        total: 0,
        per_page: 10,
        formInline: {
          user: '',
          region: ''
        },
        formSearch: {
          search: ''
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
        multipleSelection: [],
        switchOnVal: 1,
        switchOffVal: 0
      }
    },
    methods: {
      handleSizeChange (val) {
        this.per_page = val
        ticketsList(this.currentPage, this.per_page, this.trim(this.formSearch.search)).then((response) => {
          this.tableData = response.data.data.data
        })
      },
      handleCurrentChange (val) {
        this.currentPage = val
        ticketsList(val, this.per_page, this.trim(this.formSearch.search)).then((response) => {
          this.tableData = response.data.data.data
        })
      },
      onSubmit () {
        ticketsList(1, this.per_page, this.trim(this.formSearch.search)).then((response) => {
          this.tableData = response.data.data.data
          this.total = response.data.data.total
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      changeStatus (status, type) {
        if (!this.isHasSelected()) { return }
        let ids = []
        this.multipleSelection.forEach((ele) => {
          if (ele.status === status) {
            ids.push(ele.id)
          }
        })
        if (ids.length === 0) { return }
        updateTicketsStatus(ids, type).then(() => {
          this.getTicketList()
        })
      },
      isHasSelected () {
        if (this.multipleSelection.length === 0) {
          this.$alert('没有选择分销商', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              return false
            }
          })
        }
        return true
      },
      allowDis () {
        this.changeStatus(0, 'allow')
      },
      forbiddenDis () {
        this.changeStatus(1, 'forbidden')
      },
      getTicketList () {
        if (this.formSearch.search.length > 0) {
          ticketsList(this.currentPage, this.per_page, this.formSearch.search).then((response) => {
            this.tableData = response.data.data.data
            this.total = response.data.data.total
          })
          return
        }
        ticketsList(this.currentPage, this.per_page).then((response) => {
          this.tableData = response.data.data.data
          this.total = response.data.data.total
        })
      },
      dropTicketById (id) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dropTicket(id).then(() => {
            this.getTicketList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      disAction (id, status) {
        var ids = []
        if (status === 1) {
          ids = [id]
          updateTicketsStatus(ids, 'allow').then((response) => {
            this.getTicketList()
          })
        } else {
          ids = [id]
          updateTicketsStatus(ids, 'forbidden').then((response) => {
            this.getTicketList()
          })
        }
      },
      toTicketAdd (TicketId) {
        ls.removeItem('ticketActiveName')
        ls.removeItem('ticketActiveKey')
        ls.removeItem('ticketId')
        if (TicketId) {
          this.$store.commit('updateProductId', TicketId)
          let loadingInstance = Loading.service('fullscreen')
          getTicketById(TicketId).then((response) => {
            this.$store.commit('updateDataWithStep1345', response.data.data)
            this.$store.commit('updateProductType', response.data.data.ticket_type.toString())
            loadingInstance.close()
            this.$router.push({ path: 'ticketAdd', query: { ticket_id: TicketId } })
          })
        } else {
          this.$store.commit('updateDataWithStep1345', null)
          this.$router.push({ path: 'ticketAdd' })
        }
      }
    },
    created: function () {
      this.$store.commit('updateDataWithStep1345', {})
      this.getTicketList()
    }
  }
</script>
<style scoped>
  .search-form{
    float: right;
  }
  .float-left{
    float: left;
  }
</style>
