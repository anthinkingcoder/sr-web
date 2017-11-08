<template>
  <Modal
    v-model="visible"
    :title="title"
    :footerHide="true">
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="名称">
        <Input v-model="form.name" placeholder="请输入主题名称"/>
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
          id: 0
        },
        visible: false,
        loading: false,
        title: ''
      }
    },
    methods: {
      show: function (id) {
        this.visible = true
        if (id && id !== 0) {
          this.form.id = id
          this.getTopic()
        }
      },
      submit: function () {
        if (!this.form.name) {
          this.$Message.error('请输入正确的参数')
          return
        }
        this.$http.post('/api/admin/topic/save', qs.stringify({
          name: this.form.name,
          id: this.form.id
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
      },
      getTopic: function () {
        this.$http.get('/api/admin/topic/findOne', {
          params: {
            id: this.form.id
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.form = {
              id: data.id,
              name: data.name
            }
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
