<template>
  <Modal
    v-model="visible"
    title="附件"
    width="600"
    :footerHide="true"
    :transfer=transfer>
    <div style="margin-top: 30px"></div>
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="附件名称">
        <Input v-model="form.name" placeholder="请输入附件名称"/>
      </Form-item>
      <Form-item label="附件地址">
        <Input v-model="form.url" :disabled="disabled"/>
      </Form-item>
      <Upload
        multiple
        type="drag"
        action="//127.0.0.1:8088/upload/"
        :on-success="handleSuccess"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52"></Icon>
          <p>点击上传附件</p>
        </div>
      </Upload>
      <Form-item label="排序">
        <InputNumber :min="0" v-model="form.sort"></InputNumber>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="submit">提交</Button>
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
          url: '',
          sort: 0,
          moduleId: 0,
          moduleCategory: 0,
          id: 0
        },
        visible: false,
        transfer: false,
        disabled: true
      }
    },
    methods: {
      show: function (moduleId, moduleCategory, id) {
        this.form.moduleId = moduleId
        this.form.moduleCategory = moduleCategory
        this.form.id = id
        this.visible = true
        if (id && id !== 0) {
          this.getAttachment()
        }
      },
      handleSuccess (res, file) {
        this.form.url = res
      },
      submit: function () {
        if (!this.form.url) {
          this.$Message.error('附件下载地址不存在')
          return
        }
        if (!this.form.name) {
          this.$Message.error('参数填写不完整')
        }
        this.$http.post('/api/admin/attachment/save', qs.stringify({
          id: this.form.id,
          name: this.form.name,
          url: this.form.url,
          sort: this.form.sort,
          moduleId: this.form.moduleId,
          moduleCategory: this.form.moduleCategory
        })).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.visible = false
            this.$emit('update', this.form.moduleId, this.form.moduleCategory)
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      getAttachment: function () {
        this.$http.get('/api/admin/attachment/findOne', {
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
              sort: data.sort,
              name: data.name,
              moduleId: this.form.moduleId,
              moduleCategory: this.form.moduleCategory
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
