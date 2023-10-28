<template>
    <div>
       <Auth/>
    </div>
</template>


<script>
import Auth from '../../components/Auth/index.vue'
export default {
  layout:'guest',
  name: 'IndexPage',
  components:{
    Auth
  },
}
</script>
<style scoped>

</style>
