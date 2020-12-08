<template>
  <ValidationProvider tag="div"
                      :name="label"
                      :vid="vid"
                      :rules="rules"
                      v-slot="{ errors }">
    <label class="form-label">
      {{ $t(label) }}
      <span v-if="required" class="required">{{$t('required')}}</span>
    </label>

    <div :class="{'has__error': errors[0]}">
      <div class="custom-arrow">
        <a-select
          show-search
          mode="multiple"
          style="width: 100%"
          :value="inputValue"
          :not-found-content="fetching ? undefined : null"
          label-in-value
          @deselect="data = []"
          :filter-option="filterOption"
          option-filter-prop="children"
          @focus="fetchData"
          @change="handleChange">
          <a-spin v-if="fetching" slot="notFoundContent" size="small"/>

          <template>
            <a-select-option v-for="(item, index) in data"
                             :key="index"
                             :thumbnail="item.thumbnail"
                             :thumbnail_url="item.thumbnail_url"
                             :value="item[options.id]"
            >{{ item[options.key] }}
            </a-select-option>
          </template>
        </a-select>

        <a-icon type="down" :style="{ fontSize: '12px'}"/>
      </div>
      <!--Message Error-->
      <span v-if="errors[0]" class="errors">{{ errors[0] }}</span>
    </div>
  </ValidationProvider>
</template>

<script>
import debounce from 'lodash-es/debounce'
import Model from '@/models/Model'
import { omit } from 'lodash-es'

export default {
  name: 'InputContentFetchAPI',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    label: {
      type: String,
      required: true,
      default: ''
    },

    rules: {
      type: String,
      default: ''
    },

    vid: {
      type: String,
      default: ''
    },

    value: {
      type: Array
    },

    options: {
      type: Object,
      required: true
    },

    required: {
      type: Boolean,
      default: false
    },

    modelJavel: {
      type: [Model, Function],
      required: true
    }
  },

  data () {
    this.lastFetchId = 0
    this.fetchData = debounce(this.fetchData, 800)
    return {
      data: [],
      fetching: false
    }
  },

  created () {
    const tmpOptions = [...this.value]
    const tmp = tmpOptions.map((item, index) => {
      return omit({
        id: item.key,
        content_title: item.label,
        thumbnail: item.thumbnail || item.content_url,
        thumbnail_url: item.thumbnail_url
      })
    })

    this.data = [...tmp]
  },

  computed: {
    inputValue () {
      let mapFiles = this.value.map((item, index) => {
        return omit({
          ...item,
          thumbnail: item.thumbnail || item.content_url
        }, ['content_url'])
      })

      return [...mapFiles]
    }
  },

  methods: {
    handleChange (value, options) {
      value = options.map((item, index) => {
        value[index].thumbnail = item.data.attrs && item.data.attrs.thumbnail ? item.data.attrs.thumbnail : ''
        value[index].thumbnail_url = item.data.attrs && item.data.attrs.thumbnail_url ? item.data.attrs.thumbnail_url : ''
        return { ...value[index] }
      })

      this.$emit('change', value)
    },

    async fetchData (value) {
      this.lastFetchId += 1
      this.data = []
      this.fetching = true

      const fetchId = this.lastFetchId
      const query = {
        page: 1,
        per_page: 15,
        'sortBy[updated_at]': 'desc'
      }

      query[`fields[${this.options.model}]`] = `${this.options.fields}`
      query[`filters[${this.options.search_key}]`] = value
      query[`filters[${this.options.isSetting}]`] = 1
      query[`filters[${this.options.isActive}]`] = 1

      const response = await this.modelJavel.paginate({ query })

      if (fetchId !== this.lastFetchId) {
        // for fetch callback order
        return
      }

      this.data = response.data.length ? response.data : []
      this.fetching = false
    },

    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0
      )
    }
  }
}
</script>

<style scoped>

</style>
