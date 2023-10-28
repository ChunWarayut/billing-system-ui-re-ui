<template>
    <div class="font-title-page font-weight-bold">
        {{ title }}
    </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: null
    },
  }
}
</script>

<style lang="scss" scoped>
.font-title-page {
  font-size: 28px;
  color: #605959;
}
</style>