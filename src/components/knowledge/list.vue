<style lang="stylus" ref="stylesheet/stylus">
</style>
<template>
  <div class="knowledgeList">
    <div>
      <Table stripe :columns="columns" :data="files"></Table>
      <div style="float: right;margin: 10px;overflow: hidden">
        <Page :total="total" :current="page" :page-size="per" @on-change="listAll" show-total></Page>
      </div>
      <Modal v-model="loading" width="200" :closable="false" :footerHide="true" :mask-closable="false">
        <Spin size="large">
          <Icon type="load-c" :size="36" class="spin-icon-load"></Icon>
          <div style="margin-top: 10px">加载中</div>
        </Spin>
      </Modal>
      <div style="margin-top: 30px">
        <Button type="primary" @click="showEdit()">{{name}}</Button>
      </div>
      <Edit ref="edit" @update="listAll"></Edit>
      <ResourceDocumentEdit ref="resourceDocumentEdit" @update="listAll"></ResourceDocumentEdit>
      <Modal
        v-model="listAttachmentVisible"
        title="附件列表"
        width="800"
        :footerHide="true"
        :transfer=transfer
      >
        <ListAttachment ref="listAttachment"></ListAttachment>
      </Modal>
      <Modal
        v-model="listExampleVisible"
        title="实例教程列表"
        width="800"
        :footerHide="true"
        :transfer=transfer
      >
        <ListExample ref="listExample"></ListExample>

      </Modal>


    </div>

  </div>

</template>

<script>
  import qs from 'qs'
  import Edit from './edit.vue'
  import ResourceDocumentEdit from './resource_document/edit.vue'
  import ListAttachment from '../attachment/list.vue'
  import ListExample from '../example/list.vue'

  export default {
    name: 'knowledgeList',
    created () {
      if (this.isFirstLoad === false) {
        this.listAll(1)
      }
    },
    components: {
      Edit,
      ResourceDocumentEdit,
      ListAttachment,
      ListExample
    },
    props: {
      isFirstLoad: Boolean,
      default: false
    },
    data () {
      return {
        files: [],
        total: 0,
        per: 10,
        page: 1,
        loading: false,
        topicId: 0,
        name: '新增基础知识',
        listAttachmentVisible: false,
        listExampleVisible: false,
        transfer: false,
        columns: [
          {
            title: '#',
            key: 'id'
          },
          {
            title: '知识点名称',
            key: 'name'
          },
          {
            title: '排序',
            key: 'sort',
            sortable: true
          },
          {
            title: '资源文档',
            render: (h, params) => {
              var str = '查看'
              if (params.row.resourceDocumentId === null) {
                str = '上传'
              }
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    if (str === '查看') {
                      this.showResourceDocumentEdit(params.row.id, params.row.resourceDocumentId)
                    } else {
                      this.showResourceDocumentEdit(params.row.id)
                    }
                  }
                }
              }, str)
            }
          },
          {
            title: '附件',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.showListAttachment(params.row.id)
                  }
                }
              }, '查看')
            }
          },
          {
            title: '实例教程',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.showListExample(params.row.id)
                  }
                }
              }, '查看')
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
      listAll (page) {
        if (!page) {
          page = this.page
        }
        if (!this.topicId || this.topicId === 0) {
          this.listKnowledge(page)
        } else {
          this.listTopicKnowledge(page)
        }
      },
      listKnowledge (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/knowledge/list', {
          params: {
            size: this.per,
            page: this.page,
            level: 1
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.files = data.content
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
      listTopicKnowledge (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/knowledge/topic/list', {
          params: {
            size: this.per,
            page: this.page,
            topicId: this.topicId
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.files = data.content
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
            this.$http.post('/api/admin/knowledge/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listKnowledge(1)
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
        if (!this.topicId || this.topicId === 0) {
          this.$refs.edit.show('基础知识', 1, id)
        } else {
          this.$refs.edit.show('进阶知识', 2, id, this.topicId)
        }
      },
      showResourceDocumentEdit (knowledgeId, resourceDocumentId) {
        this.$refs.resourceDocumentEdit.show(knowledgeId, resourceDocumentId)
      },
      showListExample (knowledgeId, topicId) {
        this.listExampleVisible = true
        this.$refs.listExample.show(knowledgeId, topicId)
      },
      showListAttachment (id) {
        this.listAttachmentVisible = true
        this.$refs.listAttachment.listAttachment(id, 1)
      },
      show (topicId, name) {
        this.name = name
        this.topicId = topicId
        if (!this.topicId || this.topicId === 0) {
          this.listKnowledge(1)
        } else {
          this.listTopicKnowledge(1)
        }
      }
    }
  }
</script>


