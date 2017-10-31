<template>
  <div style="margin-top: 30px;">
    <div style="float: left;">
      <router-link :to="{path:'/ticket'}">
        <el-button type="primary">返回</el-button>
      </router-link>
      <el-button type="success" @click="enableDis()">允许分销</el-button>
      <el-button type="danger" @click="forbiddenDis()">禁止分销</el-button>
      <el-button type="primary" v-if="can('dis.backs')" @click="openTip()">恢复默认分销价</el-button>
    </div>
    <el-form :inline="true"  class="demo-form-inline" style="float: right;">
      <el-form-item >
        <el-input  placeholder="分销商id或名称" v-model="searchKey"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      :default-sort = "{prop: 'date', order: 'descending'}"
      border
      @selection-change="handleSelectionChange">
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
        label="分销商类别"
        sortable
        prop="dis_type"
      >
      </el-table-column>
      <el-table-column
        label="分销操作"
        prop=""
      >
      <template scope="scope">
        <el-switch
        v-model="scope.row.dis_status"
          on-color="#13ce66"
          off-color="#f7ba2a"
          :on-value="switchOnVal"
          :off-value="switchOffVal"
          on-text="是"
          off-text="否"
          @change="disAction(scope.row.id)"
          >
        </el-switch>
      </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button @click="showDatePrice(scope.row.id)">
            价格日历
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="float: right;margin-top: 20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogFormCalendar" size="full">
      <el-row>
        <el-col :span="16">
          <full-calendar class="test-fc" :events="fcEvents"
                         first-day='1' locale="zh_CN"
                         @changeMonth="changeMonth"
                         @moreClick="moreClick">
            <template slot="fc-header-right">
            </template>
            <template slot="fc-event-card" scope="p">
              <p>{{ p.event.title }}</p>
            </template>
            <template slot="body-card-form">
              <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="结算价：">
                  <el-input v-model="supplier_settle_price(form.supplier_settle_price)" size="small" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="分销价：">
                  <el-input v-model="form.distributor_settle_price" size="small"></el-input>
                </el-form-item>
                <el-form-item label="售卖价：">
                  <el-input v-model="form.sales_price" size="small"></el-input>
                </el-form-item>
                <el-form-item label="共享库存：">
                  <el-input v-model="form.share_stock" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="subOneDay" size="small">提交</el-button>
                </el-form-item>
              </el-form>
            </template>
          </full-calendar>
        </el-col>
        <el-col :span="8" style="margin-top: 100px;">
          <div class="datepicker-title"></div>
          <v-datepickerWithPrice @submitDatePrices="updateOrCreateDatePrices"></v-datepickerWithPrice>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import { updateDisTicketRelation, disListByFilter, getDisTicketDatePrice, updateOrCreateDisDatePrices, updateOrCreateDisDatePrice, backDisDatePrice } from '@/api/api'
  import moment from 'moment'
  export default {
    components: {
      'full-calendar': require('@/components/calendar/fullCalendarShowTicketDiss'),
      vDatepickerWithPrice: require('@/components/datepicker/datepickerWithShowTicketDiss')
    },
    data () {
      return {
        fcEvents: [],
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        dialogFormCalendar: false,
        distributor_id: null,
        product_id: null,
        form: {
          share_stock: '',
          sales_price: '',
          product_id: null,
          distributor_id: null,
          price_date: '',
          showCard: false
        },
        multipleSelection: [],
        current: '',
        switchOnVal: 1,
        switchOffVal: 0,
        searchKey: ''
      }
    },
    methods: {
      openTip () {
        if (this.multipleSelection.length === 0) {
          this.$alert('请先选择门票', '', {
            confirmButtonText: '确定',
            type: 'danger'
          })
          return
        }
        this.$confirm('此操作将恢复默认分销价, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.callbackDisDatePrice()
        }).catch(() => {})
      },
      callbackDisDatePrice () {
        let diss = this.multipleSelection.map(ele => ele.id)
        backDisDatePrice({
          diss: diss,
          product_id: this.$route.query.ticket_id
        }).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '操作失败',
              type: 'warning'
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getHandle()
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getHandle()
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      showDatePrice (id) {
        this.dialogFormCalendar = true
        this.distributor_id = id
        this.product_id = this.$route.query.ticket_id
        this.current = moment()
        var params = {
          type: 'month',
          month: this.current.format('YYYY-MM'),
          product_id: this.product_id,
          distributor_id: this.distributor_id
        }
        this.getDatePriceById(params)
      },
      changeMonth (start, end, current) {
        this.current = current
        var params = {
          type: 'month',
          month: this.current.format('YYYY-MM'),
          product_id: this.$route.query.ticket_id,
          distributor_id: this.distributor_id
        }
        this.getDatePriceById(params)
      },
      moreClick (day, events, jsEvent) {
        this.form.supplier_settle_price = events[0].supplier_settle_price
        this.form.distributor_settle_price = events[0].distributor_settle_price
        this.form.sales_price = events[0].sales_price
        this.form.share_stock = events[0].share_stock
        this.form.product_id = events[0].product_id
        this.form.price_date = events[0].price_date
      },
      subOneDay () {
        var params = this.form
        params.distributor_id = this.distributor_id
        // params.product_id = this.$route.query.id
        // params.distributor_id = this.$route.query.id
        updateOrCreateDisDatePrice(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$store.commit('updateCardShowStatus', false)
            this.showDatePrice(this.distributor_id)
          }
        })
      },
      updateOrCreateDatePrices (params) {
        params.product_id = this.product_id
        params.distributor_id = this.distributor_id
        updateOrCreateDisDatePrices(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            var params = {
              type: 'month',
              month: this.current.format('YYYY-MM'),
              product_id: this.product_id,
              distributor_id: this.distributor_id
            }
            this.getDatePriceById(params)
          }
        })
      },
      getDatePriceById (params) {
        getDisTicketDatePrice(params).then((res) => {
          res.data.data.map((ary) => {
            ary.start = ary.price_date
            ary.end = ary.price_date
            ary.share_stock = ary.share_stock
            ary.sales_price = ary.sales_price / 100
            ary.supplier_settle_price = ary.supplier_settle_price
            ary.supplier_settle_price_show = ary.supplier_settle_price ? ary.supplier_settle_price.split('.')[0] : ary.supplier_settle_price
            ary.distributor_settle_price = ary.distributor_settle_price / 100
          })
          this.fcEvents = res.data.data
        })
      },
      getHandle () {
        disListByFilter({
          page: this.currentPage,
          pageSize: this.pageSize,
          product_id: this.$route.query.ticket_id,
          search: this.trim(this.searchKey)
        }).then((response) => {
          this.total = response.data.data.total
          this.tableData = response.data.data.data
        })
      },
      handleSearch () {
        this.getHandle()
      },
      disAction (id) {
        updateDisTicketRelation(this.$route.query.ticket_id, [id]).then(() => {
          this.getHandle()
        })
      },
      changeStatus (status) {
        if (!this.isHasSelected()) { return }
        let ids = []
        this.multipleSelection.forEach((ele) => {
          if (ele.dis_status === status) {
            ids.push(ele.id)
          }
        })
        if (ids.length === 0) { return }
        updateDisTicketRelation(this.$route.query.ticket_id, ids).then(() => {
          this.getHandle()
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
      enableDis () {
        this.changeStatus(0)
      },
      forbiddenDis () {
        this.changeStatus(1)
      },
      supplier_settle_price (val) {
        if (val) {
          return val.split('.')[0]
        }
      }
//      enableDis () {
//        this.multipleSelection.forEach((obj) => {
//          if (obj.dis_status === 0) {
//            updateDisTicketRelation(this.$route.query.ticket_id, obj.id)
//          }
//        })
//        this.handleCurrentChange()
//      },
//      forbiddenDis () {
//        this.multipleSelection.forEach((obj) => {
//          if (obj.dis_status === 1) {
//            updateDisTicketRelation(this.$route.query.ticket_id, obj.id)
//          }
//        })
//        this.handleCurrentChange()
//      }
    },
    mounted () {
      this.getHandle()
    }
  }
</script>
