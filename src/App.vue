<template>
  <div id="app">
    <vue-progress-bar/>
    <component :is="layout" v-if="layout"/>
  </div>
</template>

<script>
export default {
  components: {
    'auth': () => import(/* webpackChunkName: "auth" */ '@/layouts/Auth.vue'),
    'default': () => import(/* webpackChunkName: "default" */ '@/layouts/Default.vue')
  },
  computed: {
    layout () {
      return this.$store.state.layout || 'default'
    }
  }
}
</script>
