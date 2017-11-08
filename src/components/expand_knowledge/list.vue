<template>
  <div class="expandKnowledgeList" style="margin-top: 30px">
    <div>
      <Table stripe :columns="columns" :data="expandKnowledges"></Table>
    </div>
    <div style="margin-top: 30px">
      <Button type="primary" @click="showEdit()">新增拓展知识</Button>
    </div>
    <Edit ref="edit" @update="listExpandKnowledge"></Edit>
  </div>
</template>

<script>
  import Edit from './edit.vue'
  import qs from 'qs'

  export default {
    name: 'expandKnowledgeList',
    created () {
      this.listExpandKnowledge(1)
    },
    data () {
      return {
        loading: false,
        expandKnowledges: [],
        total: 0,
        per: 10,
        page: 1,
        columns: [
          {
            title: '#',
            key: 'id'
          },
          {
            title: '标题',
            key: 'name'
          },
          {
            title: '封面',
            key: 'coverUrl',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.coverUrl,
                  width: 100,
                  height: 100
                }
              }, '123123')
            }
          },
          {
            title: '摘要',
            key: 'summary'
          },
          {
            title: '原地址',
            key: 'url',
            render: (h, params) => {
              return h('a', {
                attrs: {
                  href: params.row.url,
                  target: '_blank'
                }
              }, params.row.url)
            }
          },
          {
            title: '上传者',
            key: 'uploaderId'
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
      listExpandKnowledge: function (page) {
        page = this.page - 1
        this.$http.get('/api/admin/expand_knowledge/list', {
          params: {
            size: this.per,
            page: page
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.expandKnowledges = data.content
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
            this.$http.post('/api/admin/expand_knowledge/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listExpandKnowledge(1)
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
