<template>
  <a-card class="card-common">
    <div class="card-status-top bg-warning"></div>
    <!--Form-->
    <ValidationObserver tag="form"
                        ref="observer"
                        @submit.prevent="validateBeforeSubmit">
      <div class="row">
        <!--Title-->
        <InputText v-model="form.title"
                   class="col-md-6 mb-3"
                   rules="max:100"
                   vid="title"
                   label="field_category_title"
        />

        <!--Content-->
        <InputText v-model="form.content"
                       class="col-md-6 mb-3"
                       rules="max:255"
                       vid="content "
                       label="field_category_content"
        />

        <div class="col-md-6 mb-3">
          <div class="form__label">
            <label>{{ $t('field_category_color')}}</label>
          </div>
          <div class="form__input">
            <v-swatches
                v-model="form.color"
                class="h-50"
                show-fallback

                popover-x="left"
            ></v-swatches>
          </div>
        </div>

        <!--Thumbnail-->
        <ValidationProvider tag="div"
                            :name="$t('field_category_thumbnail')"
                            class="col-md-6 mb-3"
                            rules=""
                            v-slot="{ errors }">

          <label class="form-label">{{ $t('field_category_thumbnail') }}</label>

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
          {{this.$route.name === 'category.edit' ? $t('btn_update') : $t('btn_save')}}
        </button>
      </div>
    </ValidationObserver>
  </a-card>
</template>

<script>
import { XCircleIcon } from 'vue-feather-icons'
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
import Category from '@/models/Category'
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.css'
export default {
  name: 'Form',

  components: {
    VSwatches,
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
        color: '#000000',
        file: '',
        content: ''
      },
      isSubmit: false,
      imageShow: '',
      fileUploads: '',
      categories: []
    }
  },

  mixins: [Form],

  created () {
    if ('id' in this.$route.params && this.$route.name === 'category.edit') {
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

      if (this.$route.name === 'category.edit') {
        formData.append('file', this.fileUploads)
        formData.append('_method', 'POST')
        this.updateCategory(this.$route.params.id, formData)
      } else {
        this.isSubmit = false
      }
    },

    async updateCategory (id, data) {
      try {
        await Category.update(id, data)

        await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))

        this.$router.push({name: 'category.index'}).catch(_ => {})
      } catch (err) {
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

    onCancel () {
      return this.$router.push({name: 'category.index'})
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
  .theme-color {
    .item {
      width: calc(100%/3);
      border-right: 1px solid #DDDDDD;
      &:last-child {
        border-right: none;
      }
      &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1;
        padding: 1.25rem;
        border-bottom: 1px solid #DDDDDD;
        p {
          line-height: 20px;
        }
        /deep/ .vue-swatches {
          max-width: 80px;
          max-height: 50px;
          width: 100%;
          height: 50px;
          &__trigger__wrapper {
            width: 100%;
            height: 100%;
            .vue-swatches__trigger {
              width: 100%!important;
              height: 100%!important;
            }
          }
        }
      }
      &__body {
        line-height: 1;
        padding: 1.25rem;
        /deep/ .vue-swatches {
          &__trigger {
            width: 50px!important;
            height: 50px!important;
          }
        }
      }
    }
  }
</style>
