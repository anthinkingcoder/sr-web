<template>
  <Modal
    v-model="visible"
    :title="title"
    :footerHide="true">
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="名称">
        <Input v-model="form.name" placeholder="请输入主题名称"/>
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
      <Form-item label="所属专题类别">
        <Select v-model="form.categoryId" filterable :transfer="true">
          <Option v-for="item in categories" :value="item.id" :key="item.id">{{ item.name}}</Option>
        </Select>
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
          coverUrl: ''
        },
        visible: false,
        loading: false,
        title: '',
        categories: []
      }
    },
    methods: {
      show: function (id) {
        this.visible = true
        if (id && id !== 0) {
          this.form.id = id
          this.getTopic()
        }
        this.listTopicCategory()
      },
      submit: function () {
        if (!this.form.name) {
          this.$Message.error('请输入正确的参数')
          return
        }
        this.$http.post('/api/admin/topic/save', qs.stringify({
          name: this.form.name,
          id: this.form.id,
          coverUrl: this.form.coverUrl,
          categoryId: this.form.categoryId
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
      },
      handleCoverSuccess: function (res, file) {
        this.form.coverUrl = res
      },
      listTopicCategory: function () {
        this.$http.get('/api/admin/topic/category/list', {
          params: {
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.categories = data
          } else {
            this.$Message.error('服务器错误,请重试')
          }
        }).catch(() => {
          this.loading = false
          this.$Message.error('服务器错误,请重试')
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
