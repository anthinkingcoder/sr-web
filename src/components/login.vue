<template>
  <div class="login">
    <div class="panel">
      <h2><Avatar src="/static/img/java.jpg" size="large" /></h2>
      <Input v-model="username" placeholder="用户名" style="width: 402px;" size="large"  @on-enter="login">
      </Input>
      <Input type="password" v-model="password" placeholder="密码"
             style="margin-top: 20px;width: 402px" size="large" @on-enter="login">
      </Input>
      <Button class="loginBtn" type="primary" :loading="loading" shape="circle" size="large" @click="login"
              style="width: 400px;height: 48px;margin-top: 30px;background-color: #495060;border-color:#495060">
        <span v-if="!loading">登录</span>
      </Button>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  export default{
    created () {
      this.getUser()
    },
    data () {
      return {
        username: '',
        password: '',
        loading: false
      }
    },
    methods: {
      login () {
        if (!this.username || !this.password) {
          this.$Message.error('请输入账号和密码')
          return
        }
        this.loading = true
        this.$http.post('/api/admin/login', qs.stringify({
          password: this.password,
          username: this.username
        })).then((response) => {
          this.loading = false
          let res = response.data
          if (res.code === 666) {
            this.$router.push({
              path: '/admin/main'
            })
          }
        }).catch(() => {
          this.loading = false
          this.$Message.error('登陆失败，请稍候再试')
        })
      },
      getUser () {
        this.$http.get('/api/admin/user/userinfo').then((response) => {
          this.loading = false
          let res = response.data
          if (res.code === 666) {
            this.$router.push({
              path: '/admin/main'
            })
          }
        }).catch(() => {
          this.loading = false
          this.$Message.error('登陆失败，请稍候再试')
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-input-large
    font-size 14px;
    padding 6px 7px;
    height 48px;

  .ivu-avatar-large
    width 80px
    height 80px
    line-height 30px
    border-radius 40px
  .login
    display flex
    flex-direction column
    justify-content center
    align-items center
    background-size cover
    height 100%
    background-image url("../../static/img/background.jpg")
    .panel
      margin-top -60px
      display flex
      flex-direction column
      align-items center
      border-radius 10px;
      background rgba(255, 255, 255, 0)
      width 450px
      height 360px
      text-align center
      h2
        margin-top 30px
        margin-bottom 20px
        font-size 25px
        font-weight 400
        color: #323a45
      .loginBtn
        font-size 24px
        font-weight 400
        color: #ffffff
        img
          background rgba(255, 255, 255, 0)
    border-radius 5px


</style>
