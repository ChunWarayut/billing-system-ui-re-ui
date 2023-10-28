<template>
  <v-row justify="center">
    <v-dialog v-model="open" width="550" persistent>
      <v-card class="pt-5 px-5">
        <v-card-title class="pa-0">
          {{ title }}
        </v-card-title>
        <div class="py-5" v-html="description"></div>
        <v-card-actions class="d-flex py-3 justify-end">
          <v-btn color="primary" depressed @click="onClickClose"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
export default {
  inheritAttrs: true,
  model: {
    prop: 'value',
    event: 'input',
  },
  components: {
  },
  data() {
    return {
      textInput: '',
    };
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: null,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClickClose() {
      this.$emit('close');
    },
  },
}
</script>
