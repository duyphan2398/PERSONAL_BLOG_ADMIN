<template>
  <div id="UpdatePost">
    <Form/>
  </div>
</template>

<script>
import Post from '@/models/Post'
import Form from './Form'
import Category from '@/models/Category'

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
    const post = await Post.find(to.params['id'], {
      query: {
        include: 'admin'
      }
    })
    const categories = await Category.paginate({
      query: {
        per_page: 0,
        'filters[withoutCategoryName]': ['home', 'contact']
      }
    })

    to.meta['categories'] = categories.data
    to.meta['detail'] = post.data
    return next()
  }
}
</script>

<style scoped>

</style>
