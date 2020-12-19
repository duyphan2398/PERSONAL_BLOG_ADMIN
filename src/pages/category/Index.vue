<template>
  <div id="CategoryIndex">
    <a-table
        :columns="columns"
        :data-source="list"
        :loading="isLoading"
        :pagination="false"
        :rowKey="randomUniqueID"
        :rowClassName="handleHighlight">

      <template slot="color" slot-scope="color">
        <span class="badge mb-1" :style="{'background-color': color}"> {{ color }} </span>
      </template>

      <template slot="label" slot-scope="title">
        {{ title | truncate('...', 20) }}
      </template>

      <template slot="thumbnail" slot-scope="thumbnail">
        <img class="avatar avatar-lg img-thumbnail-list" :src="thumbnail | imageThumbnailObject" alt=""/>
      </template>

      <!--Custom badge active-->
      <template slot="is_active" slot-scope="is_active">
        <span class="badge bg-green" v-if="is_active"> {{ $t('active') }} </span>
        <span class="badge bg-gray" v-else> {{ $t('inactive') }} </span>
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
import Category from '@/models/Category'
import Form from '@/mixins/form.mixin'
import Table from '@/mixins/table.mixin'
import { EditIcon, Trash2Icon, PlusIcon } from 'vue-feather-icons'

export default {
  name: 'Index',

  mixins: [Table, Form],

  components: {
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
    return next()
  },

  data () {
    return {
      isLoading: false,
      list: []
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
          title: this.$t('column_category_display_name'),
          dataIndex: 'display_name'
        },
        {
          title: this.$t('column_category_color'),
          dataIndex: 'color',
          scopedSlots: { customRender: 'color' }
        },
        {
          title: this.$t('column_category_title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'label' }
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
  },

  methods: {
    handleHighlight (record) {
      return !record.is_active ? 'active' : ''
    },

    async handleEdit (id) {
      this.$router.push({
        name: 'category.edit',
        params: {
          id: id
        }
      }).catch(_ => {})
    }
  }
}
</script>

<style scoped>

</style>
