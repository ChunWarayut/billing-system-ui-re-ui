<template>
    <v-text-field
      style="font-size: 15px"
      v-if="rules"
        :label="label"
        :rules="rules"
        outlined
        dense
        @input="onInput"
        :value="value"
        :type="inputType"
        :required="required"
        :disabled="disabled"
        :hide-details="hideDetails">
      <template v-slot:label>
        <span v-if="required" class="red--text">* </span> {{label}}
      </template></v-text-field>
    <v-text-field
      style="font-size: 15px"
      v-else
        :label="label"
        outlined
        dense
        @input="onInput"
        :value="value"
        :type="inputType"
        :required="required"
        :disabled="disabled"
        :hide-details="hideDetails">
      <template v-slot:label>
        <span v-if="required" class="red--text">* </span> {{label}}
      </template>
    </v-text-field>
</template>


<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    label: {
      type: String,
      default: null,
    },
    value:{
      type: String,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: String,
      default: null,
    },
    inputType: {
      type: String,
      default: null,
    },
  },
  methods: {
    onInput(data) {
      this.$emit('input', data);
    },
  }
}
</script>