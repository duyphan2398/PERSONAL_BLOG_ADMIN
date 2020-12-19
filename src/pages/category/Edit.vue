<template>
  <div id="UpdateCategory">
    <Form/>
  </div>
</template>

<script>
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
    const categories = await Category.find(to.params['id'])

    to.meta['detail'] = categories.data
    return next()
  }
}
</script>

<style scoped>

</style>
