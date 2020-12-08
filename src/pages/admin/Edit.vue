<template>
  <div id="UpdateAdmin">
    <Form/>
  </div>
</template>

<script>
import Form from './Form'
import store from '@/store'
import Admin from '@/models/Admin'
export default {
  name: 'Edit',

  beforeRouteEnter: async (to, from, next) => {
    const respDetail = await Admin.find(store.getters.profile ? store.getters.profile.data.id : localStorage.getItem('admin_id'))
    to.meta['detail'] = JSON.parse(JSON.stringify(respDetail))
    return next()
  },
  components: {
    Form
  }
}
</script>

<style scoped>

</style>
