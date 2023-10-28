<template>
  <v-app id="orders">
    <PageTitle title="Payment Receive" />
    <div class="my-5">
      <div class="font-weight-bold">
        สรุปช้อมูล
      </div>
    </div>
    <v-divider></v-divider>
    <v-card elevation="0" class="">
      <div v-for="(pr, i) in selectedItem" :key="i" class="py-2 px-5">
        <v-row no-gutters class="pb-2">
          <v-col cols="12" sm="6" md="8">
            <v-row outlined tile>
              <v-col cols="12" md="6" class="flex align-self-center">
                <span class="font-weight-bold">ลูกค้า</span> {{ pr.custcode }}: {{ pr.custName }}
              </v-col>
            </v-row>
            <v-row outlined tile>
              <v-col cols="12" md="6" class="flex align-self-center">
                ชำระโดย: {{ paymentTypeString(pr.cash, pr.transfer, pr.check, pr.creditcard) }}
              </v-col>
              <v-col cols="12" md="6" class="flex align-self-center">
                ยอดชำระครั้งนี้ : {{ new Intl.NumberFormat().format(pr.remaamnt) }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-data-table v-model="selected" :items="pr.excutedInvoice" :headers="headers" item-key="id"
          class="elevation-1 mb-3" hide-default-footer>
          <template v-slot:item.Qty_Buy="{ item }">
            <span>{{ new Intl.NumberFormat().format(item.Qty_Buy) }}</span>
          </template>
          <template v-slot:item.used="{ item }">
            <span>{{ new Intl.NumberFormat().format(item.used) }}</span>
          </template>
        </v-data-table>
        <v-divider></v-divider>
      </div>

      <v-card-actions style="position:sticky;bottom:;">
        <v-btn color="primary" @click="previousStep()">
          Previous
        </v-btn>
        <v-spacer />
        <v-btn color="primary" @click="nextSave()">
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
      selected: [],
      paymentReceives: [],
      sortBy: 'orderdate',
      sortDesc: false,
      selected: [],
      selectedItem: [],
      headers: [
        { text: 'Invoice', value: 'InvNo', sortable: false },
        { text: 'ยอดค้างชำระปัจจุบัน', value: 'Qty_Buy', sortable: false },
        { text: 'ยอดชำระครั้งนี้', value: 'used', sortable: false },
      ]
    }
  },
  async created() {
    await this.setPaymentReceiveData()
  },
  async mounted() {
  },
  destroyed() {
  },
  watch: {
  },
  computed: {
    ...mapGetters("paymentreceive", ["paymentReceiveList", "selectedPaymentReceive", "summaryData"]),
  },
  methods: {
    ...mapActions('paymentreceive', ['getPaymentReceiveList', 'savePaymentReceive']),
    async setPaymentReceiveData() {

    },
    async setPaymentReceiveData() {
      await this.getPaymentReceiveList({ search: this.searchText || "" });
      this.selectedItem = Object.assign([], this.selectedPaymentReceive)
      this.paymentReceives = this.paymentReceiveList
    },
    async nextSave() {
      await Swal.fire({
        title: 'คุณต้องการยืนยันการบันทึกหรือไม่?',
        text: "คุณจะไม่สามารถย้อนกลับได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'รอสักครู่...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            width: 300,
            html: '<div class="spinner-border" role="status"><span class="sr-only">กำลังบันทึกข้อมูล</span></div>',
            onBeforeOpen: () => {
              Swal.showLoading()
            },
          })
          await this.savePaymentReceive({ pr: this.selectedItem });
          await Swal.fire({
            title: 'บันทึกข้อมูลเรียบร้อย',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.$store.commit('paymentreceive/SET_SELECTED_PAYMENT_RECEIVE_FIRST', [])
              this.$store.commit('paymentreceive/SET_CURRENT_STEP', 1)
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
              this.$router.push('/paymentreceive')
            }
          })
          Swal.close()
        }
      })

    },
    async previousStep() {
      this.$store.commit('paymentreceive/SET_CURRENT_STEP', 3)
    },
    paymentTypeString(cash, transfer, check, creditcard) {
      let msg = []
      if (cash) msg.push("เงินสด")
      if (transfer) msg.push("เงินโอน")
      if (check) msg.push("เช็ค")
      if (creditcard) msg.push("บัตรเครดิต ")
      if (msg.length > 0) {
        return msg.toString()
      } else {
        return ""
      }
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
