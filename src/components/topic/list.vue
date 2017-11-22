<style lang="stylus" ref="stylesheet/stylus">
</style>
<template>
  <div class="topicList">
    <div>
      <Table stripe :columns="columns" :data="topics"></Table>
    </div>
    <div style="float: right;margin: 10px;overflow: hidden">
      <Page :total="total" :current="page" :page-size="per" @on-change="listTopic" show-total></Page>
    </div>
    <Modal v-model="loading" width="200" :closable="false" :footerHide="true" :mask-closable="false">
      <Spin size="large">
        <Icon type="load-c" :size="36" class="spin-icon-load"></Icon>
        <div style="margin-top: 10px">加载中</div>
      </Spin>
    </Modal>
    <div style="float: left;margin-top: 30px;margin-bottom: 10px">
      <Button type="primary" @click="showEdit()">新增专题</Button>
    </div>
    <Edit ref="edit" @update="listTopic"></Edit>
    <Modal
      v-model="listKnowledgeVisible"
      title="知识列表"
      width="1000"
      :footerHide="true"
    >
      <ListKnowledge ref="listKnowledge" :isFirstLoad="true"></ListKnowledge>
    </Modal>
  </div>

</template>

<script>
  import qs from 'qs'
  import Edit from './edit.vue'
  import ListKnowledge from '../knowledge/list.vue'

  export default {
    name: 'topicList',
    created () {
      this.listTopic(1)
    },
    components: {
      Edit,
      ListKnowledge
    },
    data () {
      return {
        topics: [],
        total: 0,
        per: 10,
        page: 1,
        loading: false,
        listKnowledgeVisible: false,
        columns: [
          {
            title: '#',
            key: 'id'
          },
          {
            title: '专题名称',
            key: 'name'
          },
          {
            title: '类别',
            key: 'categoryId'
          },
          {
            title: '上传者',
            key: 'uploaderId'
          },
          {
            title: '所属知识点',
            render: (h, params) => {
              var str = '查看'
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.showListKnowledge(params.row.id)
                  }
                }
              }, str)
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
      listTopic (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/topic/list', {
          params: {
            size: this.per,
            page: this.page
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.topics = data.content
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
            this.$http.post('/api/admin/topic/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listTopic(1)
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
      },
      showListKnowledge (topicId) {
        this.listKnowledgeVisible = true
        this.$refs.listKnowledge.show(topicId, '新增进阶知识')
      }
    }
  }
</script>


