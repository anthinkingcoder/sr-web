<template>
  <Modal
    v-model="visible"
    width="1000"
    :footerHide="true"
    :transfer=transfer>
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="实例题目">
        <Input v-model="form.title" type="textarea" placeholder="请输入实例题目"/>
      </Form-item>
      <Form-item label="实例内容">
        <ueditor :value="form.content" :config="config" ref="contentUeditor"></ueditor>
      </Form-item>
      <Form-item label="实例讲解">
        <ueditor :value="form.explain" :config="config" ref="explainUeditor"></ueditor>
      </Form-item>
      <Form-item label="运行结果">
        <ueditor :value="form.result" :config="config" ref="resultUeditor"></ueditor>
      </Form-item>
      <Form-item label="所属专题">
        <Select v-model="form.topicId" filterable :transfer="true" @on-change="topicSelectChange" :clearable="true">
          <Option v-for="item in topicList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="所属知识点">
        <Select v-model="form.knowledgeId" filterable :transfer="true">
          <Option v-for="item in knowledgeList" :value="item.id" :key="item.id">{{ item.name}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" :loading="loading" @click="submit">提交</Button>
      </Form-item>
    </Form>
  </Modal>
</template>

<script>
  import ueditor from '../../components/ueditor/ueditor.vue'
  import qs from 'qs'

  export default {
    created () {
      this.listTopic()
      this.listKnowledge()
    },
    components: {
      ueditor
    },
    data () {
      return {
        form: {
          id: 0,
          knowledgeId: 0,
          topicId: 0,
          content: '',
          result: '',
          explain: '',
          title: ''
        },
        transfer: false,
        visible: false,
        loading: false,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        },
        topicList: [],
        knowledgeList: []
      }
    },
    methods: {
      listTopic () {
        this.loading = true
        this.$http.get('/api/admin/topic/all', {
          params: {}
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            console.info(data)
            this.topicList = data
          } else {
            this.$Message.error('服务器错误,请重试')
          }
        }).catch(() => {
          this.loading = false
          this.$Message.error('服务器错误,请重试')
        })
      },
      listKnowledge (topicId) {
        var url = ''
        var params = {}
        if (topicId && topicId !== 0) {
          url = '/api/admin/knowledge/topic/all'
          params = {
            topicId: topicId
          }
        } else {
          url = '/api/admin/knowledge/all'
          params = {
            level: 1
          }
        }
        this.$http.get(url, {
          params: params
        }).then((response) => {
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.knowledgeList = data
          } else {
            this.$Message.error('服务器错误,请重试')
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      submit: function () {
        this.form.content = this.$refs.contentUeditor.getContent()
        this.form.explain = this.$refs.explainUeditor.getContent()
        this.form.result = this.$refs.resultUeditor.getContent()
        if (!this.form.content || !this.form.explain || !this.form.title || !this.form.result) {
          this.$Message.error('参数未填写完整')
          return
        }
        this.$http.post('/api/admin/example/save', qs.stringify({
          title: this.form.title,
          content: this.form.content,
          explain: this.form.explain,
          id: this.form.id,
          result: this.form.result,
          topicId: this.form.topicId,
          knowledgeId: this.form.knowledgeId
        })).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.visible = false
            this.$emit('update', 1)
            this.$Message.success('编辑成功')
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      show: function (knowledgeId, topicId, id) {
        this.form.id = id
        this.form.knowledgeId = knowledgeId
        this.form.topicId = topicId
        this.visible = true
        if (id && id !== 0) {
          this.getExample()
        }
      },
      getExample: function () {
        this.$http.get('/api/admin/example/findOne', {
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
              knowledgeId: this.form.knowledgeId,
              topicId: this.form.topicId,
              explain: data.exampleExplain,
              result: data.runtimeResult,
              title: data.title
            }
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      topicSelectChange (value) {
        this.form.topicId = value
        this.listKnowledge(value)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
