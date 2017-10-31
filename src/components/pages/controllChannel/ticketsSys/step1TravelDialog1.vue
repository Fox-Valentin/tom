<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <!--<el-form-item label="景区id">-->
        <!--<el-input placeholder="景区id"></el-input>-->
      <!--</el-form-item>-->
      <template v-if="priceType === '1'">
        <el-form-item>
          <el-input placeholder="景区id或者名称" v-model="scenic_key"></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="searchTravel()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <div class="block">
          <span class="demonstration">默认</span>
          <el-date-picker
            v-model="daterangeDate"
            type="daterange"
            :picker-options="pickerOptions1"
            format="yyyy-MM-dd"
            placeholder="选择日期范围">
          </el-date-picker>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="priceType === '1'">
      <el-collapse v-model="activeNames">
        <template v-for="list in lists">
          <el-collapse-item :title=" list.scenic_name ">
            <el-radio-group v-model="price_id">
              <template v-for="price in list.scenic_prices">
                <div class="scenicListWrap">
                  <el-radio :label="price.id">(id:{{price.id}})--{{price.price_name}}</el-radio>
              </div>
              </template>
            </el-radio-group>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
    <div v-else>
      <el-radio-group v-model="price_id">
        <template v-for="list in lists">
          <div class="scenicListWrap">
            <el-radio :label="list.id">{{list.id}}--{{list.name}}</el-radio>
          </div>
        </template>
      </el-radio-group>
    </div>
    <div class="block pagination-wrap-poi pagination-wrap">
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
    <div slot="footer" class="dialog-footer dialog-footer-right">
        <el-button @click="closeTravelPoiDialog">取 消</el-button>
        <el-button type="primary" @click="submitPrice">确 定</el-button>
      </div>
  </div>
</template>
<script>
import { getTravelScenicToTicketsList, getTravelTicketGroup } from '@/api/api'
export default {
  props: ['priceType'],
  data () {
    return {
      lists: [],
      price_type: '1',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      price_id: 0,
      activeNames: ['1'],
      scenic_key: '',
      daterangeDate: '',
      pickerOptions1: {
        disabledDate (time) {
          return time < new Date('2017-10-30T16:00:00.000Z')
        }
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getHandle()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getHandle()
    },
    closeTravelPoiDialog () {
      this.$emit('close')
    },
    submitPrice () {
      this.$emit('submitPriceId', this.price_id)
      this.$emit('close')
    },
    getHandle () {
      var params = {
        pageSize: this.pageSize,
        page: this.currentPage,
        searchKey: this.scenic_key
      }
      if (this.priceType === '1') {
        getTravelScenicToTicketsList(params).then((response) => {
          this.lists = response.data.data.data
          this.total = response.data.data.total
        })
      } else {
        getTravelTicketGroup(params).then((response) => {
          this.lists = response.data.data.data
          this.total = response.data.data.total
        })
      }
    },
    searchTravel () {
      var params = {
        pageSize: this.pageSize,
        page: this.currentPage,
        searchKey: this.scenic_key
      }
      if (this.priceType === '1') {
        getTravelScenicToTicketsList(params).then((response) => {
          this.lists = response.data.data.data
          this.total = response.data.data.total
        })
      }
    }
  },
  mounted () {
    this.getHandle()
  }
}
</script>
<style scoped>
  .scenicListWrap{
    padding-top:10px;
    padding-bottom:10px;
  }
  .pagination-wrap-poi {
    margin-top:20px;
    margin-bottom:20px;
  }
  .dialog-footer-right{
    float:right;
    margin-bottom:20px;
  }
</style>
