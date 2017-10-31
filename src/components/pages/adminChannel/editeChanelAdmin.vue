<template>
  <div>
    <router-link :to="{path:'/showChannelAdmin'}">
      <el-button type="primary">返回</el-button>
    </router-link>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="分销商类型" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="ota"></el-radio>
          <el-radio label="其他"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分销商名称" prop="name">
        <el-input v-model="ruleForm.name"  placeholder="请输入分销商名称">></el-input>
      </el-form-item>
      <el-form-item label="分销商code" prop="name">
        <el-input v-model="ruleForm.name"  placeholder="请输入分销商code">></el-input>
      </el-form-item>
      <el-form-item label="开启通知" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="启用"></el-radio>
          <el-radio label="禁用"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="通知URL地址" prop="name">
        <el-input v-model="ruleForm.name"  placeholder="请输入通知URL地址">></el-input>
      </el-form-item>
      <el-form-item label="开启余额" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="启用"></el-radio>
          <el-radio label="禁用"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
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
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
