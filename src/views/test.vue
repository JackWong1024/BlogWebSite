<template>
  <div style="background:#f8f8f8; height: 100%;">
      我是测试内容<br/>
{{content}}
<div class="red">红色</div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      content: '我是动态渲染内容'
    }
  },
  computed: {
  }
}
</script>
<style scoped lang="less">
  .red {
		width: 60px;
		height: 60px;
		background: red;
	}
</style>
