<template>
  <div style="background:#f8f8f8; height: 100%;">
    <header>
    </header>
    <main>
       <transition name="slide-fade">
              <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
              </keep-alive>
            </transition>

            <transition name="slide-fade">
              <router-view v-if="!$route.meta.keepAlive"></router-view>
            </transition>
    </main>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
    }
  },
  computed: {
  }
}
</script>
<style scoped lang="less">
  .slide-fade {
    position: absolute;
    left: 0;
    right: 0;
  }

  .slide-fade-enter-active {
    transition: all 1.2s ease;
  }

  .slide-fade-leave-active {
    transition: all .1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    left: 0;
    right: 0;
    transform: translateX(50px);
    opacity: 0;
  }
</style>