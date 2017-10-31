<template>
  <div style="margin-top: 30px;">
    <div style="margin-bottom: 30px;float: left">
      <el-button type="success" @click="enableDis()">允许分销</el-button>
      <el-button type="danger" @click="forbiddenDis()">禁止分销</el-button>
    </div>
    <el-form :inline="true" class="demo-form-inline search-from">
      <el-form-item label="">
        <el-input  placeholder="POI名称" v-model="formSearch" value=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
      </el-form-item>
    </el-form>
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
          label="是否分销"
          prop="dsp_status"
          width="120px"
          >
          <template scope="scope">
            <!--<el-tag :type="scope.row.dsp_status === 1?'success':'warning'">{{scope.row.dsp_status === 1?'分销':'禁止分销'}}</el-tag>-->
            <el-switch
              v-model="scope.row.dsp_status"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="是"
              off-text="否"
              :on-value="switchOn"
              :off-value="switchOff"
              @change="disAction(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          prop="scenic_name"
          >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="post_name"
          >
        </el-table-column>
        <!--<el-table-column label="操作">-->
          <!--<template scope="scope">-->
            <!--<router-link :to="{path:'/showChannelControllDetail',query:{scenic_id: scope.row.id}}">-->
              <!--<el-button size="small">详情</el-button>-->
            <!--</router-link>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
import { getTravelScenicList, updateTravelScenicDspStatus } from '@/api/api'
export default {
  data () {
    return {
      switchOn: 1,
      switchOff: 0,
      formSearch: '',
      tableData: [],
      per_page: 10,
      total: 10,
      currentPage: 1,
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
    handleSizeChange (val) {
      this.per_page = val
      var params = {
        pageSize: this.per_page,
        search: {scenic_name: this.trim(this.formSearch)},
        page: this.currentPage
      }
      this.handleGet(params)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      var search = {
        scenic_name: this.trim(this.formSearch)
      }
      var params = {
        pageSize: this.per_page,
        search: search,
        page: this.currentPage
      }
      this.handleGet(params)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    disAction (row) {
      if (row.dsp_status === 1) {
        updateTravelScenicDspStatus({ids: [row.id], type: 'allow'})
      } else if (row.dsp_status === 0) {
        updateTravelScenicDspStatus({ids: [row.id], type: 'forbidden'})
      }
    },
    enableDis () {
      if (!this.isHasSelected()) { return }
      let ids = []
      this.multipleSelection.forEach((ele) => {
        if (ele.dsp_status === 0) {
          ids.push(ele.id)
        }
      })
      if (ids.length === 0) { return }
      updateTravelScenicDspStatus({ids: ids, type: 'allow'}).then((response) => {
        var search = {
          scenic_name: this.trim(this.formSearch)
        }
        var params = {
          pageSize: this.per_page,
          search: search,
          page: this.currentPage
        }
        this.handleGet(params)
      })
    },
    forbiddenDis () {
      if (!this.isHasSelected()) { return }
      let ids = []
      this.multipleSelection.forEach((ele) => {
        if (ele.dsp_status === 1) {
          ids.push(ele.id)
        }
      })
      if (ids.length === 0) { return }
      updateTravelScenicDspStatus({ids: ids, type: 'forbidden'}).then((response) => {
        var search = {
          scenic_name: this.trim(this.formSearch)
        }
        var params = {
          pageSize: this.per_page,
          search: search,
          page: this.currentPage
        }
        this.handleGet(params)
      })
    },
    searchHandle () {
      var params = {
        pageSize: this.per_page,
        search: {scenic_name: this.trim(this.formSearch)},
        page: this.currentPage
      }
      this.handleGet(params)
    },
    isHasSelected () {
      if (this.multipleSelection.length === 0) {
        this.$alert('没有选择POI', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            return false
          }
        })
      }
      return true
    },
    handleGet (params) {
      getTravelScenicList(params).then((response) => {
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
  .search-from{
    float: right;
  }
</style>
