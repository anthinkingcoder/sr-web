<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus">
  html, body, #app, input, textarea
    font-family "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "微软雅黑", sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    height 100%

  h2 {
    display: block;
    font-size: 1.5em;
    -webkit-margin-before: 0.83em;
    -webkit-margin-after: 0.83em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    font-weight: bold;
  }
</style>
