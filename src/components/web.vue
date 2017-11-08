<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-logo {
    height: 50px;
    margin-top: 15px;
    margin-left: 15px;
    float: left;
  }


  .layout-assistant {
    margin: 0px auto;
    height: inherit;
    float: right;

  }
  .layout-nav {
    height: 80px;
    margin: 0 auto;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-content {
    min-height: 200px;
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
</style>
<template>
  <div class="layout">
  <div class="layout-nav">

    <Menu mode="horizontal" active-name="1" style="height: 80px;
    line-height: 80px;">
      <div class="layout-logo">
        <img src="/static/img/java.jpg" height="50px" ></Col>
      </div>
      <div class="layout-assistant">
        <MenuItem name="1">
          <Icon type="ionic"></Icon>
          <span class="layout-text">基础知识</span>
        </MenuItem>
        <MenuItem name="2">
          <Icon type="happy"></Icon>
          <span class="layout-text">进阶专题</span>
        </MenuItem>
        <MenuItem name="3">
          <Icon type="ios-videocam"></Icon>
          <span class="layout-text">实例教程</span>
        </MenuItem>
        <MenuItem name="4">
          <Icon type="grid"></Icon>
          <span class="layout-text">学生作品</span>
        </MenuItem>
        <MenuItem name="5">
          <Icon type="battery-full"></Icon>
          <span class="layout-text">在线测试</span>
        </MenuItem>
        <MenuItem name="6">
          <Icon type="ios-cloud-download"></Icon>
          <span class="layout-text">相关资源</span>
        </MenuItem>
      </div>
    </Menu>
  </div>

  <div class="layout-content">
    <Row>
      <Col span="5">
      </Col>
      <Col span="19">
      <div class="layout-content-main">
        <router-view></router-view>
      </div>
      </Col>
    </Row>
  </div>
  <div class="layout-copy">
    2017 &copy; 长沙学院
  </div>
  </div>
</template>
<script>
  export default {}
</script>
