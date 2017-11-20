<template>
  <Modal
    v-model="visible"
    :title="title"
    :footerHide="true">
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="名称">
        <Input v-model="form.name" placeholder="请输入类别名称"/>
      </Form-item>
      <Form-item label="简介">
        <Input v-model="form.summary" type="textarea" placeholder="请输入类别名称"/>
      </Form-item>
      <Form-item label="排序">
        <InputNumber :min="0" v-model="form.sort"></InputNumber>
      </Form-item>
      <Form-item label="根类别" v-show="rootCategorySelectVisible">
        <Select v-model="form.parentId" :transfer="true" :clearable="true">
          <Option v-for="item in rootCategories" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
    created () {

    },
    data () {
      return {
        form: {
          name: '',
          id: 0,
          summary: '',
          sort: 0,
          parentId: 0
        },
        rootCategories: [],
        visible: false,
        loading: false,
        title: '',
        rootCategorySelectVisible: true
      }
    },
    methods: {
      show: function (id) {
        this.visible = true
        this.form.id = id
        this.form.summary = ''
        this.form.name = ''
        this.form.sort = 0
        this.listRootCategories()
        if (id && id !== 0) {
          this.getCategory()
        } else {
          this.rootCategorySelectVisible = true
        }
      },
      submit: function () {
        if (!this.form.name) {
          this.$Message.error('请输入正确的参数')
          return
        }
        this.$http.post('/api/admin/question/category/save', qs.stringify({
          name: this.form.name,
          id: this.form.id,
          summary: this.form.summary,
          sort: this.form.sort,
          parentId: this.form.parentId
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
      getCategory: function () {
        this.$http.get('/api/admin/question/category/findOne', {
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
              sort: data.sort,
              parentId: data.parentId
            }
            if (data.depth === 0) {
              this.rootCategorySelectVisible = false
            } else {
              this.rootCategorySelectVisible = true
              this.listRootCategories()
            }
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      listRootCategories: function () {
        this.$http.get('/api/admin/question/category/all', {
          params: {
            depth: 0
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.rootCategories = data
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      handleCoverSuccess: function (res, file) {
        this.form.coverUrl = res
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
