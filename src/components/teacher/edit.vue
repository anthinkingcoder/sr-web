<template>
  <Modal
    v-model="visible"
    :title="title"
    :footerHide="true">
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="名称">
        <Input v-model="form.name" placeholder="请输入教师名称"/>
      </Form-item>
      <Form-item label="账户">
        <Input v-model="form.username" placeholder="请输入教师账户"/>
      </Form-item>
      <Form-item label="密码">
        <Input v-model="form.password" placeholder="请输入教师密码"/>
      </Form-item>
      <Form-item>
        <Button type="primary" :loading="loading" @click="submit">提交</Button>
      </Form-item>
    </Form>
  </Modal>

</template>

<script>
  import qs from 'qs'

  export default {
    data () {
      return {
        form: {
          name: '',
          username: '',
          password: ''
        },
        visible: false,
        loading: false,
        title: ''
      }
    },
    methods: {
      show: function () {
        this.visible = true
      },
      submit: function () {
        if (!this.form.name || !this.form.username || !this.form.password) {
          this.$Message.error('请输入正确的参数')
          return
        }
        this.$http.post('/api/admin/teacher/save', qs.stringify({
          name: this.form.name,
          username: this.form.username,
          password: this.form.password
        })).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.visible = false
            this.$emit('update', 1)
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
