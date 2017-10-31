<template>
  <div style="margin-top: 30px;">
    <el-form :inline="true" class="demo-form-inline search-from">
      <el-form-item label="">
        <el-input  placeholder="退单编号/订单编号/合作商订单号" v-model="formSearch" value=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="refund_no"
        label="退单编号">
      </el-table-column>
      <el-table-column
        prop="order_id"
        label="订单编号">
      </el-table-column>
      <el-table-column
        prop="partner_order_id"
        label="合作商订单号">
      </el-table-column>
      <el-table-column
        prop="product_name"
        label="门票名称">
      </el-table-column>
      <el-table-column
        prop="refund_quantity"
        label="退单数量">
      </el-table-column>
      <el-table-column
        prop="refund_fee"
        label="手续费">
      </el-table-column>
      <el-table-column
        prop="refund_status"
        label="退款状态">
        <template scope="scope">
          <el-tag type="primary" v-if="scope.row.refund_status === '0'">审核中</el-tag>
          <el-tag type="primary" v-if="scope.row.refund_status === '1'">同意退款</el-tag>
          <el-tag type="primary" v-if="scope.row.refund_status === '2'">拒绝退款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="退款审核">
        <template scope="scope">
          <el-button v-if="scope.row.refund_status === '0'"  type="success" size="small" @click="approveOp(scope.row.id)">同意</el-button>
          <el-button v-if="scope.row.refund_status === '0'" type="danger" size="small" @click="rejectOp(scope.row.id)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { orderList, approveOrderRefund, rejectOrderRefund } from '@/api/api'
  export default {
    data () {
      return {
        tableData: [],
        formSearch: '',
        per_page: 10,
        total: 10,
        currentPage: 1
      }
    },
    methods: {
      searchHandle () {
        var params = {
          pageSize: this.per_page,
          search: this.trim(this.formSearch),
          page: this.currentPage
        }
        this.handleGet(params)
      },
      approveOp (id) {
        this.$confirm('此操作将同意退款, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          approveOrderRefund(id).then(response => console.log(response.data))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      rejectOp (id) {
        this.$confirm('此操作将拒绝退款, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rejectOrderRefund(id).then(response => console.log(response.data))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSizeChange (val) {
        this.per_page = val
        var params = {
          pageSize: this.per_page,
          search: this.trim(this.formSearch),
          page: this.currentPage
        }
        this.handleGet(params)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        var params = {
          pageSize: this.per_page,
          search: this.trim(this.formSearch),
          page: this.currentPage
        }
        this.handleGet(params)
      },
      handleGet (params) {
        orderList(params).then((response) => {
          this.tableData = response.data.data
          this.total = response.data.total
        })
      }
    },
    created: function () {
      orderList().then((response) => {
        this.tableData = response.data.data
        this.total = response.data.total
      })
    }
  }
</script>
<style scoped>
  .search-from{
    float: right;
  }
</style>
