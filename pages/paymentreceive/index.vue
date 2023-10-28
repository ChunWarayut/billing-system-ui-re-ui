<template>
    <div>
       <div v-if="currentStep == 1">
        <FirstStep/>
       </div>
       <div v-if="currentStep == 2">
        <SecondStep/>
       </div>
       <div v-if="currentStep == 3">
        <ThirdStep/>
       </div>
       <div v-if="currentStep == 4">
        <FourthStep/>
       </div>
    </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import FirstStep from '../../components/PaymentReceive/firstStep.vue'
import SecondStep from '../../components/PaymentReceive/secondStep.vue'
import ThirdStep from '../../components/PaymentReceive/thirdStep.vue'
import FourthStep from '../../components/PaymentReceive/fourthStep.vue'
export default {
  layout:'default',
  name: 'IndexPage',
  components:{
    FirstStep,
    SecondStep,
    ThirdStep,
    FourthStep
  },
  computed: {
    ...mapGetters("paymentreceive", ["currentStep"]),
  },
  async created() {
    this.getLocation()
    this.$store.commit('paymentreceive/SET_SELECTED_PAYMENT_RECEIVE_FIRST', [])
    this.$store.commit('paymentreceive/SET_RECEIVE_DATA', {
        receiveCash: undefined,
        receiveCheck: undefined,
        receiveTransfer: undefined,
        receiveCreditcard: undefined,
        receiveCashBank: undefined,
        receiveTransferBank: undefined,
        receiveCheckBank: undefined,
        checkdate: undefined,
        checkno: undefined,
    })
    this.$store.commit('paymentreceive/SET_ATTACHMENT_FILES', {
          cashFiles: [],
          checkFiles: [],
          transferFiles: [],
          creditCardFiles: []
        })
    this.$store.commit('paymentreceive/SET_CURRENT_STEP', 1)
  },

  methods: {
    getLocation() {
      if(window.navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude} = position.coords
          this.$store.commit('paymentreceive/SET_LATITUDE', latitude)
          this.$store.commit('paymentreceive/SET_LONGTITUDE', longitude)
        })
      }
    }
  }
}
</script>
<style scoped>

</style>
