<template>
  <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item label="信息类型" prop="resource">
      <el-radio-group v-model="ruleForm.visitor_mode">
        <el-radio label="0">不需要</el-radio>
        <el-radio label="1">每单仅需一名游玩人信息</el-radio>
        <el-radio label="2" :disabled="visitor_mode_disabled">每张票需要一名游玩人信息</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-show="false">
      <el-form-item label="是否需要中文姓名" prop="resource">
        <el-radio-group v-model="ruleForm.name">
          <el-radio label="0">需要</el-radio>
          <el-radio label="1">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否需要姓名拼音" prop="resource">
        <el-radio-group v-model="ruleForm.pinyin">
          <el-radio label="0">需要</el-radio>
          <el-radio label="1">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否需要电话" prop="resource">
        <el-radio-group v-model="ruleForm.mobile">
          <el-radio label="0">需要</el-radio>
          <el-radio label="1">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否需要性别" prop="resource">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="0">需要</el-radio>
          <el-radio label="1">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否需要邮箱地址" prop="resource">
        <el-radio-group v-model="ruleForm.email">
          <el-radio label="0">需要</el-radio>
          <el-radio label="1">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所需证件类型" prop="resource">
        <el-radio-group v-model="ruleForm.idType">
          <el-radio label="0">不需要</el-radio>
          <el-radio label="1">身份证</el-radio>
          <el-radio label="2">护照</el-radio>
          <el-radio label="3">军官证</el-radio>
          <el-radio label="4">士兵证</el-radio>
          <el-radio label="5">台胞证</el-radio>
          <el-radio label="6">回乡证</el-radio>
          <el-radio label="7">台湾通行证</el-radio>
          <el-radio label="8">港澳通行证</el-radio>
          <el-radio label="9">户口簿</el-radio>
          <el-radio label="10">出生证明</el-radio>
          <el-radio label="11">其他</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <el-form-item>
      <el-button type="warning" @click="handleBack">返回上一步</el-button>
      <el-button type="primary" @click="handleSub" :loading="SubBtnLoading" :disabled="SubBtnDisabled" v-if="can('dp.ticket.cu_visitorInfoRule')">保存进入下一步</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { updateVisitorInfoRule, getTicketById } from '@/api/api'
  import ls from '@/common/localStorage.js'
  export default {
    data () {
      return {
        ruleForm: {
          visitor_mode: '0',
          name: null,
          pinyin: null,
          mobile: null,
          gender: null,
          email: null,
          idType: null
        },
        SubBtnLoading: false,
        SubBtnDisabled: false,
        visitor_mode_disabled: false
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      handleSub () {
        this.SubBtnLoading = true
        this.SubBtnDisabled = true
        var params = this.ruleForm
        if (this.$route.query.ticket_id) {
          params.id = this.$route.query.ticket_id
        } else {
          params.id = this.$store.getters.getTicketId
        }
        updateVisitorInfoRule(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$store.commit('updateDataWithStep1345', null)
            this.handleNext()
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
      handleNext () {
        var key = Number(this.$store.getters.getActiveKey)
        var activeNames = this.$store.getters.getActiveNames
        if (key >= activeNames.length) {
          return
        }
        key++
        var activeName = activeNames[key]
        this.$store.commit('updateActiveKey', key)
        this.$emit('changeTab', activeName)
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
          this.ruleForm.visitor_mode = this.$store.getters.getDataWithStep1345.visitor_mode !== undefined ? this.$store.getters.getDataWithStep1345.visitor_mode.toString() : null
          this.ruleForm.name = this.$store.getters.getDataWithStep1345.name !== undefined ? this.$store.getters.getDataWithStep1345.name.toString() : null
          this.ruleForm.pinyin = this.$store.getters.getDataWithStep1345.pinyin !== undefined ? this.$store.getters.getDataWithStep1345.pinyin.toString() : null
          this.ruleForm.mobile = this.$store.getters.getDataWithStep1345.mobile !== undefined ? this.$store.getters.getDataWithStep1345.mobile.toString() : null
          this.ruleForm.gender = this.$store.getters.getDataWithStep1345.gender !== undefined ? this.$store.getters.getDataWithStep1345.gender.toString() : null
          this.ruleForm.email = this.$store.getters.getDataWithStep1345.email !== undefined ? this.$store.getters.getDataWithStep1345.email.toString() : null
          if (this.$store.getters.getDataWithStep1345.part_refund === '0') {
            this.visitor_mode_disabled = true
          }
        } else {
          var ticketId = null
          if (!this.$route.query.ticket_id && !ls.getItem('ticketId')) {
            return
          } else {
            ticketId = this.$route.query.ticket_id || ls.getItem('ticketId')
          }
          this.$store.commit('updateProductId', ticketId)
          getTicketById(ticketId).then((res) => {
            this.ruleForm.visitor_mode = res.data.data.visitor_mode !== undefined ? res.data.data.visitor_mode.toString() : null
            this.ruleForm.name = res.data.data.name !== undefined ? res.data.data.name.toString() : null
            this.ruleForm.pinyin = res.data.data.pinyin !== undefined ? res.data.data.pinyin.toString() : null
            this.ruleForm.mobile = res.data.data.mobile !== undefined ? res.data.data.mobile.toString() : null
            this.ruleForm.gender = res.data.data.gender !== undefined ? res.data.data.gender.toString() : null
            this.ruleForm.email = res.data.data.email !== undefined ? res.data.data.email.toString() : null
            if (res.data.data.part_refund === '0') {
              this.visitor_mode_disabled = true
            }
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
