<style lang="stylus" ref="stylesheet/stylus">
</style>
<template>
  <div class="exampleList">
    <div>
      <Table stripe :columns="columns" :data="examples"></Table>
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
        <Button type="primary" @click="showEdit()">新增实例教程</Button>
      </div>
      <Edit ref="edit" @update="listAll"></Edit>
      <Modal
        v-model="listAttachmentVisible"
        title="附件列表"
        width="800"
        :footerHide="true"
        :transfer=transfer
      >
        <ListAttachment ref="listAttachment"></ListAttachment>
      </Modal>
      <KnowledgeEdit ref="knowledgeEdit"></KnowledgeEdit>
      <TopicEdit ref="topicEdit"></TopicEdit>
    </div>

  </div>

</template>

<script>
  import qs from 'qs'
  import Edit from './edit.vue'
  import ListAttachment from '../attachment/list.vue'
  import KnowledgeEdit from '../knowledge/edit.vue'
  import TopicEdit from '../topic/edit.vue'

  export default {
    name: 'exampleList',
    created () {
      if (this.isFirstLoad === false) {
        this.listAll(1)
      }
    },
    components: {
      Edit,
      ListAttachment,
      KnowledgeEdit,
      TopicEdit
    },
    props: {
      isFirstLoad: Boolean,
      default: false
    },
    data () {
      return {
        examples: [],
        total: 0,
        per: 10,
        page: 1,
        loading: false,
        knowledgeId: 0,
        topicId: 0,
        listAttachmentVisible: false,
        transfer: false,
        columns: [
          {
            title: '#',
            key: 'id'
          },
          {
            title: '实例题目',
            key: 'title',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showEdit(params.row.knowledgeId, params.row.topicId, params.row.id)
                  }
                }
              }, params.row.title)
            }
          },
          {
            title: '所属专题',
            key: 'topicId',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    if (params.row.topicId && params.row.topicId !== 0) {
                      this.$refs.topicEdit.show(params.row.topicId)
                    }
                  }
                }
              }, params.row.knowledgeId)
            }
          },
          {
            title: '上传者',
            key: 'uploaderId'
          },
          {
            title: '所属知识点编号',
            key: 'knowledgeId',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    if (params.row.topicId && params.row.topicId !== 0) {
                      this.showKnowledgeEdit('进阶知识', 2, params.row.knowledgeId, params.row.topicId)
                    } else {
                      this.showKnowledgeEdit('进阶知识', 1, params.row.knowledgeId, params.row.topicId)
                    }
                  }
                }
              }, params.row.knowledgeId)
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
                      this.showEdit(params.row.knowledgeId, params.row.topicId, params.row.id)
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
        this.listExample(page)
      },
      listExample (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/example/list', {
          params: {
            size: this.per,
            page: this.page
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.examples = data.content
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
            this.$http.post('/api/admin/example/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listExample(1)
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
      showEdit (knowledgeId, topicId, id) {
        this.$refs.edit.show(knowledgeId, topicId, id)
      },
      showResourceDocumentEdit (knowledgeId, resourceDocumentId) {
        this.$refs.resourceDocumentEdit.show(knowledgeId, resourceDocumentId)
      },
      showKnowledgeEdit (title, level, id, topicId) {
        this.$refs.knowledgeEdit.show(title, level, id, topicId)
      },
      showListAttachment (id) {
        this.listAttachmentVisible = true
        this.$refs.listAttachment.listAttachment(id, 2)
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


