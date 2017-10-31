<template>
  <div>
    <el-row>
      <el-col :span="9">
        <el-alert
        title="0表示不限"
        type="info"
        show-icon
        class="alert-text-wrap"
        :closable="false"
        >
        </el-alert>
      </el-col>
    </el-row>
    <el-form  :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="每个手机号" prop="phone_limit_days">
        <el-input type="text" v-model="ruleForm.phone_limit_days"><template slot="append">天</template></el-input>
      </el-form-item>
      <el-form-item  label="内最多可预购" prop="phone_limit_count">
        <el-input type="text" v-model="ruleForm.phone_limit_count"><template slot="append">张</template></el-input>
      </el-form-item>
      <el-form-item label="每个身份证" prop="id_limit_days">
        <el-input type="text" v-model="ruleForm.id_limit_days">><template slot="append">天</template></el-input>
      </el-form-item>
      <el-form-item label="内最多可预购" prop="id_limit_count">
        <el-input type="text" v-model="ruleForm.id_limit_count"><template slot="append">张</template></el-input>
      </el-form-item>
      <!--<el-form-item label="每个账号订单最大可预天数:" prop="name">
        <el-row>
          <el-col :span="8">
            <el-input type="text" v-model="ruleForm.uid_limit_days"></el-input>
          </el-col>
          <el-col :span="3" :offset="1">
            (单位:天)
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="每个账号订单最大预订数量:" prop="name">
        <el-row>
          <el-col :span="8">
            <el-input type="text" v-model="ruleForm.uid_limit_count"></el-input>
          </el-col>
          <el-col :span="3" :offset="1">
            (单位:张)
          </el-col>
        </el-row>
      </el-form-item>-->
      <el-form-item>
        <el-button type="warning" @click="handleBack">返回上一步</el-button>
        <el-button type="primary" @click="handleValidSub" :loading="SubBtnLoading" :disabled="SubBtnDisabled" v-if="can('dp.ticket.cu_riskControl')">保存进入下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { updateRiskControl, getTicketById } from '@/api/api'
  import ls from '@/common/localStorage.js'
  export default {
    data () {
      return {
        ruleForm: {
          phone_limit_days: '0',
          phone_limit_count: '0',
          id_limit_days: '0',
          id_limit_count: '0',
          uid_limit_days: '',
          uid_limit_count: ''
        },
        SubBtnLoading: false,
        SubBtnDisabled: false,
        rules: {
          phone_limit_days: [
            { required: true, message: '不可为空', trigger: 'blur' }
          ],
          phone_limit_count: [
            { required: true, message: '不可为空', trigger: 'blur' }
          ],
          id_limit_days: [
            { required: true, message: '不可为空', trigger: 'blur' }
          ],
          id_limit_count: [
            { required: true, message: '不可为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleValidSub () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.handleSub()
          } else {
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
        updateRiskControl(params).then((res) => {
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
        ++key
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
          this.ruleForm.phone_limit_days = this.$store.getters.getDataWithStep1345.phone_limit_days.toString()
          this.ruleForm.phone_limit_count = this.$store.getters.getDataWithStep1345.phone_limit_count.toString()
          this.ruleForm.id_limit_days = this.$store.getters.getDataWithStep1345.id_limit_days.toString()
          this.ruleForm.id_limit_count = this.$store.getters.getDataWithStep1345.id_limit_count.toString()
        } else {
          var ticketId = null
          if (!this.$route.query.ticket_id && !ls.getItem('ticketId')) {
            return
          } else {
            ticketId = this.$route.query.ticket_id || ls.getItem('ticketId')
          }
          this.$store.commit('updateProductId', ticketId)
          getTicketById(ticketId).then((res) => {
            this.ruleForm.phone_limit_days = res.data.data.phone_limit_days.toString()
            this.ruleForm.phone_limit_count = res.data.data.phone_limit_count.toString()
            this.ruleForm.id_limit_days = res.data.data.id_limit_days.toString()
            this.ruleForm.id_limit_count = res.data.data.id_limit_count.toString()
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
    .demo-ruleForm{
      width: 700px;
    }
    .alert-text-wrap{
      margin-bottom: 12px;
    }
</style>
