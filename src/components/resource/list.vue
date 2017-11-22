<style lang="stylus" ref="stylesheet/stylus">
</style>
<template>
  <div class="resourceList">
    <div>
      <Table stripe :columns="columns" :data="resources"></Table>
    </div>
    <div style="float: right;margin: 10px;overflow: hidden">
      <Page :total="total" :current="page" :page-size="per" @on-change="listResource" show-total></Page>
    </div>
    <Modal v-model="loading" width="200" :closable="false" :footerHide="true" :mask-closable="false">
      <Spin size="large">
        <Icon type="load-c" :size="36" class="spin-icon-load"></Icon>
        <div style="margin-top: 10px">加载中</div>
      </Spin>
    </Modal>
    <div style="float: left;margin-top: 30px;margin-bottom: 10px">
      <Button type="primary" @click="showEdit()">新增资源</Button>
    </div>
    <Edit ref="edit" @update="listResource"></Edit>
  </div>

</template>

<script>
  import qs from 'qs'
  import Edit from './edit.vue'

  export default {
    name: 'resourceList',
    created () {
      this.listResource(1)
    },
    components: {
      Edit
    },
    data () {
      return {
        resources: [],
        total: 0,
        per: 10,
        page: 1,
        loading: false,
        columns: [
          {
            title: '#',
            key: 'id'
          },
          {
            title: '作品标题',
            key: 'name'
          },
          {
            title: '上传者',
            key: 'uploaderId'
          },
          {
            title: '封面图',
            key: 'coverUrl',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.coverUrl,
                  width: 100,
                  height: 100
                },
                styls: {
                }
              }, '1231231231123')
            }
          },
          {
            title: '资源地址',
            key: 'url'
          },
          {
            title: '摘要',
            key: 'summary'
          },
          {
            title: '类别',
            key: 'category',
            sortable: true,
            render: (h, params) => {
              if (params.row.category === 1) {
                return '电子书'
              } else if (params.row.category === 2) {
                return '软件资源'
              } else if (params.row.category === 3) {
                return '优秀网站'
              }
            }
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
    methods: {
      listResource (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/resource/list', {
          params: {
            size: this.per,
            page: this.page
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.resources = data.content
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
          content: '该操作不可逆,删除后其知识点也会被删除,确认删除?',
          onOk: () => {
            this.loading = true
            this.$http.post('/api/admin/resource/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listResource()
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


