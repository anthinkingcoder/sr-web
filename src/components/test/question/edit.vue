<template>
  <Modal
    v-model="visible"
    :title="title"
    width="800"
    :footerHide="true">
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Form-item label="题目标题">
        <Input v-model="form.title" placeholder="请输入题目标题"/>
      </Form-item>
      <Form-item label="题目内容">
        <ueditor :value="form.content" :config="config" ref="ueditor"></ueditor>
      </Form-item>
      <Form-item label="难度级别">
        <Rate v-model="form.level"></Rate>
      </Form-item>
      <Form-item label="答案类型">
        <RadioGroup v-model="answerCategoryText" @on-change="answerCategoryRadio">
          <Radio label="单选"></Radio>
          <Radio label="多选"></Radio>
        </RadioGroup>
      </Form-item>
      <Form-item label="可能答案A">
        <Input v-model="form.possibleAnswer1" placeholder="答案A"/>
      </Form-item>
      <Form-item label="可能答案B">
        <Input v-model="form.possibleAnswer2" placeholder="答案B"/>
      </Form-item>
      <Form-item label="可能答案C">
        <Input v-model="form.possibleAnswer3" placeholder="答案C"/>
      </Form-item>
      <Form-item label="可能答案D">
        <Input v-model="form.possibleAnswer4" placeholder="答案D"/>
      </Form-item>
      <Form-item label="可能答案E">
        <Input v-model="form.possibleAnswer5" placeholder="答案E"/>
      </Form-item>
      <Form-item label="可能答案F">
        <Input v-model="form.possibleAnswer6" placeholder="答案F"/>
      </Form-item>
      <Form-item label="选择答案">
        <RadioGroup v-model="form.answer" v-if="answerCategoryText === '单选'">
          <Radio label="A" v-if="form.possibleAnswer1"></Radio>
          <Radio label="B" v-if="form.possibleAnswer2"></Radio>
          <Radio label="C" v-if="form.possibleAnswer3"></Radio>
          <Radio label="D" v-if="form.possibleAnswer4"></Radio>
          <Radio label="E" v-if="form.possibleAnswer5"></Radio>
          <Radio label="F" v-if="form.possibleAnswer6"></Radio>
        </RadioGroup>
        <CheckboxGroup v-model="form.checkboxAnswer" v-else>
          <Checkbox label="A" v-if="form.possibleAnswer1"></Checkbox>
          <Checkbox label="B" v-if="form.possibleAnswer2"></Checkbox>
          <Checkbox label="C" v-if="form.possibleAnswer3"></Checkbox>
          <Checkbox label="D" v-if="form.possibleAnswer4"></Checkbox>
          <Checkbox label="E" v-if="form.possibleAnswer5"></Checkbox>
          <Checkbox label="F" v-if="form.possibleAnswer6"></Checkbox>
        </CheckboxGroup>
      </Form-item>
      <Form-item label="答案解析">
        <Input v-model="form.explain" type="textarea" placeholder="请输入答案解析">
        </Input>
      </Form-item>
      <Form-item label="题目类别">
        <Select v-model="form.categoryId" :transfer="true" :clearable="true">
          <Option v-for="item in categories" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
  import ueditor from '../../../components/ueditor/ueditor.vue'

  export default {
    components: {
      ueditor
    },
    created () {
    },
    data () {
      return {
        form: {
          name: '',
          id: 0,
          title: '',
          level: 1,
          categoryId: 0,
          answerCategory: 0,
          possibleAnswer1: '',
          possibleAnswer2: '',
          possibleAnswer3: '',
          possibleAnswer4: '',
          possibleAnswer5: '',
          possibleAnswer6: '',
          answer: 'A',
          checkboxAnswer: [],
          explain: '',
          content: ''
        },
        answerCategoryText: '单选',
        categories: [],
        visible: false,
        loading: false,
        title: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        }
      }
    },
    methods: {
      answerCategoryRadio: function (name) {
        console.info(name)
      },
      show: function (id) {
        this.listCategories()
        this.visible = true
        this.form.id = id
        this.form.title = ''
        this.form.possibleAnswer1 = ''
        this.form.possibleAnswer2 = ''
        this.form.possibleAnswer3 = ''
        this.form.possibleAnswer4 = ''
        this.form.possibleAnswer5 = ''
        this.form.possibleAnswer6 = ''
        this.form.answer = ''
        this.form.explain = ''
        this.form.checkboxAnswer = []
        this.form.answerCategory = 0
        this.form.categoryId = ''
        this.form.content = ''
        this.form.level = 1
        if (id && id !== 0) {
          this.getQuestion()
        }
      },
      submit: function () {
        if (this.answerCategoryText === '单选') {
          this.form.answerCategory = 1
        } else {
          this.form.answerCategory = 2
          this.form.answer = ''
          this.form.checkboxAnswer.forEach((item, index) => {
            if (index !== 0) {
              this.form.answer += ',' + item
            } else {
              this.form.answer += item
            }
          })
        }
        if (!this.form.categoryId || this.form.categoryId === 0) {
          this.$Message.error('请选择题目类别')
          return
        }
        if (!this.form.possibleAnswer1 && !this.form.possibleAnswer2 && !this.form.possibleAnswer3 && !this.form.possibleAnswer4 &&
           !this.form.possibleAnswer5 && !this.form.possibleAnswer6) {
          this.$Message.error('请输入可能答案')
          return
        }
        if (!this.form.title || this.form.level === 0 || !this.form.answer) {
          this.$Message.error('请输入正确的参数')
          return
        }
        this.form.content = this.$refs.ueditor.getContent()
        this.$http.post('/api/admin/question/save', qs.stringify({
          id: this.form.id,
          title: this.form.title,
          answer: this.form.answer,
          explain: this.form.explain,
          level: this.form.level,
          answerCategory: this.form.answerCategory,
          categoryId: this.form.categoryId,
          possibleAnswerA: this.form.possibleAnswer1,
          possibleAnswerB: this.form.possibleAnswer2,
          possibleAnswerC: this.form.possibleAnswer3,
          possibleAnswerD: this.form.possibleAnswer4,
          possibleAnswerE: this.form.possibleAnswer5,
          possibleAnswerF: this.form.possibleAnswer6,
          content: this.form.content
        })).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.visible = false
            this.$emit('update', 1)
            this.$Message.success('成功')
          } else {
            this.$Message.error(data.msg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      getQuestion: function () {
        this.$http.get('/api/admin/question/findOne', {
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
              answer: data.answer,
              explain: data.questionExplain,
              level: data.level,
              answerCategory: data.answerCategory,
              categoryId: data.questionCategoryId,
              possibleAnswer1: data.possibleAnswerOne,
              possibleAnswer2: data.possibleAnswerTwo,
              possibleAnswer3: data.possibleAnswerThree,
              possibleAnswer4: data.possibleAnswerFour,
              possibleAnswer5: data.possibleAnswerFive,
              possibleAnswer6: data.possibleAnswerSix,
              content: data.content
            }

            if (this.form.answerCategory === 1) {
              this.answerCategoryText = '单选'
            } else {
              this.answerCategoryText = '多选'
              this.form.checkboxAnswer = this.form.answer.split(',')
            }
            console.info(this.answerCategoryText)
          } else {
            this.$Message.error(data.errorMsg)
          }
        }).catch(() => {
          this.$Message.error('服务器错误,请重试')
        })
      },
      listCategories: function () {
        this.$http.get('/api/admin/question/category/all', {
          params: {
            depth: 1
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.categories = data
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
