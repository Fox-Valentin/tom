<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <!--<el-form-item label="景区id">-->
        <!--<el-input placeholder="景区id"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-input placeholder="景区id或者名称" v-model="searchKey"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchTravel()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="secnicList"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @select="selectTravelPoi"
      @select-all="selectTravelPoiAll"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="scenic_name"
        label="名称"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class="block pagination-wrap-travel pagination-wrap">
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
    <div slot="footer" class="dialog-footer dialog-footer-right">
      <el-button @click="closePoidialog">取 消</el-button>
      <el-button type="primary" @click="submitScenic">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { getTravelScenicList } from '@/api/api'
export default {
  props: ['checkList'],
  data () {
    return {
      currentPage: 1,
      total: 0,
      per_page: 10,
      checkedLists: [],
      searchKey: '',
      secnicList: []
    }
  },
  methods: {
    handleSizeChange (val) {
      this.per_page = val
      getTravelScenicList({per_page: val, searchKey: this.searchKey}).then((response) => {
        this.secnicList = response.data.data.data
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      getTravelScenicList({per_page: this.per_page, page: val, searchKey: this.searchKey}).then((response) => {
        this.secnicList = response.data.data.data
      })
    },
    selectTravelPoi (selection, row) {
      this.checkedLists = selection
    },
    selectTravelPoiAll (selection) {
      this.checkedLists = selection
    },
    closePoidialog () {
      this.$emit('close')
    },
    submitScenic () {
      var params = []
      this.checkedLists.map((item) => {
        if (this.checkList.indexOf(item.id) === -1) {
          params.push(item)
        }
      })
      this.$emit('submit', params)
    },
    searchTravel () {
      const params = {
        per_page: this.per_page,
        searchKey: this.searchKey
      }
      getTravelScenicList(params).then((response) => {
        this.secnicList = response.data.data.data
        this.total = response.data.data.total
      })
    }
  },
  mounted: function () {
    getTravelScenicList({per_page: this.per_page, page: this.currentPage}).then((response) => {
      this.secnicList = response.data.data.data
      this.total = response.data.data.total
    })
  }
}
</script>
<style scoped>
  .pagination-wrap-travel {
    margin-top:20px;
    margin-bottom:20px;
  }
  .dialog-footer-right{
    float:right;
    margin-bottom:20px;
  }
  . {

  }
</style>
