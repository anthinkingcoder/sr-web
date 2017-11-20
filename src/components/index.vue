<style scoped>



  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-logo {
    margin-top: 5px;
    width: 300px;
    height: 50px;
    color: #fff;
    border-radius: 3px;
    float: left;
    position: relative;
    left: 20px;
    font-size: 20px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
  }

  .layout-menu-left{
    background: #464c5b;
  }

  .layout-assistant {
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }

  .layout-logo-left{
    width: 90%;
    height: 30px;
    /*background: #5b6270;*/
    color: #fff;
    border-radius: 3px;
    margin: 15px auto;
    text-align: center;
    vertical-align: middle;
  }

  .logout {
    color: #fff;
    float: right;
    padding-right: 20px;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-hide-text .layout-text {
    display: none;
  }

  .layout-content {
    min-height: 500px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .ivu-col{
    transition: width .2s ease-in-out;
  }
</style>
<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row type="flex">
      <Col :span="spanLeft" class="layout-menu-left">
        <Menu @on-select="menuSelect" :active-name="active" width="auto" :open-names="['1','3','7']"  theme="dark">
          <div class="layout-logo-left">
              <h3 style="padding-top: 5px">Java学习网后台</h3>
          </div>
          <Submenu name="1" v-show="systemVisible" theme="dark">
            <template slot="title">
              <Icon type="ios-locked"></Icon>
              <span class="layout-text">系统管理</span>
            </template>
            <Menu-item name="1-1" class="layout-text">
              <Icon type="person"></Icon>
              <span class="layout-text">教师管理</span>
            </Menu-item>
          </Submenu>

          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-nutrition"></Icon>
              <span class="layout-text">专题管理</span>
            </template>
            <Menu-item name="3-1" class="layout-text">
              <Icon type="ios-nutrition"></Icon>
              <span class="layout-text">进阶专题管理</span>
            </Menu-item>
            <Menu-item name="3-2" class="layout-text" v-show="systemVisible">
              <Icon type="ios-nutrition"></Icon>
              <span class="layout-text">专题类别管理</span>
            </Menu-item>
          </Submenu>
          <Menu-item name="2-1" class="layout-text">
            <Icon type="ios-keypad"></Icon>
            <span class="layout-text">基础知识管理</span>
          </Menu-item>


          <Menu-item name="4-1" class="layout-text">
            <Icon type="network"></Icon>
            <span class="layout-text">拓展知识管理</span>
          </Menu-item>

          <Menu-item name="6-1" class="layout-text">
            <Icon type="ios-color-filter"></Icon>
            <span class="layout-text">学生作品管理</span>
          </Menu-item>

          <Submenu name="7">
            <template slot="title">
              <Icon type="social-codepen"></Icon>
              <span class="layout-text">在线测试管理</span>
            </template>
            <Menu-item name="7-1" class="layout-text">
              <Icon type="ios-information"></Icon>
              <span class="layout-text">题目类别管理</span>
            </Menu-item>
            <Menu-item name="7-2" class="layout-text">
              <Icon type="ios-information"></Icon>
              <span class="layout-text">题库管理</span>
            </Menu-item>
          </Submenu>

          <Menu-item name="8-1" class="layout-text">
            <Icon type="ios-cloud-download"></Icon>
            <span class="layout-text">相关资源管理</span>
          </Menu-item>
        </Menu>
      </Col>
      <Col :span="spanRight">
      <Menu mode="horizontal" :active-name="1">
        <div class="layout-logo">
          <Row>
            <Col span="1">
              <!--<Button type="text" @click="toggleClick">-->
                <!--<Icon type="navicon" size="32"></Icon>-->
              <!--</Button>-->
            </Col>
            <Col span="4">
            <img src="/static/img/java.jpg" height="50px">
            </Col>
          </Row>
        </div>
        <div class="logout">

          <Dropdown @on-click="logout">
            <a>
              {{username}}
              <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list">
              <Dropdown-item>注销</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </div>
      </Menu>
      <div class="layout-content">
            <div class="layout-content-main">
              <router-view></router-view>
            </div>
      </div>
      <div class="layout-copy">
        2017 &copy; 长沙学院
      </div>
      </Col>
    </Row>

    <Modal v-model="loading" width="200" :closable="false" :footerHide="true" :mask-closable="false">
      <Spin size="large">
        <Icon type="load-c" :size="36" class="spin-icon-load"></Icon>
        <div style="margin-top: 10px">加载中</div>
      </Spin>
    </Modal>
  </div>
</template>
<script>
  export default {
    created () {
      this.getUser()
    },
    data () {
      return {
        username: '',
        loading: false,
        active: '1-1',
        spanLeft: 5,
        spanRight: 19,
        systemVisible: false,
        nav: {
          '1-1': {
            path: '/admin/main/teacher/list',
            title: '教师管理'
          },
          '2-1': {
            path: '/admin/main/knowledge/list',
            title: '基础知识'
          },
          '3-1': {
            path: '/admin/main/topic/list',
            title: '专题列表'
          },
          '3-2': {
            path: '/admin/main/topic/category/list',
            title: '专题列表'
          },
          '4-1': {
            path: '/admin/main/expand_knowledge/list',
            title: '拓展知识'
          },
          '5-1': {
            path: '/admin/main/example/list',
            title: '实例教程'
          },
          '6-1': {
            path: '/admin/main/student_work/list',
            title: '学生作品'
          },
          '7-1': {
            path: '/admin/main/question/category/list',
            title: '题目类别管理'
          },
          '7-2': {
            path: '/admin/main/question/list',
            title: '题目管理'
          },
          '8-1': {
            path: '/admin/main/resource/list',
            title: '相关资源'
          }
        }
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft === 5 ? 14 : 24
      }
    },
    methods: {
      toggleClick () {
        if (this.spanLeft === 5) {
          this.spanLeft = 2
          this.spanRight = 22
        } else {
          this.spanLeft = 5
          this.spanRight = 19
        }
      },
      menuSelect (name) {
        this.$router.push({
          path: this.nav['' + name + ''].path
        })
        document.title = this.nav['' + name + ''].title
      },
      logout () {
        this.$Modal.confirm({
          title: '提示',
          content: '确认注销？',
          onOk: () => {
            this.loading = true
            this.$http.get('/api/admin/user/logout').then(() => {
              this.loading = false
              this.$Message.success('注销成功')
              this.$router.push({
                path: '/admin/login'
              })
            }).catch(() => {
              this.loading = false
              this.$Message.error('通讯错误，请重试')
            })
          }
        })
      },
      getUser () {
        this.$http.get('/api/admin/user/userinfo').then((response) => {
          let res = response.data
          if (res.code === 666) {
            console.info(res.data)
            this.username = res.data.username
            if (res.data.level === 1) {
              this.systemVisible = true
            }
          }
        }).catch(() => {
        })
      }
    }
  }
</script>
