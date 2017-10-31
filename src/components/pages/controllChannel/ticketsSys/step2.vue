<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item label="包含项目" prop="name0" >
      <el-input type="textarea" v-model="ruleForm.contain_projects" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="不包含项目" prop="name1">
      <el-input type="textarea" v-model="ruleForm.exclusive_projects" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="补充说明" prop="name2">
      <el-input type="textarea" v-model="ruleForm.user_type_note" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="兑换方式" prop="name3">
      <el-input type="textarea" v-model="ruleForm.voucher_way" :rows="4"></el-input>
    </el-form-item>
    <!--<el-form-item label="取票地点" prop="name4">
      <el-input type="textarea" v-model="ruleForm.name4"></el-input>
    </el-form-item>-->
    <el-form-item label="取票时间" prop="name5">
      <el-input type="textarea" v-model="ruleForm.voucher_time" :rows="4"></el-input>
    </el-form-item>
    <!--<el-form-item label="入园地点" prop="name6">
      <el-input type="textarea" v-model="ruleForm.use_addr"></el-input>
    </el-form-item>
    <el-form-item label="入园时间" prop="name7">
      <el-input type="textarea" v-model="ruleForm.use_time"></el-input>
    </el-form-item>
    <el-form-item label="入园方式" prop="name8">
      <el-input type="textarea" v-model="ruleForm.use_way"></el-input>
    </el-form-item>-->
    <el-form-item label="重要条款" prop="name9">
      <el-input type="textarea" v-model="ruleForm.important_note" :rows="4"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="warning" @click="handleBack">返回上一步</el-button>
      <el-button type="primary" @click="handleSub" :loading="SubBtnLoading" :disabled="SubBtnDisabled" v-if="can('dp.ticket.cu_buyNote')">保存进入下一步</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { updateOrCreateBuyNote, getBuyNoteByProductId } from '@/api/api'
  import ls from '@/common/localStorage.js'
  export default {
    data () {
      return {
        ruleForm: {
          contain_projects: '',
          exclusive_projects: '',
          user_type_note: '',
          voucher_way: '',
          voucher_addr: '',
          voucher_time: '',
          use_addr: '',
          use_time: '',
          use_way: '',
          important_note: ''
        },
        SubBtnLoading: false,
        SubBtnDisabled: false,
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
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
      handleSub () {
        this.SubBtnLoading = true
        this.SubBtnDisabled = true
        var params = this.ruleForm
        if (this.$route.query.ticket_id) {
          params.id = this.$route.query.ticket_id
        } else {
          params.id = this.$store.getters.getTicketId
        }
        console.log(params)
        updateOrCreateBuyNote(params).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
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
        var ticketId = null
        if (!this.$route.query.ticket_id && !ls.getItem('ticketId')) {
          return
        } else {
          ticketId = this.$route.query.ticket_id || ls.getItem('ticketId')
        }
        var params = {
          product_id: ticketId
        }
        getBuyNoteByProductId(params).then((res) => {
          if (!res.data.data) {
            return
          }
          this.ruleForm = res.data.data
        })
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
    .demo-ruleForm{
      width: 600px;
    }
</style>
