<template>
  <a-card class="card-common">
    <div class="card-status-top bg-warning"></div>
    <!--Form-->
    <ValidationObserver tag="form"
                        ref="observer"
                        @submit.prevent="validateBeforeSubmit">
      <div class="row">
          <!--title-->
        <InputText v-model="form.title"
                   class="col-md-6 mb-3"
                   rules="required|max:1000"
                   vid="title"
                   label="field_post_title"
                   :required="true"/>
        <!--Category-->
        <InputCategoryMulti v-model="form.categories"
                            class="col-md-6 mb-3"
                            vid="category"
                            rules=""
                            label="field_post_category"
                            :required="true"
                            :options="optionsCategory"/>

        <!--content-->
        <InputHtmlEditor v-model="form.content"
                         rules="required"
                         vid="content"
                         label="field_post_content"
                         class="col-md-12 mb-3"
                         :required="true"/>

        <!--Thumbnail-->
        <ValidationProvider tag="div"
                            :name="$t('field_post_thumbnail')"
                            class="mb-3"
                            rules=""
                            v-slot="{ errors }">

          <label class="form-label">{{ $t('field_post_thumbnail') }}</label>

          <div class="form-control-plaintext">
            <a-popconfirm
                :title="$t('confirm_content')"
                :ok-text="$t('confirm_yes')"
                :cancel-text="$t('confirm_no')"
                @confirm="deleteImage">
              <button type="button" class="btn btn-link p-0">
                <XCircleIcon  class="text-danger" size="22"/>
              </button>
            </a-popconfirm>
            <img class="img-fluid rounded object-cover mb-3 img-thumbnail-150 border border-light"
                 :src="imageShow"
                 alt=""
            />
            <input :value="form.file" :class="{'is-invalid': errors.length }" hidden>
            <!-- Selected image -->
            <ImageUpload @onUploadImage="onUploadImage" style="width: 150px"/>
            <span class="error invalid-feedback" v-if="errors.length">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <!--Is active-->
        <InputSwitch v-model="form.is_active"
                     class="col-md-1 mb-3"
                     label="field_post_active"/>

      </div>

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer fixed-bottom bg-light shadow">
        <button type="button"
                class="btn btn-default float-right"
                @click="onCancel">
          <a-icon type="stop" class="mr-1"/>
          <span>{{ $t('btn_cancel') }}</span>
        </button>

        <button type="submit"
                class="btn btn-success float-right mr-1"
                :class="{'btn-loading disabled': isSubmit}">
          <a-icon type="save" class="mr-1"/>
          {{this.$route.name === 'post.edit' ? $t('btn_update') : $t('btn_save')}}
        </button>
      </div>
    </ValidationObserver>
  </a-card>
</template>

<script>
import { XCircleIcon } from 'vue-feather-icons'
import Post from '@/models/Post'
import store from '@/store'
import Form from '@/mixins/form.mixin'
import InputText from '@/components/form/InputText'
import InputCategory from '@/components/form/InputCategory'
import InputTextArea from '@/components/form/InputTextArea'
import InputSwitch from '@/components/form/InputSwitch'
import InputDateRange from '@/components/form/InputDateRange'
import InputCategoryMulti from '@/components/form/InputCategoryMulti'
import { forEach, pickBy, forOwn } from 'lodash-es'
import InputHtmlEditor from '@/components/form/InputHtmlEditor'
import SelectFile from '@/components/file/SelectFile'
import ImageUpload from '@/components/file/ImageUpload'

export default {
  name: 'Form',

  components: {
    ImageUpload,
    SelectFile,
    InputHtmlEditor,
    InputSwitch,
    InputTextArea,
    InputCategory,
    InputText,
    InputDateRange,
    InputCategoryMulti,
    XCircleIcon
  },

  data () {
    return {
      form: {
        title: '',
        categories: [],
        file: '',
        content: '',
        is_active: true
      },
      isSubmit: false,
      imageShow: '',
      fileUploads: '',
      categories: []
    }
  },

  mixins: [Form],

  created () {
    this.categories = [...this.$route.meta['categories']]

    if ('id' in this.$route.params && this.$route.name === 'post.edit') {
      this.form = Object.assign(this.form, {
        ...this.$route.meta['detail']
      })
    }

    this.imageShow = this.form.file || require('../../assets/images/dummy_image.png')
    this.previewFile(this.imageShow, this.form.file)
  },

  computed: {
    currentUser () {
      return store.getters.profile.data
    },
    optionsCategory () {
      return {
        data: this.categories,
        id: 'id',
        key: 'display_name'
      }
    }
  },

  methods: {
    async validateBeforeSubmit () {
      const isValid = await this.$refs.observer.validate()

      if (isValid) {
        this.handleSubmit()
      }
    },

    handleSubmit () {
      this.isSubmit = true
      let data = {...this.form}
      const formData = new FormData()

      data.is_active = +this.form.is_active

      forOwn(data, (value, key) => {
        if (key !== 'file') {
          formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value)
        }
      })

      if (this.$route.name === 'post.edit') {
        formData.append('file', data.file ? this.fileUploads : '')
        formData.append('_method', 'POST')
        this.updatePost(this.$route.params.id, formData)
      } else {
        formData.append('file', data.file ? this.fileUploads : '')
        this.createPost(formData)
      }
    },

    async updatePost (id, data) {
      try {
        await Post.update(id, data)

        await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))

        this.$router.push({name: 'post.index'}).catch(_ => {})
      } catch (err) {
        this.checkErrorsAPI(err)
        this.isSubmit = false
      }
    },

    async createPost (data) {
      try {
        const resp = await Post.create(data)

        if (resp && Object.keys(resp).length) {
          await this.onSuccess(this.$t('message_success'), this.$t('create_message_successfully'))

          this.$router.push({name: 'post.index'}).catch(_ => {
          })
        }
      } catch (err) {
        this.checkErrorsAPI(err)
        this.isSubmit = false
        throw err
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

    onCancel () {
      return this.$router.push({name: 'post.index'})
    },

    onUploadImage (file) {
      this.imageShow = file.src
      this.fileUploads = file
      this.form.file = file
    },

    async previewFile (url, banner, defaultType = 'image/png,image/jpg,image/jpeg') {
      let response = await fetch(url)
      let data = await response.blob()
      let metadata = {
        type: response.headers.get('content-type') || defaultType
      }

      const filename = response.url.replace(/^.*\/\/[^/]+/, '')
      let pathSplitted = filename.split('?')[0].split('_')[1]
      pathSplitted = !banner ? 'default' : pathSplitted

      this.fileUploads = new File([data], pathSplitted, metadata)
    },

    deleteImage () {
      this.imageShow = require('../../assets/images/dummy_image.png')
      this.form.file = ''
      this.previewFile(this.imageShow, this.form.file)
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }

  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .form-control-plaintext {
    max-width: 150px;
  }
</style>
