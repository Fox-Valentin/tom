<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-button @click="printUser">测试mock</el-button>
  </div>
</template>

<script>
  import { getdisticket } from '../api/api'
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    methods: {
      printUser: () => {
//        getUser();
        getdisticket()
      }
    },
    created: function () {
//      getdisticket()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
