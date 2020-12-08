<template>
  <div id="UpdatePost">
    <Form/>
  </div>
</template>

<script>
import Post from '@/models/Post'
import Form from './Form'

export default {
  name: 'Edit',
  data () {
    return {
      detail: null
    }
  },
  components: {
    Form
  },
  beforeRouteEnter: async (to, from, next) => {
    const news = await Post.find(to.params['id'])
    to.meta['detail'] = news.data

    return next()
  }
}
</script>

<style scoped>

</style>
