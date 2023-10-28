<template>
    <v-select
      v-if="rules"
        :items="items"
        :label="label"
        :rules="rules"
        :dense="dense"
        :outlined="outlined"
        return-object
        :item-text="itemText"
        :item-value="itemValue"
        @input="input"
        :value="value"
        :required="required"
        :hide-details="hideDetails"
        >
      <template v-slot:label>
        <span v-if="required" class="red--text">* </span>{{ label }}
      </template>
    </v-select>
    <v-select
      v-else
        :items="items"
        :label="label"
        :dense="dense"
        :outlined="outlined"
        return-object
        :item-text="itemText"
        :item-value="itemValue"
        @input="input"
        :value="value"
        :required="required"
        :hide-details="hideDetails"
        >
      <template v-slot:label>
        <span v-if="required" class="red--text">* </span>{{ label }}
      </template>
    </v-select>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    items: {
      type: [Object, Array],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    value: {
      type: Object,
      default: null
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: null,
    },
    itemText: {
      type: String,
      default: 'text',
    },
    itemValue: {
      type: String,
      default: "key",
    },
    hideDetails: {
      type: String,
      default: null,
    },
    dense: {
      type: Boolean,
      default: true,
    },
    outlined: {
      type: Boolean,
      default: true,
    },   
  },
  methods: {
    input(result, index) {
      this.$emit('input', result || null)
    },
  }
}
</script>