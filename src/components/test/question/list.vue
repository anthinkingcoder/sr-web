<template>
  <div class="categoryList" style="margin-top: 30px">

    <div>
      <Row justify="end" type="flex">
        <Col span="6">
          <Select v-model="categoryId" :transfer="true" :clearable="true" placeholder="题目类别筛选" @on-change="listQuestion(1)">
            <Option value="0">全部</Option>
            <Option v-for="item in categories" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="6" offset="1">
        <Input v-model="title" placeholder="输入题目标题搜索">
        <Button slot="append" icon="ios-search" @click="listQuestion(1)"></Button>
        </Input>
        </Col>
      </Row>
      <br>
      <Table stripe :columns="columns" :data="quesitones"></Table>
    </div>

    <div style="float: right;margin: 10px;overflow: hidden">
      <Page :total="total" :current="page" :page-size="per" @on-change="listQuestion" show-total></Page>
    </div>

    <div style="margin-top: 30px">
      <Button type="primary" @click="showEdit()">新增题目</Button>
    </div>
    <Edit ref="edit" @update="listQuestion"></Edit>
  </div>
</template>

<script>
  import Edit from './edit.vue'
  import qs from 'qs'

  export default {
    name: 'categoryList',
    created () {
      this.listQuestion(1)
      this.listQuestionCategories()
    },
    data () {
      return {
        loading: false,
        quesitones: [],
        title: '',
        categoryId: 0,
        categories: [],
        total: 0,
        page: 0,
        per: 10,
        columns: [
          {
            title: '#',
            key: 'id'
          },
          {
            title: '题目',
            key: 'title'
          },
          {
            title: '难度级别',
            key: 'level',
            sortable: true,
            width: 200,
            render: (h, param) => {
              return h('Rate', {
                props: {
                  disabled: 'disabled',
                  value: param.row.level
                }
              })
            }
          },
          {
            title: '所属类别',
            key: 'questionCategoryId'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.showEdit(params.row.id)
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ]
      }
    },
    components: {
      Edit
    },
    methods: {
      listQuestionCategories: function () {
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
      listQuestion: function (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/question/list', {
          params: {
            size: this.per,
            page: this.page,
            title: this.title,
            categoryId: this.categoryId
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.quesitones = data.content
            this.total = data.totalElements
            this.page = data.number + 1
          } else {
            this.$Message.error('服务器错误,请重试')
          }
        }).catch(() => {
          this.loading = false
          this.$Message.error('服务器错误,请重试')
        })
      },
      remove (id) {
        this.$Modal.confirm({
          title: '提示',
          content: '该操作不可逆,确认删除?',
          onOk: () => {
            this.loading = true
            this.$http.post('/api/admin/question/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listQuestion(1)
              } else {
                this.$Message.error(data.message)
              }
            }).catch(() => {
              this.loading = false
              this.$Message.error('服务器错误,请重试')
            })
          }
        })
      },
      showEdit (id) {
        this.$refs.edit.show(id)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
