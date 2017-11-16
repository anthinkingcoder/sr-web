<template>
  <div class="categoryList" style="margin-top: 30px">
    <div>
      <Table stripe :columns="columns" :data="categories"></Table>
    </div>

    <div style="float: right;margin: 10px;overflow: hidden">
      <Page :total="total" :current="page" :page-size="per" @on-change="listCategory" show-total></Page>
    </div>

    <div style="margin-top: 30px">
      <Button type="primary" @click="showEdit()">新增题目类别</Button>
    </div>
    <Edit ref="edit" @update="listCategory"></Edit>
  </div>
</template>

<script>
  import Edit from './edit.vue'
  import qs from 'qs'

  export default {
    name: 'categoryList',
    created () {
      this.listCategory(1)
    },
    data () {
      return {
        loading: false,
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
            title: '类别名称',
            key: 'name'
          },
          {
            title: '类别简介',
            key: 'summary'
          },
          {
            title: '上级编号',
            key: 'parentId'
          },
          {
            title: '排序',
            key: 'sort'
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
                }, '停用'),
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
      listCategory: function (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/question/category/list', {
          params: {
            size: this.per,
            page: this.page
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.categories = data.content
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
            this.$http.post('/api/admin/question/category/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listTopicCategory()
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
