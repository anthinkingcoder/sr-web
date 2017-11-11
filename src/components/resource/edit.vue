<template>
  <Modal
    v-model="visible"
    title="相关资源"
    width="800"
    :footerHide="true">
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="名称">
        <Input v-model="form.name" placeholder="请输入名称"/>
      </Form-item>
      <Form-item label="封面">
        <Col span="6">
        <Upload
          multiple
          action="//127.0.0.1:8088/upload/"
          :on-success="handleCoverSuccess"
        >
          <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
        </Upload>
        </Col>
        <Col span="12">
        <img :src="form.coverUrl" style="max-height: 200px;max-width: 300px">
        </Col>
      </Form-item>
      <Form-item label="摘要">
        <Input v-model="form.summary" type="textarea" placeholder="请输入作品摘要"/>
      </Form-item>
      <Form-item label="类别">
        <Select v-model="form.category" :transfer="true" :clearable="true" @on-change="categorySelect">
          <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="资源">
        <Col span="12">
        <Input v-model="form.url" :disabled="urlDisable"/>
        </Col>
        <Col span="12">
        <Upload
          multiple
          action="//127.0.0.1:8088/upload/"
          :on-success="handleSuccess"
          v-show="uploadVisible">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
        </Upload>
        </Col>

      </Form-item>
      <Form-item>
        <Button type="primary" :loading="loading" @click="submit">提交</Button>
      </Form-item>
    </Form>
  </Modal>

</template>

<script>
  import qs from 'qs'
  import ueditor from '../ueditor/ueditor.vue'

  export default {
    data () {
      return {
        form: {
          id: 0,
          name: '',
          coverUrl: '',
          summary: '',
          url: '',
          category: 0
        },
        visible: false,
        loading: false,
        uploadVisible: true,
        urlDisable: true,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        },
        categoryList: [
          {
            id: 1,
            name: '电子书'
          },
          {
            id: 2,
            name: '软件资源'
          },
          {
            id: 3,
            name: '优秀网站'
          }
        ]
      }
    },
    components: {
      ueditor
    },
    methods: {
      show: function (id) {
        this.visible = true
        if (id && id !== 0) {
          this.form.id = id
          this.getResource()
        } else {
          this.form.id = 0
        }
      },
      submit: function () {
        if (!this.form.name || !this.form.url || !this.form.category) {
          this.$Message.error('参数未填写完整')
          return
        }
        this.$http.post('/api/admin/resource/save', qs.stringify({
          name: this.form.name,
          id: this.form.id,
          coverUrl: this.form.coverUrl,
          url: this.form.url,
          summary: this.form.summary,
          category: this.form.category
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
      categorySelect: function (value) {
        if (value === 3) {
          this.urlDisable = false
          this.uploadVisible = false
        } else {
          this.urlDisable = true
          this.uploadVisible = true
        }
      },
      handleCoverSuccess: function (res, file) {
        this.form.coverUrl = res
      },
      handleSuccess: function (res, file) {
        this.form.url = res
      },
      getResource: function () {
        this.$http.get('/api/admin/resource/findOne', {
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
              name: data.name,
              summary: data.summary,
              coverUrl: data.coverUrl,
              url: data.url,
              content: data.content,
              category: data.category
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
