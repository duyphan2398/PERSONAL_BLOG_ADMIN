<template>
  <div class="file-select">
    <button type="button"
            class="btn btn-primary w-100"
            :disabled="disabled"
            @click="showModal"
            :class="{'btn-loading disabled': isOpenPopup}"
    >
      <a-icon type="cloud-upload" class="mr-1" :style="{ fontSize: '16px' }"/>

      {{ $t('choose_file') }}
    </button>

    <a-modal id="files-popup"
             v-model="visible"
             on-ok="handleOk"
             :width="'70vw'"
             :zIndex="100000"
             :keyboard="false"
    >
      <FileList :files="files"
                :multiple="multiple"
                :paginator="paginator"
                :selection.sync="selection"
                :type="fileType"
                @onDataChange="onDataChange($event)"
                @onChooseImage="handleOk"
      />

      <FileUpload
        ref="file_upload"
        :type="fileType"
        :accept="accept"
        @onUploadComplete="onUploadComplete"/>

      <template slot="footer">
        <button type="button" class="btn btn-secondary" @click="handleCancel">
          <a-icon type="remove" class="mr-1"/>

          {{ $t('btn_cancel') }}
        </button>

        <button type="button" class="btn btn-warning" @click="fetchMedia">
          <a-icon type="retweet" class="mr-1" />

          {{ $t('refresh') }}
        </button>

        <button type="button" class="btn btn-primary" @click="handleOk">
          <a-icon type="check-circle" class="mr-1"/>

          {{ $t('choose_file') }}
        </button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import FileList from './FileList'
import FileUpload from './FileUpload'

import File from '@/models/File'

export default {
  name: 'SelectFile',

  components: {
    FileList,
    FileUpload
  },

  props: {
    disabled: false,
    selectedFileId: null,
    type: null,
    multiple: false,
    accept: {
      type: String,
      default: 'image/png,image/jpg,image/jpeg'
    }
  },

  data () {
    return {
      visible: false,
      isOpenPopup: false,
      selection: [],
      files: [],
      paginator: {},
      fileType: null
    }
  },

  created () {
    this.fileType = this.type || this.$route.meta.type
  },

  methods: {
    async showModal () {
      this.isOpenPopup = true
      try {
        await this.fetchMedia()
        // await FileService.list()
        this.visible = true
        this.selection = []
        this.isOpenPopup = false

        if (this.selectedFileId) {
          this.selection = []
          // const selectedFile = FileModel.query().find(this.selectedFileId)
          // this.selection = [selectedFile]
        }
      } catch (e) {
        this.isOpenPopup = false
      }
    },

    handleOk (e) {
      this.visible = false
      const selectedData = this.multiple ? this.selection : this.selection[0]

      if (this.selection.length > 0) {
        this.$emit('onFileSelect', selectedData)
      }

      this.selection = []
    },

    handleCancel (e) {
      this.visible = false
      this.selection = []
    },

    async onUploadComplete () {
      await this.fetchMedia()
    },

    async onDataChange (event) {
      const queryParams = { perPage: event.pageSize, page: event.page }
      return this.fetchMedia(queryParams)
    },

    async fetchMedia (queryParams = {}) {
      const resp = await File.paginate({
        query: {
          page: queryParams.page || 1,
          per_page: queryParams.perPage || 24,
          'filters[type]': this.fileType
        }
      })
      this.files = resp.data
      this.paginator = resp.pagination
    }
  }
}
</script>

<style scoped>

</style>
