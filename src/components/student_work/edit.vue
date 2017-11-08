<template>
  <Modal
    v-model="visible"
    title="学生作品"
    width="800"
    :footerHide="true">
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="标题">
        <Input v-model="form.title" placeholder="请输入作品标题"/>
      </Form-item>
      <Form-item label="作者">
        <Input v-model="form.author" placeholder="请输入作者名称,多个以,分隔"/>
      </Form-item>
      <Form-item label="摘要">
        <Input v-model="form.summary" type="textarea" placeholder="请输入作品摘要"/>
      </Form-item>
      <Form-item label="类别">
        <Select v-model="form.category" :transfer="true" :clearable="true">
          <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </Form-item>

      <Form-item label="效果展示">
        <ueditor :value="form.content" :config="config" ref="ueditor"></ueditor>
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
          title: '',
          author: '',
          summary: '',
          content: '',
          category: 0
        },
        visible: false,
        loading: false,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        },
        categoryList: [
          {
            id: 1,
            name: '课程设计'
          },
          {
            id: 2,
            name: '项目实训'
          },
          {
            id: 3,
            name: '大赛作品'
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
          this.getStudentWork()
        }
      },
      submit: function () {
        this.form.content = this.$refs.ueditor.getContent()
        if (!this.form.title || !this.form.author || !this.form.summary || !this.form.content || !this.form.category) {
          this.$Message.error('参数未填写完整')
          return
        }
        this.$http.post('/api/admin/student_work/save', qs.stringify({
          name: this.form.name,
          id: this.form.id,
          title: this.form.title,
          author: this.form.author,
          summary: this.form.summary,
          content: this.form.content,
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
      getStudentWork: function () {
        this.$http.get('/api/admin/student_work/findOne', {
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
              title: data.title,
              summary: data.summary,
              author: data.author,
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
