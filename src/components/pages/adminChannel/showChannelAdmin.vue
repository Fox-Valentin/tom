<template>
  <div class="search-form-top">
    <!--<router-link :to="{path:'/addChanelAdmin'}">-->
    <!--</router-link>-->
    <el-button type="primary" @click="handleAdd()">添加分销商</el-button>
    <el-button type="success" @click="enableDis()">允许分销</el-button>
    <el-button type="danger" @click="forbiddenDis()">禁止分销</el-button>
    <el-form :inline="true"   class="demo-form-inline search-form">
      <!--<el-form-item label="分销商id">-->
        <!--<el-input  placeholder="分销商id" v-model="search_id"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-input  placeholder="分销商id或者分销商名称" v-model="searchKey"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
        @selection-change="handleSelectionChange">
        >
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          label="分销商id"
          sortable
          prop="id"
          >
        </el-table-column>
        <el-table-column
          label="分销商名称"
          prop="dis_name"
          >
        </el-table-column>
        <el-table-column
          label="授信额度(元)"
          prop="credit_value"
          >
          <template scope="scope">
            {{scope.row.credit_value/100}}
          </template>
        </el-table-column>
        <el-table-column
          label="余额(元)"
          prop="balance"
          >
          <template scope="scope">
            {{scope.row.balance/100}}
          </template>
        </el-table-column>
        <el-table-column
          label="可用金额(元)"
          prop="available"
          >
          <template scope="scope">
            {{(scope.row.credit_value+scope.row.balance)/100}}
          </template>
        </el-table-column>
        <el-table-column label="是否分销">
          <template scope="scope">
            <el-switch
              v-model="scope.row.dis_status"
              on-color="#13ce66"
              off-color="#f7ba2a"
              :on-value="switchOnVal"
              :off-value="switchOffVal"
              on-text="是"
              off-text="否"
              @change="disAction(scope.row)"
              :disabled="!can('dp.dis.enables')"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="预警值(元)"
          prop="warning_value"
          >
          <template scope="scope">
            {{(scope.row.warning_value)/100}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template scope="scope">
            <el-button  type="primary"  v-if="can('dp.dis.update')" size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small"  @click="ticketMan(scope.row.id)"  v-if="can('dp.dis.ticketList')">门票管理</el-button>
            <el-dropdown>
            <el-button  type="warning" size="small">
              更多<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button @click="resetSign(scope.$index, scope.row)">重置sign</el-button></el-dropdown-item>
              <el-dropdown-item v-if="can('dp.dis.rechargelog')">
                <router-link :to="{path:'/showRetailerCharge', query: { dis_id: scope.row.id, row: JSON.stringify(scope.row) }}">
                  <el-button>
                    充值记录
                  </el-button>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link :to="{path:'/showRetailerCash', query: { dis_id: scope.row.id ,row: JSON.stringify(scope.row)}}">
                  <el-button>
                    提现记录
                  </el-button>
                </router-link>
                </el-dropdown-item>
              <el-dropdown-item v-if="can('dp.dis.credit')">
                <el-button @click="showAccount(scope.$index, scope.row)">
                账户设置
                </el-button
                ></el-dropdown-item>
              <el-dropdown-item v-if="can('dp.dis.credit')">
                <el-button @click="showApi(scope.row)">
                API设置
                </el-button
                ></el-dropdown-item>
              <el-dropdown-item v-if="can('dp.dis.consumelog')">
                <router-link :to="{path:'/showRetailerCashRecord', query: { dis_id: scope.row.id }}">
                  <el-button>
                    消费记录
                  </el-button>
                </router-link>
                </el-dropdown-item>
              <el-dropdown-item>
                <router-link :to="{path:'/showRetailerStatements', query: { dis_id: scope.row.id }}">
                  <el-button>
                    流水记录
                  </el-button>
              </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      <el-dialog :title="dis_title" :visible.sync="dialogFormVisible" size="tiny">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="分销商类型" prop="dis_type">
            <el-radio-group v-model="ruleForm.dis_type">
              <el-radio label="ota"></el-radio>
              <el-radio label="其他"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分销商名称" prop="dis_name">
            <el-input v-model="ruleForm.dis_name"  placeholder="请输入分销商名称"></el-input>
          </el-form-item>
          <el-form-item label="报警额度(人民币/元)" prop="warning_value">
            <el-input v-model.number="ruleForm.warning_value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="SubBtnLoading1" :disabled="SubBtnDisabled1">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="账户设置" :visible.sync="dialogFormVisible1" size="tiny">
        <el-form :model="accountForm" :rules="rules1" ref="accountForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="余额(人民币/元)">
            {{accountForm.balance}}
          </el-form-item>
          <el-form-item label="信用额度(人民币/元)" prop="credit_value">
            <el-input v-model.number="accountForm.credit_value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateAccount" :loading="SubBtnLoading" :disabled="SubBtnDisabled">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="dis_title" :visible.sync="dialogFormVisible2" size="tiny">
        <el-form :model="apiForm" :rules="rules" ref="apiForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="请输入产品变更通知地址">
            <el-input v-model="apiForm.product_notice_url"  placeholder="请输入通知地址"></el-input>
          </el-form-item>
          <el-form-item label="请输入核销通知地址">
            <el-input v-model="apiForm.consume_notice_url"  placeholder="请输入通知l地址"></el-input>
          </el-form-item>
          <el-form-item label="请输入退款通知地址">
            <el-input v-model="apiForm.refund_notice_url"  placeholder="请输入通知地址"></el-input>
          </el-form-item>
          <el-form-item label="请输入出票通知地址">
            <el-input v-model="apiForm.ticketing_notice_url"  placeholder="请输入通知地址"></el-input>
          </el-form-item>
          <el-popover
            ref="popover1"
            placement="top-end"
            trigger="hover"
            content="点击复制分销商sign"
            >
          </el-popover>
          <el-form-item label="分销商sign">
            <el-input v-model="apiForm.dis_sign" id="clipsSign" :disabled="true">
              <el-button @success="handleClipSuccess" v-clipboard="apiForm.dis_sign" slot="append" icon="document" v-popover:popover1></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormApi" :loading="SubBtnLoading1" :disabled="SubBtnDisabled1">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>
<script>
import { dislist, modifydis, addsign, addcredit, updateDisStatus } from '../../../api/api'
export default {
  data () {
    var validatePass1 = function (rule, val, callback) {
      if (val < 0) {
        callback('不可小于零')
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      total: 0,
      per_page: 10,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dis_title: '编辑分销商',
      ruleForm: {
        id: 0,
        dis_name: '',
        credit_value: 0,
        balance: 0,
        dis_status: 1,
        dis_type: 'ota',
        warning_value: 0
      },
      apiForm: {
        dis_sign: '',
        product_notice_url: '',
        consume_notice_url: '',
        refund_notice_url: '',
        ticketing_notice_url: ''
      },
      searchKey: '',
      accountForm: {
        dis_id: null,
        credit_value: '',
        balance: ''
      },
      switchOnVal: 1,
      switchOffVal: 0,
      rules: {
        dis_name: [
          { required: true, message: '请输入分销商名称', trigger: 'blur' }
        ],
        warning_value: [
          { validator: validatePass1, trigger: 'blur' },
          { type: 'number', message: '必须为数字值' },
          { required: true, message: '不能为空' }
        ]
      },
      rules1: {
        credit_value: [
          { validator: validatePass1, trigger: 'blur' },
          { type: 'number', message: '必须为数字值' },
          { required: true, message: '不能为空' }
        ]
      },
      SubBtnLoading: false,
      SubBtnDisabled: false,
      SubBtnLoading1: false,
      SubBtnDisabled1: false,
      SubBtnLoading2: false,
      SubBtnDisabled2: false
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClipSuccess (e) {
      this.$message({
        message: '已复制',
        type: 'success'
      })
    },
    handleEdit (index, row) {
      this.dialogFormVisible = true
      this.ruleForm.dis_id = row.id
      this.ruleForm.dis_type = row.dis_type
      this.ruleForm.dis_name = row.dis_name
      this.accountForm.warning_value = row.warning_value / 100
      // this.ruleForm = this.tableData[index].
      this.dis_title = '编辑分销商'
    },
    handleAdd () {
      this.dis_title = '增加分销商'
      this.ruleForm = {
        dis_name: '',
        dis_type: 'ota',
        dis_product_notice_url: '',
        dis_consume_notice_url: '',
        dis_refund_notice_url: '',
        dis_ticketing_notice_url: ''
      }
      this.dialogFormVisible = true
    },
    handleDelete (index, row) {
    },
    handleSizeChange (val) {
      this.per_page = val
      this.handleGet()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.handleGet()
    },
    resetSign (index, row) {
      this.$confirm('确定要重置sign?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addsign(row.id).then((response) => {
          row.dis_sign = response.data.data
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消重置'
        })
      })
    },
    enableDis () {
      this.changeStatus(0, 'allow')
    },
    changeStatus (status, type) {
      if (!this.isHasSelected()) { return }
      let ids = []
      this.multipleSelection.forEach((ele) => {
        if (ele.dis_status === status) {
          ids.push(ele.id)
        }
      })
      if (ids.length === 0) { return }
      updateDisStatus(ids, type).then(() => {
        this.handleGet()
      })
    },
    forbiddenDis () {
      this.changeStatus(1, 'forbidden')
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
    submitForm () {
      const params = {
        dis_id: this.ruleForm.dis_id,
        dis_type: this.ruleForm.dis_type,
        dis_name: this.ruleForm.dis_name,
        warning_value: this.ruleForm.warning_value
      }
      if (this.dis_title === '编辑分销商') {
        params.id = null
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.SubBtnLoading1 = true
          this.SubBtnDisabled1 = true
          modifydis(params).then((response) => {
            if (response.data.msg === 'success') {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: ` ${this.dis_title} 成功`,
                type: 'success'
              })
              this.handleGet()
              let _this = this
              setTimeout(function () {
                _this.SubBtnLoading1 = false
                _this.SubBtnDisabled1 = false
              }, 500)
            }
          })
        } else {
          return false
        }
      })
    },
    ticketMan (id) {
      this.$router.push({path: '/showDisTickets', query: {id: id}})
    },
    handleGet (params) {
      params = params || {}
      params.page = this.currentPage
      params.page_size = this.per_page
      params.search = { searchKey: this.trim(this.searchKey) }
      dislist(params).then((response) => {
        this.tableData = response.data.data.data
        this.total = response.data.data.total
      })
    },
    handleSearch () {
      var params = {
        search: {
          searchKey: this.trim(this.searchKey)
        }
      }
      dislist(params).then((response) => {
        this.tableData = response.data.data.data
        this.total = response.data.data.total
      })
    },
    showAccount (index, row) {
      this.dialogFormVisible1 = true
      this.accountForm.credit_value = row.credit_value / 100
      this.accountForm.dis_id = row.id
    },
    updateAccount () {
      var params = this.accountForm
      this.$refs['accountForm'].validate((valid) => {
        if (valid) {
          this.SubBtnLoading = true
          this.SubBtnDisabled = true
          addcredit(params).then((response) => {
            if (response.data.data) {
              this.$notify({
                title: '成功',
                message: `设置成功`,
                type: 'success'
              })
              this.dialogFormVisible1 = false
              this.handleGet()
              let _this = this
              setTimeout(function () {
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
    disAction (row) {
      var params = {
        search: {
          searchKey: this.trim(this.searchKey)
        }
      }
      if (row.dis_status === 1) {
        updateDisStatus([row.id], 'allow').then(() => { this.handleGet(params) })
      } else if (row.dis_status === 0) {
        updateDisStatus([row.id], 'forbidden').then(() => { this.handleGet(params) })
      }
    },
    showApi (row) {
      this.dialogFormVisible2 = true
      this.apiForm.product_notice_url = row.product_notice_url
      this.apiForm.consume_notice_url = row.consume_notice_url
      this.apiForm.refund_notice_url = row.refund_notice_url
      this.apiForm.ticketing_notice_url = row.ticketing_notice_url
      this.apiForm.dis_sign = row.dis_sign
    },
    submitFormApi () {
      const params = {
        dis_id: this.ruleForm.dis_id,
        dis_product_notice_url: this.ruleForm.product_notice_url,
        dis_consume_notice_url: this.ruleForm.consume_notice_url,
        dis_refund_notice_url: this.ruleForm.refund_notice_url,
        dis_ticketing_notice_url: this.ruleForm.ticketing_notice_url
      }
      console.log(params)
    }
  },
  created: function () {
    this.handleGet()
  },
  computed: {
    rest_value: () => {}
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
</style>
