<template>
  <div>
    <router-link :to="{path:'/showChannelAdmin'}">
      <el-button type="primary">返回</el-button>
    </router-link>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" style="width: 400px;">
      <el-form-item label="余额" prop="name">
        <el-input v-model="ruleForm.balance"></el-input>
      </el-form-item>
      <el-form-item label="信用额度(人民币)" prop="name">
        <el-input v-model="ruleForm.credit_value"></el-input>
      </el-form-item>
      <el-form-item label="报警额度(人民币)" prop="name">
        <el-input v-model="ruleForm.warning_value"></el-input>
      </el-form-item>
      <!--<el-form-item label="押金(人民币)" prop="name">-->
      <!--<el-input v-model="ruleForm.name"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="分销商状态" prop="resource">-->
      <!--<el-radio-group v-model="ruleForm.resource">-->
      <!--<el-radio label="启用"></el-radio>-->
      <!--<el-radio label="禁用"></el-radio>-->
      <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { addcredit } from '@/api/api'
  export default {
    data () {
      return {
        ruleForm: {
          dis_id: 0,
          credit_value: '',
          balance: '',
          warning_value: ''
        },
        rules: {
//          name: [
//            { required: true, message: '请输入活动名称', trigger: 'blur' },
//            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
//          ],
//          region: [
//            { required: true, message: '请选择活动区域', trigger: 'change' }
//          ],
//          date1: [
//            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
//          ],
//          date2: [
//            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
//          ],
//          type: [
//            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
//          ],
//          resource: [
//            { required: true, message: '请选择活动资源', trigger: 'change' }
//          ],
//          desc: [
//            { required: true, message: '请填写活动形式', trigger: 'blur' }
//          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
//        this.$refs[formName].validate((valid) => {
//          if (valid) {
//            alert('submit!')
//          } else {
//            console.log('error submit!!')
//            return false
//          }
//        })

        const params = this.ruleForm
        params.dis_id = this.$route.query.dis_id
        addcredit(params).then((response) => {
          if (response.data.data) {
            this.$notify({
              title: '成功',
              message: `设置成功`,
              type: 'success'
            })
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    created: function () {}
  }
</script>
