<template>
    <v-menu
      v-model="open"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
            style="font-size: 15px"
            v-if="rules"
            :id="id"
            :value="format"
            :rules="rules"
            v-bind="attrs"
            readonly
            :disabled="disabled"
            append-icon="mdi-calendar"
            :clearable="!readonly"
            placeholder="Select Date"
            outlined
            dense
            v-on="on"
            @click:clear="onClear"
            :label="label">
          <template v-slot:label>
            <span v-if="required" class="red--text">* </span>{{label}}
          </template>
        </v-text-field>
        <v-text-field
            style="font-size: 15px"
            v-else
            :id="id"
            :value="format"
            v-bind="attrs"
            hide-details
            readonly
            :disabled="disabled"
            append-icon="mdi-calendar"
            :clearable="!readonly"
            placeholder="Select Date"
            outlined
            dense
            v-on="on"
            @click:clear="onClear"
            :label="label"
        >
        <template v-slot:label>
          <span v-if="required" class="red--text">* </span>{{label}}
        </template>
        </v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        elevation="15"
        :disabled="disabled"
        :readonly="readonly"
        no-title
        @input="open = false"
        @change="$emit('change', date)"
        :max="maxDate"
      ></v-date-picker>
    </v-menu>
  </template>


  <script>
  export default {
    inheritAttrs: false,
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      rules: {
        type: Array,
        default: null
      },
      id: {
        type: String,
        default: null
      },
      label: {
        type: String,
        default: null
      },
      required: {
        type: Boolean,
        default: false
      },
      maxDate: {
        type: String,
        default: null,
      }
    },
    data() {
      return {
        date: this.value,
        open: false
      }
    },
    computed: {
      format() {
        if (!this.date) return null
        let dateText = {
          "01": "Jan",
          "02": "Feb",
          "03": "Mar",
          "04": "Apr",
          "05": "May",
          "06": "Jun",
          "07": "Jul",
          "08": "Aug",
          "09": "Sep",
          "10": "Oct",
          "11": "Nov",
          "12": "Dec"
        }
        const [year, month, day] = this.date.split('-')
        return `${day}-${dateText[month]}-${year}`
      }
    },
    watch: {
      value() {
        this.date = this.value
      }
    },
    methods: {
      onClear() {
        this.date = null
        this.$emit('change', this.date)
      }
    }
  }
  </script>
