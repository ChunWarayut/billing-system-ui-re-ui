<template>
  <v-app id="orders">
    <PageTitle title="Payment Receive" />
    <div class="my-5">
      <div class="font-weight-bold">
        เลือกวิธีการชำระเงิน
      </div>
    </div>
    <v-divider></v-divider>
    <v-card elevation="0">
      <div v-for="(pr, i) in row" :key="i" class="px-5 pt-3">
        <span class="font-weight-bold">ลูกค้า</span> {{ pr.CustCode }}: {{ pr.CustName }}
        <v-checkbox v-model="pr.cash" label="เงินสด" hide-details>
        </v-checkbox>
        <v-checkbox v-model="pr.transfer" label="เงินโอน" hide-details>
        </v-checkbox>
        <v-checkbox v-model="pr.check" label="เช็ค" hide-details>
        </v-checkbox>
        <v-checkbox class="pb-3" v-model="pr.creditcard" label="บัตรเครดิต" hide-details>
        </v-checkbox>
        <v-divider></v-divider>
      </div>

      <v-card-actions style="position:sticky;bottom:;">
        <v-btn color="primary" @click="previousStep()">
          Previous
        </v-btn>
        <v-spacer />
        <v-btn color="primary" @click="nextStep()">
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
import moment from 'moment-timezone';
import Swal from 'sweetalert2';
import { mapActions, mapGetters } from "vuex";
import DatePicker from '../Base/DatePicker.vue';
import Input from '../Base/Input.vue';
import PageTitle from '../Base/PageTitle.vue';
import Select from '../Base/Select.vue';
export default {
  layout: 'default',
  name: 'IndexPage',
  components: {
    PageTitle,
    Select,
    DatePicker,
    Input,
  },
  data() {
    return {
      roles: [],
      permissions: [],
      searchText: null,
      showPassword: false,
      page: 1,
      amountPage: 0,
      paymentReceives: [],
      sortBy: 'orderdate',
      sortDesc: false,
      selected: [],
      selectedItem: [],
      row: [],
    }
  },
  async created() {
    await this.setPaymentReceiveData()
  },
  async mounted() {
    this.selectedPaymentReceive.forEach((pr, i) => {
      this.row.push({
        ...pr,
        files: [],
        remaamnt: pr.remaamnt
      })
    })
  },
  destroyed() {
  },
  computed: {
    ...mapGetters("paymentreceive", ["selectedPaymentReceive"]),
    
  },
  methods: {
    async setPaymentReceiveData() {
      this.selectedItem = Object.assign([], this.selectedPaymentReceive)
    },
    async nextStep() {
      let isValid = true
      for(const item of this.row){
        if(item.cash == false && item.check  == false && item.transfer  == false && item.creditcard == false){
          isValid = false
          break
        }
      }
      if(isValid){
        this.$store.commit('paymentreceive/SET_SELECTED_PAYMENT_RECEIVE', this.row)
        this.$store.commit('paymentreceive/SET_CURRENT_STEP', 3)
      }else{
        await Swal.fire({
            title: 'กรุณาเลือกวิธีการชำระเงินของลูกค้า',
            icon: 'warning',
          })
      }
    },
    async previousStep() {
      this.$store.commit('paymentreceive/SET_SELECTED_PAYMENT_RECEIVE', this.row)
      this.$store.commit('paymentreceive/SET_CURRENT_STEP', 1)
    },
  },
}
</script>
<style scoped>
.s-input {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-grow: 1;
}

.s-btn {
  display: flex;
  gap: 10px;
}

.btn-icon {
  cursor: pointer;
}

.btn-icon.disabled {
  cursor: initial;
}
</style>
