<template>
  <v-row justify="center">
    <v-dialog v-model="open" width="550" persistent>
      <v-card class="pt-5 px-5">
        <div class="py-5" v-html="description"></div>
        <Input v-if="textInputEnabled" :label="textInputLabel" v-model=textInput></Input>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" depressed @click="onClickConfirm" class="mr-5"> Confirm </v-btn>
          <v-btn depressed @click="onClickClose"> No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import Input from './Input.vue';
export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input',
  },
  components: {
    Input,
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
    textInputEnabled: {
      type: Boolean,
      default: false,
    },
    textInputLabel: {
      type: String,
      default: '',
    },
  },
  methods: {
    onClickClose() {
      this.$emit('close');
    },
    onClickConfirm() {
      if (this.textInputEnabled) this.$emit('confirm', this.textInput);
      else this.$emit('confirm');
      this.textInput = '';
    },
  },
}
</script>
