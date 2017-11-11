<template>
  <Modal
    v-model="visible"
    :title="title"
    :footerHide="true"
    :transfer="transfer"
  >
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="知识名称">
        <Input v-model="form.name" placeholder="请输入知识点名称"/>
      </Form-item>
      <Form-item label="排序">
        <InputNumber :min="0" v-model="form.sort"></InputNumber>
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
          id: 0,
          sort: 0,
          level: 1,
          topic: 0
        },
        visible: false,
        loading: false,
        transfer: false,
        title: ''
      }
    },
    methods: {
      show: function (title, level, id, topicId) {
        this.visible = true
        this.title = title
        this.form.level = level
        if (topicId && topicId !== 0) {
          this.form.topicId = topicId
        }
        if (id && id !== 0) {
          this.form.id = id
          this.getKnowledge()
        } else {
          this.form.id = 0
        }
      },
      submit: function () {
        if (!this.form.name) {
          this.$Message.error('请输入正确的参数')
          return
        }
        this.$http.post('/api/admin/knowledge/save', qs.stringify({
          name: this.form.name,
          sort: this.form.sort,
          level: this.form.level,
          id: this.form.id,
          topicId: this.form.topicId
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
      getKnowledge: function () {
        this.$http.get('/api/admin/knowledge/findOne', {
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
              level: data.level,
              sort: data.sort,
              name: data.name,
              topicId: data.topicId
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
