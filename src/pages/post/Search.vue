<template>
  <a-card class="card-common">
    <div class="card-status-top bg-warning"></div>

    <!--Form-->
    <form role="search" @submit.prevent="search">
      <div class="row">

        <!--news_title-->
        <div class="col-12 col-md-6 mb-2">
          <label class="form-label">{{$t('label_search_title')}}</label>

          <a-input v-model="filter.title"/>
        </div>

        <!--news_public_time-->
        <div class="col-12 col-md-6 mb-2">
          <label class="form-label">{{$t('label_search_duration')}}</label>

          <a-range-picker
              style="width: 100%;"
              :locale="locale"
              v-decorator="['range-time-picker', rangeConfig]"
              v-model="dateRange"
              @change="getRangePicker"
              :placeholder="[$t('start_time'), $t('end_time')]"
              format="YYYY-MM-DD HH:mm">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </div>

        <!--Category-->

        <InputCategoryMulti v-model="filter.category_id"
                            class="col-12 col-md-6 mb-2"
                            label="label_search_category"
                            :options="optionsCategory"/>

        <!--is_active-->
        <div class="col-12 col-md-6 mb-2">
          <label class="form-label">{{$t('status')}}</label>
          <a-select
              show-search
              style="width: 100%"
              v-model="filter.is_active">
            <a-select-option value="">
              {{$t('select_option_empty')}}
            </a-select-option>
            <a-select-option value="1">
              {{$t('select_option_active')}}
            </a-select-option>
            <a-select-option value="0">
              {{$t('select_option_inactive')}}
            </a-select-option>
          </a-select>
        </div>

        <!--Search & Reset-->
        <div class="col-12 col-md-6 ml-auto">
          <label class="form-label" v-html="'&nbsp;'"/>

          <div class="row">
            <div class="col-6">
              <button type="button" @click="reset" class="btn btn-light btn-block border-0">
                <RefreshCwIcon size="14" class="mr-1"/>
                {{$t('btn_reset')}}
              </button>
            </div>

            <div class="col-6">
              <button type="submit" class="btn btn-warning btn-block border-0">
                <SearchIcon size="14" class="mr-1"/>
                {{$t('btn_search')}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </a-card>
</template>

<script>
import { RefreshCwIcon, SearchIcon } from 'vue-feather-icons'
import locale from 'ant-design-vue/es/date-picker/locale/en_US'
import InputCategoryMulti from '@/components/form/InputCategoryMulti'
export default {
  name: 'Search',
  data () {
    return {
      locale,
      dateRange: [],
      filter: {
        title: '',
        category_id: [],
        publish_start_datetime: '',
        publish_end_datetime: '',
        is_active: ''
      },
      rangeConfig: []
    }
  },

  props: {
    categories: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  components: {
    SearchIcon,
    RefreshCwIcon,
    InputCategoryMulti
  },

  computed: {
    optionsCategory () {
      return {
        data: this.categories,
        id: 'id',
        key: 'display_name'
      }
    }
  },

  methods: {
    search () {
      this.$emit('filter-changed', this.filter)
    },

    reset () {
      this.dateRange = []

      for (let property in this.filter) {
        if (this.filter.hasOwnProperty(property)) {
          this.filter[property] = ''
        }
      }

      this.$emit('filter-changed', this.filter)
    },

    getRangePicker (dates, dateStrings) {
      this.filter.publish_start_datetime = dateStrings[0]
      this.filter.publish_end_datetime = dateStrings[1]
    },

    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0
      )
    }
  }
}
</script>

<style lang="postcss" scoped>

</style>
