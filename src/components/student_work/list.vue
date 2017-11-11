<style lang="stylus" ref="stylesheet/stylus">
</style>
<template>
  <div class="studentWorkList">
    <div>
      <Table stripe :columns="columns" :data="studentWorks"></Table>
    </div>
    <div style="float: right;margin: 10px;overflow: hidden">
      <Page :total="total" :current="page" :page-size="per" @on-change="listStudentWork" show-total></Page>
    </div>
    <Modal v-model="loading" width="200" :closable="false" :footerHide="true" :mask-closable="false">
      <Spin size="large">
        <Icon type="load-c" :size="36" class="spin-icon-load"></Icon>
        <div style="margin-top: 10px">加载中</div>
      </Spin>
    </Modal>
    <div style="float: left;margin-top: 30px">
      <Button type="primary" @click="showEdit()">新增学生作品</Button>
    </div>
    <Edit ref="edit" @update="listStudentWork"></Edit>

    <Modal
      v-model="listAttachmentVisible"
      title="附件列表"
      width="800"
      :footerHide="true"
      :transfer=transfer
    >
      <ListAttachment ref="listAttachment"></ListAttachment>
    </Modal>
  </div>

</template>

<script>
  import qs from 'qs'
  import Edit from './edit.vue'
  import ListAttachment from '../attachment/list.vue'

  export default {
    name: 'studentWorkList',
    created () {
      this.listStudentWork(1)
    },
    components: {
      Edit,
      ListAttachment
    },
    data () {
      return {
        studentWorks: [],
        total: 0,
        per: 10,
        page: 1,
        loading: false,
        listAttachmentVisible: false,
        columns: [
          {
            title: '#',
            key: 'id'
          },
          {
            title: '作品标题',
            key: 'title'
          },
          {
            title: '作者',
            key: 'author'
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
                return '课程设计'
              } else if (params.row.category === 2) {
                return '项目实训'
              } else if (params.row.category === 3) {
                return '大赛作品'
              }
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
    methods: {
      listStudentWork (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/student_work/list', {
          params: {
            size: this.per,
            page: this.page
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.studentWorks = data.content
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
            this.$http.post('/api/admin/student_work/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listTopic()
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
      showListAttachment (id) {
        this.listAttachmentVisible = true
        this.$refs.listAttachment.listAttachment(id, 3)
      },
      showEdit (id) {
        this.$refs.edit.show(id)
      }
    }
  }
</script>


