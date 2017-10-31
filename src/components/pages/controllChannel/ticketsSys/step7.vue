<template>
  <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item label="返码类型">
      <el-radio-group v-model="ruleForm.self_type">
        <el-radio label="N">否</el-radio>
        <el-radio label="Y">是</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否自营">
      <el-radio-group v-model="ruleForm.voucher_type">
        <el-radio label="N">否</el-radio>
        <el-radio label="Y">是</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="warning" @click="handleBack">返回上一步</el-button>
      <el-button type="primary" @click="handleSub" :loading="SubBtnLoading" :disabled="SubBtnDisabled">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { updateTicketOther, getTicketById } from '@/api/api'
  import ls from '@/common/localStorage.js'
  export default {
    data () {
      return {
        ruleForm: {
          self_type: 'Y',
          voucher_type: 'Y'
        },
        SubBtnLoading: false,
        SubBtnDisabled: false
      }
    },
    methods: {
      handleSub () {
        this.SubBtnLoading = true
        this.SubBtnDisabled = true
        var params = this.ruleForm
        if (this.$route.query.ticket_id) {
          params.id = this.$route.query.ticket_id
        } else {
          params.id = this.$store.getters.getTicketId
        }
        updateTicketOther(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$store.commit('updateDataWithStep1345', null)
          } else {
            this.$message({
              message: '提交失败',
              type: 'warning'
            })
          }
          this.SubBtnLoading = false
          this.SubBtnDisabled = false
        })
      },
      handleBack () {
        var key = Number(this.$store.getters.getActiveKey)
        var activeNames = this.$store.getters.getActiveNames
        if (key <= 0) {
          return
        }
        key--
        var activeName = activeNames[key]
        this.$store.commit('updateActiveKey', key)
        this.$emit('changeTab', activeName)
      },
      handleGet () {
        if (this.$store.getters.getDataWithStep1345 && this.$store.getters.getDataWithStep1345.ticket_name) {
          this.ruleForm.self_type = this.$store.getters.getDataWithStep1345.self_type
          this.ruleForm.voucher_type = this.$store.getters.getDataWithStep1345.voucher_type
        } else {
          var ticketId = null
          if (!this.$route.query.ticket_id && !ls.getItem('ticketId')) {
            return
          } else {
            ticketId = this.$route.query.ticket_id || ls.getItem('ticketId')
          }
          this.$store.commit('updateProductId', ticketId)
          getTicketById(ticketId).then((res) => {
            this.ruleForm.self_type = res.data.data.self_type
            this.ruleForm.voucher_type = res.data.data.voucher_type
          })
        }
      }
    },
    mounted () {
      this.handleGet()
    }
  }
</script>
<style scoped>
    .el-form--inline .el-form-item{
      margin-right: 0px;
    }
</style>
