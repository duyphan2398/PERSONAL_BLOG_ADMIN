<template>
  <a-card class="card-common">
    <div class="card-status-top bg-warning"></div>
    <!--Form-->
    <ValidationObserver tag="form"
                        ref="observer">
      <div class="row">
        <!--Admin name-->
        <InputText v-model="form.name"
                   class="col-md-6 col-xs-12 mb-3"
                   rules="required|max:100"
                   vid="name"
                   label="field_admin_name"
                   :required="true"/>

        <!--Login ID-->
        <InputText v-model="form.login_id"
                   class="col-md-6 col-xs-12 mb-3"
                   rules="required|alpha_num|min:4|max:100"
                   vid="login_id"
                   label="field_admin_login_id"
                   :required="true"/>

        <!--Change password confirm ?-->
        <InputSwitch v-model="changePassword"
                     class="col-md-12 col-xs-12 mb-3"
                     @change="changePasswordAction"
                     label="field_admin_change_password"/>

        <template v-if="changePassword">
          <!--Login password-->
          <InputText v-model="form.password"
                     class="col-md-6 col-xs-12 mb-3"
                     rules="alpha_num|min:6|max:100"
                     type="password"
                     vid="password"
                     label="field_admin_login_password"/>
          <!--Login password confirm-->
          <InputText v-model="form.password_confirmation"
                     class="col-md-6 col-xs-12 mb-3"
                     rules="required_if:password|confirmed:password"
                     type="password"
                     vid="password_confirmation"
                     label="field_admin_login_password_confirmation"/>
        </template>
      </div>

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer fixed-bottom bg-light shadow">
        <button type="button"
                class="btn btn-warning float-right"
                :class="{'btn-loading disabled': isReset, 'disabled': isSubmit}"
                @click="onRefresh">
          <a-icon type="undo" class="mr-1"/>
          <span>{{ $t('btn_reset') }}</span>
        </button>

        <a-popconfirm
            :title="$t('confirm_content')"
            :ok-text="$t('confirm_yes')"
            :cancel-text="$t('confirm_no')"
            @confirm.prevent="validateBeforeSubmit()">
          <button type="submit"
                  class="btn btn-success float-right mr-1"
                  :class="{'btn-loading disabled': isSubmit, 'disabled': isReset}">
            <a-icon type="save" class="mr-1"/>
            {{ $t('btn_update') }}
          </button>
        </a-popconfirm>
      </div>
    </ValidationObserver>
  </a-card>
</template>

<script>

import Admin from '@/models/Admin'
import Form from '@/mixins/form.mixin'
import InputCategory from '@/components/form/InputCategory'
import InputText from '@/components/form/InputText'
import InputSwitch from '@/components/form/InputSwitch'
import {forEach, pickBy} from 'lodash-es'
import store from '@/store'
import * as types from '@/store/mutation-types'

export default {
  name: 'Form',

  components: {
    InputSwitch,
    InputText,
    InputCategory
  },

  data () {
    return {
      detail: {},
      changePassword: false,
      form: {
        name: '',
        login_id: '',
        password: '',
        password_confirmation: ''
      },
      isSubmit: false,
      isReset: false
    }
  },

  mixins: [Form],

  created () {
    this.form = Object.assign(this.form, this.$route.meta['detail'])
  },

  computed: {
    currentUser () {
      return store.getters.profile.data
    }
  },

  methods: {
    changePasswordAction () {
      this.password = this.password_confirmation = ''
    },

    async validateBeforeSubmit () {
      const isValid = await this.$refs.observer.validate()

      if (isValid) {
        this.handleSubmit()
      }
    },

    handleSubmit () {
      this.isSubmit = true
      let data = this.form
      this.updateAdmin(data)
    },

    async updateAdmin (data) {
      try {
        await Admin.update(store.getters.profile ? store.getters.profile.data.id : localStorage.getItem('admin_id'), data)
        const profile = await Admin.profile()
        store.commit(types.SET_PROFILE, { profile })
        await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))
        this.isSubmit = false
      } catch (err) {
        console.log(err)
        this.checkErrorsAPI(err)
        this.isSubmit = false
      }
    },

    checkErrorsAPI (err) {
      forEach(err.response.data.errors, (item) => {
        pickBy(this.$refs.observer.errors, (value, key) => {
          if (item.field === key) {
            value.push(item.message)
            this.isSubmit = false
          }
        })
      })
    },

    async onRefresh () {
      this.isReset = true
      const respDetail = await Admin.profile()
      this.form = Object.assign(this.form, respDetail)
      this.form.password = this.form.password_confirmation = ''
      await this.onSuccess(this.$t('message_success'), this.$t('reset_message_successfully'))
      this.isReset = false
    }
  }
}
</script>

<style scoped>

</style>
