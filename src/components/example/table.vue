<template>
  <div>
    <el-button type="primary">添加分销商</el-button>
      <el-table
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
        >
        <el-table-column
          label="分销商id"
          sortable
          prop="id"
          >
        </el-table-column>
        <el-table-column
          label="分销商类型"
          sortable
          prop="type"
          >
        </el-table-column>
        <el-table-column
          label="分销商名称"
          prop="name"
          >
        </el-table-column>
        <el-table-column
          label="分销商code"
          prop="code"
          >
        </el-table-column>
        <el-table-column
          label="分销商sign"
          prop="sign"
          >
        </el-table-column>
        <el-table-column
          label="授信额度"
          prop="qouta"
          >
        </el-table-column>
        <el-table-column
          label="余额"
          prop="balance"
          >
        </el-table-column>
        <el-table-column
          label="可用金额"
          prop="available"
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          >
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
       <div class="block">
        <span class="demonstration">完整功能</span>
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
  </div>
</template>
<script>
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
      currentPage4: 4
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
    }
  }
}
</script>
<style scoped>

</style>
