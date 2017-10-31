<template>
  <div class="login-wrap">
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <!--<p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>-->
      </el-form>
    </div>
  </div>
</template>

<script>
  import { login, userInfo } from '@/api/api'
  export default {
    data: function () {
      return {
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        login({
          grant_type: 'password',
          client_id: 2,
          client_secret: 'XgxZOsMxTvBudPoyncNWNzDMkwJeDw5pMGCZTxEZ',
          username: this.ruleForm.username,
          password: this.ruleForm.password,
          scope: ''
        }).then((res) => {
          localStorage.setItem('currentUser_token', res.data.access_token)
          console.log(localStorage.getItem('currentUser_token'))
          userInfo().then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data))
//            getRules().then((response) => {
//              localStorage.setItem('rules', JSON.stringify(response.data))
            this.$router.push('/')
//            })
          })
        }, (err) => {
          console.log(err)
          this.$message('用户名或者密码错误')
        })
      }
    }
  }
</script>

<style scoped>
  .login-wrap{
    /*position: relative;*/
    width:100%;
    height:100%;
  }
  .ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;
  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
</style>
