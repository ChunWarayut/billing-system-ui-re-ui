<template>
  <v-app id="orders">
    <PageTitle title="Payment Receive" />
    <div class="my-5">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row class="pa-2" outlined tile>
            <v-col cols="12" md="2">
              <Input hideDetails="auto" label="ลูกค้า" v-model="searchText"></Input>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn depressed color="primary" @click="search()">
                ค้นหาลูกค้า
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-divider></v-divider>
    <v-card elevation="0">
      <v-data-table v-model="selected" :items="selected" :headers="headers" item-key="CustID" show-select 
        class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="720px">
              <v-card>
                <v-card-title>
                  <v-row no-gutters class="pb-2">
                    <v-col cols="12" sm="6" md="10">
                      <v-row outlined tile >
                        <v-col  cols="12" md="8" class="flex align-self-center">
                          <Input
                          label="ค้นหาลูกค้า"
                          type="text"
                          placeholder="Search Your Interest"
                          @input="debounceSearch()"
                          v-model="searchText"
                        />
                        </v-col>
                        </v-row>
                        <v-row outlined tile >
                          <v-col  cols="12" md="4" class="flex align-self-center">
                            <span class="text-h5">เลือกลูกค้า</span>
                          </v-col>
                        </v-row>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text class="p-0">
                  <v-data-table v-model="selectedEachCust" :items="paymentReceiveList" :headers="headersDialog" 
                    item-key="CustID" show-select class="elevation-1">
                    <template v-slot:item.remaamnt="{ item }">
                      <span>{{ new Intl.NumberFormat().format(item.remaamnt) }}</span>
                    </template>
                  </v-data-table>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="close">
                    ยกเลิก
                  </v-btn>
                  <v-btn color="primary" text @click="save">
                    ตกลง
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.remaamnt="{ item }">
          <span>{{ new Intl.NumberFormat().format(item.remaamnt) }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
      <v-card-actions style="position:sticky;bottom:;" class="text-h6">
        <v-spacer />
        <span class="font-weight-bold pr-2">ยอดรวม: </span> {{ new Intl.NumberFormat().format(summary) }}
      </v-card-actions>
      <v-card-actions style="position:sticky;bottom:;">
        <v-spacer />
        <v-btn @click="nextStep()" :disabled="selected.length == 0" color="primary">
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
import DatePicker from '../../components/Base/DatePicker.vue';
import Input from '../../components/Base/Input.vue';
import PageTitle from '../../components/Base/PageTitle.vue';
import Select from '../../components/Base/Select.vue';
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
      debounceTimeout: null,
      roles: [],
      permissions: [],
      searchText: null,
      showPassword: false,
      page: 1,
      amountPage: 0,
      selected: [],
      paymentReceives: [],
      selectedEachCust: [],
      headers: [
        {
          text: 'Customer Code',
          align: 'start',
          sortable: false,
          value: 'CustCode',
        },
        { text: 'Customer Name', value: 'CustName', sortable: false, align: 'start', },
        { text: 'Amount', value: 'remaamnt', sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      sortBy: 'orderdate',
      sortDesc: false,
      footerOptions: {
        itemsPerPageOptions: [10, 20],
      },
      headersDialog: [
        {
          text: 'Customer Code',
          align: 'start',
          sortable: false,
          value: 'CustCode',
        },
        { text: 'Customer Name', value: 'CustName', sortable: false, align: 'start', },
        { text: 'Amount', value: 'remaamnt', sortable: false },
      ],
      sortBy: 'orderdate',
      sortDesc: false,
      footerOptions: {
        itemsPerPageOptions: [10, 20],
      },
      dialog: false,
      dialogDelete: false,
      dialogResetPassword: false,
      editedIndex: -1,
      editedItem:   {
        CustID: "",
        SaleAreaID: "",
        CustCode: "",
        CustName: "",
        CreditDays: 1,
        CustAddr1: "",
        District: "",
        Amphur: "",
        Province: "",
        remaamnt: 0,
        Comp: "",
        CompCode: ""
      },
      defaultItem: {
        code: '',
        name: '',
        selectedPermissions: [],
        id: 0
      },
    }
  },
  async created() {
    await this.getLocation()
    await this.setPaymentReceiveData()
    // await this.setRoleData()
    // await this.setPermissionData()
  },
  async mounted() {
    await this.getLocation()
  },
  destroyed() {
  },
  watch: {
  },
  computed: {
    ...mapGetters("paymentreceive", ["paymentReceiveList", "selectedPaymentReceive", "geoLocation"]),
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    summary() {
      let sum = 0
      this.selected.forEach(item => {
        sum = sum + item.remaamnt
      });
      return sum
    }

  },
  methods: {
    ...mapActions('paymentreceive', ['getPaymentReceiveList']),
    async setPaymentReceiveData() {
      this.selected = Object.assign([], this.selectedPaymentReceive)
    },
    debounceSearch: function() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(async() => {
        await this.getPaymentReceiveList({ searchText: this.searchText || "" });
        this.paymentReceives = this.paymentReceiveList
      }, 500); // delay for half second
    },
    formatTime(datetime) {
      return moment(datetime).tz('Asia/Bangkok').format('DD-MM-YYYY HH:mm');
    },
    editItem(item) {
    },
    deleteItem(item) {
      this.editedIndex = this.selected.indexOf(item)
      this.editedItem = Object.assign({}, { ...item })
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.selected.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.showPassword = false
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async save() {
      this.selected = this.selected.concat(this.selectedEachCust)
      this.selectedEachCust = []
      this.close()
    },
    async search() {
      Swal.fire({
        title: 'รอสักครู่...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        width: 300,
        html: '<div class="spinner-border" role="status"><span class="sr-only">กำลังค้นหาข้อมูลลูกค้า</span></div>',
        onBeforeOpen: () => {
          Swal.showLoading()
        },
      })
      try {
        await this.getPaymentReceiveList({ searchText: this.searchText || "" });
        this.paymentReceives = this.paymentReceiveList
        Swal.close()
        this.dialog = true
      } catch (error) {
        Swal.close()
        await Swal.fire({
          title: 'เกิดความผิดพลาด',
          text: "มีบางอย่างผิดพลาดระหว่างค้นหาข้อมูล กรุณาลองใหม่อีกครั้ง",
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'ตกลง',
          reverseButtons: true
        })
      }
    },
    async nextStep() {
      this.$store.commit('paymentreceive/SET_SELECTED_PAYMENT_RECEIVE_FIRST', this.selected)
      this.$store.commit('paymentreceive/SET_CURRENT_STEP', 2)
    },
    async getLocation() {
      if(window.navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords
          this.$store.commit('paymentreceive/SET_LATITUDE', latitude)
          this.$store.commit('paymentreceive/SET_LONGTITUDE', longitude)
        },async err => {
          await Swal.fire({
            title: 'แจ้งเตือน',
            text: "กรุณาอนุุญาตการเข้าถึงตำแหน่งและทำการรีเฟรชเพจก่อนใช้งาน",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            reverseButtons: true
          })
        })
      }
    }
  },
}
</script>
<style scoped>
::v-deep .v-dialog>.v-card>.v-card__text {
  padding: 0 0 0 0;
}

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
