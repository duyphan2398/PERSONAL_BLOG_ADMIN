import Vue from 'vue'
import { CATEGORY } from '@/enum/category_color.enum'
import { USER_TYPE } from '@/enum/roles_type.enum'

Vue.mixin({
  data () {
    return {CATEGORY, USER_TYPE}
  },
  methods: {}
})
