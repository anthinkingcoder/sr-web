<style lang="stylus" ref="stylesheet/stylus">
</style>
<template>
  <div class="teacherList">
    <div>
      <Table stripe :columns="columns" :data="teachers"></Table>
    </div>
    <div style="float: right;margin: 10px;overflow: hidden">
      <Page :total="total" :current="page" :page-size="per" @on-change="listTeacher" show-total></Page>
    </div>
    <Modal v-model="loading" width="200" :closable="false" :footerHide="true" :mask-closable="false">
      <Spin size="large">
        <Icon type="load-c" :size="36" class="spin-icon-load"></Icon>
        <div style="margin-top: 10px">加载中</div>
      </Spin>
    </Modal>
    <div style="float: left;margin-top: 30px;margin-bottom: 10px">
      <Button type="primary" @click="showEdit()">新增教师</Button>
    </div>
    <Edit ref="edit" @update="listTeacher"></Edit>
  </div>

</template>

<script>
  import qs from 'qs'
  import Edit from './edit.vue'

  export default {
    name: 'teachers',
    created () {
      this.listTeacher(1)
    },
    components: {
      Edit
    },
    data () {
      return {
        teachers: [],
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
            title: '名称',
            key: 'name'
          },
          {
            title: '账号',
            key: 'username'
          },
          {
            title: '密码',
            key: 'password'
          },
          {
            title: '注册时间',
            key: 'createAt'
          },
          {
            title: '上次登录时间',
            key: 'lastLoginTime'
          },
          {
            title: '操作',
            render: (h, params) => {
              let str
              if (params.row.status === 0) {
                str = '禁用'
              } else {
                str = '取消禁用'
              }

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
                      this.updateStatus(params.row.id)
                    }
                  }
                }, str)
              ])
            }
          }
        ]
      }
    },
    methods: {
      listTeacher (page) {
        this.page = page - 1
        this.loading = true
        this.$http.get('/api/admin/teacher/list', {
          params: {
            size: this.per,
            page: this.page
          }
        }).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.teachers = data.content
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
            this.$http.post('/api/admin/teacher/delete', qs.stringify({'id': id})).then((response) => {
              this.loading = false
              let result = response.data
              let data = result.data
              if (result.code === 666) {
                this.$Message.success('删除成功')
                this.listTeacher(1)
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
      updateStatus (id) {
        this.loading = true
        this.$http.post('/api/admin/teacher/status', qs.stringify({'id': id})).then((response) => {
          this.loading = false
          let result = response.data
          let data = result.data
          if (result.code === 666) {
            this.$Message.success('成功')
            this.listTeacher(1)
          } else {
            this.$Message.error(data.message)
          }
        }).catch(() => {
          this.loading = false
          this.$Message.error('服务器错误,请重试')
        })
      },
      showEdit (id) {
        this.$refs.edit.show(id)
      }
    }
  }
</script>


