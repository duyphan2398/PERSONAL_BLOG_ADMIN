<template>
  <div id="CreatePost">
    <Form/>
  </div>
</template>

<script>
import Form from './Form'
import Category from '@/models/Category'
export default {
  name: 'Create',
  components: { Form },

  async beforeRouteEnter (to, from, next) {
    const categories = await Category.paginate({
      query: {
        per_page: 0,
        'filters[withoutCategoryName]': ['home', 'contact']
      }
    })

    to.meta['categories'] = categories.data

    return next()
  }
}
</script>

<style scoped>

</style>
