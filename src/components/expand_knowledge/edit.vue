<template>
  <Modal
    v-model="visible"
    title="拓展知识"
    width="800"
    :footerHide="true"
    :transfer=transfer>
    <div style="margin-top: 30px"></div>
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="标题">
          <Input v-model="form.name" placeholder="请输入标题"/>
      </Form-item>
      <Form-item label="封面">
        <Col span="6">
        <Upload
          multiple
          action="//127.0.0.1:8088/upload/"
          :on-success="handleSuccess">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
        </Upload>
        </Col>
        <Col span="12">
        <img :src="form.coverUrl" style="max-height: 200px;max-width: 300px">
        </Col>

      </Form-item>
      <Form-item label="摘要">
        <Input v-model="form.summary" type="textarea" size="large" :maxlength="255" placeholder="请输入摘要,最大255个字"/>
      </Form-item>
      <Form-item label="文档内容">
        <ueditor :value="this.form.content" :config="config" ref="ueditor"></ueditor>
      </Form-item>
      <Form-item label="原地址">
        <Input v-model="form.url"/>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="submit">提交</Button>
      </Form-item>
    </Form>
  </Modal>
</template>

<script>
  import qs from 'qs'
  import ueditor from '../../components/ueditor/ueditor.vue'

  export default {
    components: {
      ueditor
    },
    data () {
      return {
        form: {
          name: '',
          url: '',
          summary: '',
          id: 0,
          coverUrl: '',
          content: ''
        },
        visible: false,
        transfer: false,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        }
      }
    },
    methods: {
      show: function (id) {
        this.form.id = id
        this.visible = true
        if (id && id !== 0) {
          this.getExpandKnowledge()
        } else {
          this.form.id = 0
        }
      },
      submit: function () {
        this.form.content = this.$refs.ueditor.getContent()
        if (!this.form.url) {
          this.$Message.error('附件下载地址不存在')
          return
        }
        if (!this.form.name) {
          this.$Message.error('参数填写不完整')
        }
        this.$http.post('/api/admin/expand_knowledge/save', qs.stringify({
          id: this.form.id,
          name: this.form.name,
          url: this.form.url,
          coverUrl: this.form.coverUrl,
          summary: this.form.summary,
          content: this.form.content
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
      getExpandKnowledge: function () {
        this.$http.get('/api/admin/expand_knowledge/findOne', {
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
              url: data.url,
              summary: data.summary,
              name: data.name,
              coverUrl: data.coverUrl,
              content: data.content
            }
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      handleSuccess: function (res, file) {
        this.form.coverUrl = res
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
