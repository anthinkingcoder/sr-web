<template>
  <div class="attachmentList" style="margin-top: 30px">
    <div>
      <Table stripe :columns="columns" :data="attachments"></Table>
    </div>

    <div style="margin-top: 30px">
      <Button type="primary" @click="showEdit()">新增附件</Button>
    </div>
    <Edit ref="edit" @update="listAttachment"></Edit>
  </div>
</template>

<script>
  import Edit from './edit.vue'
  import qs from 'qs'

  export default {
    name: 'attachmentList',
    data () {
      return {
        loading: false,
        attachments: [],
        moduleId: 0,
        moduleCategory: 0,
        columns: [
          {
            title: '#',
            key: 'id'
          },
          {
            title: '附件名称',
            key: 'name'
          },
          {
            title: '下载地址',
            key: 'url'
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
      listAttachment: function (moduleId, moduleCategory) {
        if (moduleId && moduleCategory) {
          this.moduleId = moduleId
          this.moduleCategory = moduleCategory
        }
        this.$http.get('/api/admin/attachment/module/list', {
          params: {
            size: this.per,
            page: this.page,
            moduleId: this.moduleId,
            moduleCategory: this.moduleCategory
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.attachments = data
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
            this.$http.post('/api/admin/attachment/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listAttachment()
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
        this.$refs.edit.show(this.moduleId, this.moduleCategory, id)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
