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
      <a-select
        show-search
        style="width: 100%"
        :value="value"
        :filter-option="filterOption"
        :disabled="disabled"
        option-filter-prop="children"
        @change="handleChange">
        <a-select-option value="">
          {{$t('select_option_empty')}}
        </a-select-option>

        <a-select-option v-for="(item, index) in options.data"
                         :key="index"
                         :value="item[options.id]">
          {{ item[options.code] ? item[options.code] + '：' : '' }}{{ item[options.key] }}
        </a-select-option>
      </a-select>

      <!--Message Error-->
      <span v-if="errors[0]" class="errors">{{ errors[0] }}</span>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'InputCategory',

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
      type: [String, Number],
      default: ''
    },

    options: {
      type: Object,
      required: true
    },

    required: {
      type: Boolean,
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    },

    filterRole: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleChange (value) {
      this.$emit('change', value)

      if (this.filterRole) {
        this.$emit('handle-filter-role')
      }
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
