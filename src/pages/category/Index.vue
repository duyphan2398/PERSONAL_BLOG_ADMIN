<template>
  <div id="CategoryIndex">
    <a-table
            :columns="columns"
             :data-source="list"
             :loading="isLoading"
             :rowKey="randomUniqueID"
             :pagination="{
               ...pagination,
               showSizeChanger: true,
               buildOptionText: buildOptionText,
               pageSizeOptions: ['30', '15', '4'],
               showTotal: showTotal
             }"
             :rowClassName="handleHighlight"
             @change="onPageChange">

      <template slot="color" slot-scope="color">
        <span class="badge mb-1" :style="{'background-color': color}" > {{ color }} </span>
      </template>

      <template slot="thumbnail" slot-scope="thumbnail">
        <img class="avatar avatar-lg img-thumbnail-list" :src="thumbnail | imageThumbnailObject" alt=""/>
      </template>

      <template slot="categories" slot-scope="post">
        <div class="tag-wrap" v-for="categoryId in post.categories"  :key="categoryId">
          <template v-for=" (categoryItem, index) in categories">
            <span v-if="categoryItem.id === categoryId" :key="index"  class="badge mb-1" :style="{'background-color': categoryItem.color}" > {{ categoryItem.display_name }} </span>
          </template>
        </div>
      </template>
      <!--Custom badge active-->
      <template slot="is_active" slot-scope="is_active">
        <span class="badge bg-green" v-if="is_active"> {{$t('active')}} </span>
        <span class="badge bg-gray" v-else> {{$t('inactive')}} </span>
      </template>

      <!--Custom type table-->
      <template slot="action" slot-scope="action">
        <div class="btn-list justify-content-start">
          <a-tooltip placement="bottom" :title="$t('tooltip_edit')">
            <button @click="handleEdit(action.id)" class="btn btn-primary font-weight-light">
              <EditIcon size="16"/>
            </button>
          </a-tooltip>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import Post from '@/models/Post'
import Category from '@/models/Category'
import Form from '@/mixins/form.mixin'
import Table from '@/mixins/table.mixin'
import { convertPagination } from '@/utils/filters'
import Search from './Search'
import { EditIcon, Trash2Icon, PlusIcon } from 'vue-feather-icons'

export default {
  name: 'Index',

  mixins: [Table, Form],

  components: {
    Search,
    EditIcon,
    Trash2Icon,
    PlusIcon
  },

  async beforeRouteEnter (to, from, next) {
    const categories = await Category.paginate({
      query: {
        per_page: 0
      }
    })
    to.meta['list'] = categories.data
    to.meta['pagination'] = convertPagination(categories.pagination)

    return next()
  },

  data () {
    return {
      isLoading: false,
      list: [],
      pagination: {},
      filter: {},
      categories: [],
      perPage: ''
    }
  },

  computed: {
    columns () {
      return [
        {
          title: this.$t('column_category_thumbnail'),
          dataIndex: 'file',
          scopedSlots: { customRender: 'thumbnail' },
          width: 120
        },
        {
          title: this.$t('column_category_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('column_category_display_name'),
          dataIndex: 'display_name'
        },
        {
          title: this.$t('column_category_color'),
          dataIndex: 'color',
          scopedSlots: { customRender: 'color' }
        },
        {
          title: '',
          scopedSlots: { customRender: 'action' },
          width: 150,
          align: 'center'
        }
      ]
    }
  },

  created () {
    this.list = this.$route.meta['list']
    this.pagination = this.$route.meta['pagination']
  },

  methods: {
    async onPageChange (pagination) {
      this.perPage = pagination.pageSize
      const params = {
        page: pagination.current,
        per_page: pagination.pageSize
      }

      await this.fetchList(params)
    },

    async onFilterChange ($event) {
      const params = {
        page: 1,
        per_page: this.perPage || 5
      }

      this.filter = {...$event}

      await this.fetchList(params)
    },

    async fetchList (params = {}) {
      this.isLoading = true
      const filter = {}

      for (let property in this.filter) {
        filter[`filters[${property}]`] = this.filter[property]
      }

      try {
        const resp = await Post.paginate({
          query: {
            'sortBy[updated_at]': 'desc',
            ...params,
            ...filter
          }
        })

        this.list = [...resp.data]
        this.pagination = convertPagination(resp.pagination)
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },

    handleHighlight (record) {
      return !record.is_active ? 'active' : ''
    },

    async handleEdit (id) {
      this.$router.push({
        name: 'post.edit',
        params: {
          id: id
        }
      }).catch(_ => {})
    },

    async handleDelete (id) {
      const params = {
        page: 1,
        per_page: this.perPage || 5
      }

      await Post.delete(id)

      await this.fetchList(params)
    }
  }
}
</script>

<style scoped>

</style>
