<template>
  <Modal
    v-model="visible"
    :title="title"
    width="1000"
    :transfer=transfer>
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="文档内容">
        <ueditor :value="this.form.content" :config="config" ref="ueditor"></ueditor>
      </Form-item>
      <Form-item>
        <Button type="primary" :loading="loading" @click="submit">提交</Button>
      </Form-item>
    </Form>
  </Modal>
</template>

<script>
  import ueditor from '../../../components/ueditor/ueditor.vue'
  import qs from 'qs'

  export default {
    components: {
      ueditor
    },
    data () {
      return {
        form: {
          id: 0,
          knowledgeId: 0,
          content: ''
        },
        transfer: false,
        visible: false,
        title: '上传资源文档',
        loading: false,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        }
      }
    },
    methods: {
      submit: function () {
        if (!this.form.knowledgeId) {
          this.$Message.error('请输入正确的参数')
          return
        }
        this.form.content = this.$refs.ueditor.getContent()
        this.$http.post('/api/admin/resource_document/save', qs.stringify({
          content: this.form.content,
          knowledgeId: this.form.knowledgeId,
          id: this.form.id
        })).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.visible = false
            this.$emit('update')
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      show: function (knowledgeId, id) {
        console.info(knowledgeId, id)
        this.form.id = id
        this.form.knowledgeId = knowledgeId
        this.visible = true
        if (id && id !== 0) {
          this.getDocument()
        }
      },
      getDocument: function () {
        this.$http.get('/api/admin/resource_document/findOne', {
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
              content: data.content,
              knowledgeId: this.form.knowledgeId
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
