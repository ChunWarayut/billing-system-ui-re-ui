<template>
  <v-app id="orders">
    <PageTitle title="Payment Receive" />
    <div class="my-5">
      <div class="font-weight-bold">
        หลักฐานการชำระเงิน
      </div>
    </div>
    <v-divider></v-divider>
    <v-card elevation="0" class="">
      <div v-for="(pr, i) in row" :key="i" class="py-2 px-5">
        <v-row no-gutters class="pb-2">
          <v-col cols="12" sm="6" md="8">
            <v-row outlined tile>
              <v-col cols="12" class="flex align-self-center">
                <span class="font-weight-bold">ลูกค้า</span> {{ pr.CustCode }}: {{ pr.CustName }}
              </v-col>
            </v-row>
            <v-row outlined tile>
              <v-col cols="12" class="flex align-self-center">
                ยอดทั้งหมด: {{ new Intl.NumberFormat().format(pr.remaamnt)  }}
              </v-col>
              <v-col v-if="pr.cash" cols="3" md="6" class="flex align-self-center">
                เงินสด
              </v-col>
              <v-col v-if="pr.cash" cols="9" md="6" class="flex align-self-center">
                 <!-- a<input  type="number" onkeyup="if(this.value<0){this.value= this.value * -1}" min="0" onblur="if(this.value && (this.value%1!=0)){this.value= parseFloat(this.value).toFixed(2)}"> -->
                 <!-- <Input hideDetails="auto" label="จำนวน" v-model="pr.cashamount" inputType="number" :min="0" onblur="if(this.value && (this.value%1!=0)){this.value= parseFloat(this.value).toFixed(2)}" onkeyup="if(this.value<0){this.value= this.value * -1}" ></Input> -->
                <v-text-field outlined dense hideDetails="auto" v-model="pr.cashamount" label="จำนวน" @blur="roundFloat($event, pr.cashamount, i, 'cashamount')" type="number" min="0" ></v-text-field>
              </v-col>
              <v-col v-if="pr.transfer" cols="3" md="6"  class="flex align-self-center">
                เงินโอน
              </v-col>
              <v-col v-if="pr.transfer" cols="9" md="6" class="flex align-self-center">
                <v-text-field outlined dense hideDetails="auto" v-model="pr.transferamont" label="จำนวน" @blur="roundFloat($event, pr.transferamont, i, 'transferamont')" type="number" min="0" ></v-text-field>
              </v-col>
              <v-col v-if="pr.check" cols="3" md="6"  class="flex align-self-center">
                เช็ค
              </v-col>
              <v-col v-if="pr.check" cols="9" md="6" class="flex align-self-center">
                <v-text-field outlined dense hideDetails="auto" v-model="pr.checkamont" label="จำนวน" @blur="roundFloat($event, pr.checkamont, i, 'checkamont')" type="number" min="0" ></v-text-field>
              </v-col>
              <v-col v-if="pr.creditcard" cols="3" md="6"  class="flex align-self-center">
                บัตรเครดิต
              </v-col>
              <v-col v-if="pr.creditcard" cols="9" md="6" class="flex align-self-center">
                <v-text-field outlined dense hideDetails="auto" v-model="pr.creditcardamont" label="จำนวน" @blur="roundFloat($event, pr.creditcardamont, i, 'creditcardamont')" type="number" min="0" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </div>
      <div class="py-2 px-5">
        <span class="font-weight-bold">รวมยอดเงินที่กรอกแล้ว</span>
        <v-row no-gutters class="pb-2 pt-5">
          <v-col cols="12" sm="6" md="8">
            <v-row outlined tile>
              <v-col v-if="isShowCash" cols="3" md="6" class="flex align-self-center">
                เงินสด
              </v-col>
              <v-col v-if="isShowCash" cols="9" md="6" class="flex align-self-center">
                {{ new Intl.NumberFormat().format(sumCash) }}
              </v-col>
              <v-col v-if="isShowTransfer" cols="3" md="6"  class="flex align-self-center">
                เงินโอน
              </v-col>
              <v-col v-if="isShowTransfer" cols="9" md="6" class="flex align-self-center">
                {{ new Intl.NumberFormat().format(sumTransfer) }}
              </v-col>
              <v-col v-if="isShowCheck" cols="3" md="6"  class="flex align-self-center">
                เช็ค
              </v-col>
              <v-col v-if="isShowCheck" cols="9" md="6" class="flex align-self-center">
                {{ new Intl.NumberFormat().format(sumCheck) }}
              </v-col>
              <v-col v-if="isShowCreditcard" cols="3" md="6"  class="flex align-self-center">
                บัตรเครดิต
              </v-col>
              <v-col v-if="isShowCreditcard" cols="9" md="6" class="flex align-self-center">
                {{ new Intl.NumberFormat().format(sumCreditcard) }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </div>
      <div class="py-2 px-5" >
        <span class="font-weight-bold">แนบหลักฐานการชำระเงิน</span>
        <v-row no-gutters class="pb-2">
          <v-col cols="12" sm="6" md="12">
            <v-row outlined tile >
              <v-col v-if="isShowCash" cols="12" md="2" class="flex align-self-center">
                เงินสด
              </v-col>
              <v-col  v-if="isShowCash"  cols="12" md="2" class="flex align-self-center">
                <v-text-field outlined dense hideDetails="auto" v-model="receiveCash" label="จำนวน" @blur="roundFloatAttachment($event, receiveCash, 'receiveCash')" type="number" min="0" ></v-text-field>
              </v-col>
              <v-col  v-if="isShowCash"  cols="12" md="4" class="flex align-self-center">
                <v-select
                  v-model="receiveCashBank"
                  :items="banks"
                  item-value="index"
                  item-text="name"
                  label="ธนาคาร"
                />
              </v-col>
              <v-col v-if="isShowCash" cols="12" md="4" class="flex align-self-center">
                <v-file-input multiple accept="image/*, .pdf" chips label="แนบไฟล์" v-model="cashFiles"
                  @change="upload($event, i)"></v-file-input>
              </v-col>

              <v-col v-if="isShowTransfer" cols="12" md="2"  class="flex align-self-center">
                เงินโอน
              </v-col>
              <v-col v-if="isShowTransfer"  cols="12" md="2" class="flex align-self-center">
                <v-text-field outlined dense hideDetails="auto" v-model="receiveTransfer" label="จำนวน" @blur="roundFloatAttachment($event, receiveTransfer, 'receiveTransfer')" type="number" min="0" ></v-text-field>
              </v-col>
              <v-col v-if="isShowTransfer"  cols="12" md="4" class="flex align-self-center">
                <v-select
                  v-model="receiveTransferBank"
                  :items="banks"
                  item-value="index"
                  item-text="name"
                  label="ธนาคาร"
                />
              </v-col>
              <v-col v-if="isShowTransfer" cols="12" md="4" class="flex align-self-center">
                <v-file-input multiple accept="image/*, .pdf" chips label="แนบไฟล์" v-model="checkFiles"
                  @change="upload($event, i)"></v-file-input>
              </v-col>

              <v-col v-if="isShowCheck" cols="12" md="2"  class="flex align-self-center">
                เช็ค
              </v-col>
              <v-col v-if="isShowCheck"  cols="12" md="2" class="flex align-self-center">
                <v-text-field outlined dense hideDetails="auto" v-model="receiveCheck" label="จำนวน" @blur="roundFloatAttachment($event, receiveCheck, 'receiveCheck')" type="number" min="0" ></v-text-field>
              </v-col>
              <v-col v-if="isShowCheck" cols="12" md="4" class="flex align-self-center">
                <DatePicker
                  label="วันที่เช็ค"
                  v-model="checkdate"
                ></DatePicker>
              </v-col>
              <v-col v-if="isShowCheck" cols="12" md="4" class="flex align-self-center">
                <v-text-field outlined dense hideDetails="auto" v-model="checkno" label="เลขที่เช็ค"></v-text-field>
              </v-col>
              <v-col v-if="isShowCheck" cols="12" md="2"  class="flex align-self-center">
              </v-col>
              <v-col v-if="isShowCheck"  cols="12" md="5" class="flex align-self-center">
                <v-select
                  v-model="receiveCheckBank"
                  :items="banks"
                  item-value="index"
                  item-text="name"
                  label="ธนาคาร"
                />
              </v-col>
              <v-col v-if="isShowCheck" cols="12" md="5" class="flex align-self-center">
                <v-file-input multiple accept="image/*, .pdf" chips label="แนบไฟล์" v-model="transferFiles"
                  @change="upload($event, i)"></v-file-input>
              </v-col>

              <v-col v-if="isShowCreditcard" cols="12" md="2"  class="flex align-self-center">
                บัตรเครดิต
              </v-col>
              <v-col v-if="isShowCreditcard"  cols="12" md="5" class="flex align-self-center">
                <v-text-field outlined dense hideDetails="auto" v-model="receiveCreditcard" label="จำนวน" @blur="roundFloatAttachment($event, receiveCreditcard, 'receiveCreditcard')" type="number" min="0" ></v-text-field>
              </v-col>
              <v-col v-if="isShowCreditcard" cols="12" md="5" class="flex align-self-center">
                <v-file-input multiple accept="image/*, .pdf" chips label="แนบไฟล์" v-model="creditCardFiles"
                  @change="upload($event, i)"></v-file-input>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
      readers: [],
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
      row: [],
      cashFiles:[],
      checkFiles:[],
      transferFiles:[],
      creditCardFiles: [],
      isShowCash: false,
      isShowCheck: false,
      isShowTransfer: false,
      isShowCreditcard: false,
      receiveCash: undefined,
      receiveCheck: undefined,
      receiveTransfer: undefined,
      receiveCreditcard: undefined,
      receiveCashBank: undefined,
      receiveTransferBank: undefined,
      receiveCheckBank: undefined,
      banks: [],
      checkdate: "",
      checkno: "",
      // sumCash: 0,
      // sumTransfer: 0,
      // sumCheck: 0,
      // sumCreditcard: 0,
    }
  },
  async created() {
    await this.getBankList();
    await this.setPaymentReceiveData()
    this.isShowAttachment()
    this.getReceiveData()
    this.banks = this.bankList;
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
    ...mapGetters("paymentreceive", ["paymentReceiveList", "selectedPaymentReceive", "receiveData"]),
    ...mapGetters("bank", ["bankList"]),
    sumCash() {
      let sum = 0
      this.row.forEach(val => {
        if(val.cashamount){
          sum = sum + Number(val.cashamount)
        }
      })
      return sum
    },
    sumTransfer() {
      let sum = 0
      this.row.forEach(val => {
        if(val.transferamont){
          sum = sum + Number(val.transferamont)
        }
      })
      return sum
    },
    sumCheck() {
      let sum = 0
      this.row.forEach(val => {
        if(val.checkamont){
          sum = sum + Number(val.checkamont)
        }
      })
      return sum
    },
    sumCreditcard() {
      let sum = 0
      this.row.forEach(val => {
        if(val.creditcardamont){
          sum = sum + Number(val.creditcardamont)
        }
      })
      return sum
    },
  },
  methods: {
    ...mapActions('paymentreceive', ['getPaymentReceiveList', 'savePaymentReceive', 'executeInvoice']),
    ...mapActions("bank", ["getBankList"]),
    async setPaymentReceiveData() {
      this.paymentReceives = this.paymentReceiveList
    },
    roundFloat(event, value, index, name) {
      if(value < 0 ){
        value = value * -1
      }
      this.row[index][name] = value % 1 == 0 ? value : parseFloat(value).toFixed(2)
      return 
    },
    roundFloatAttachment(event, value, name) {
      if(value < 0 ){
        value = value * -1
      }
      this[name] = value % 1 == 0 ? value : parseFloat(value).toFixed(2)
      return 
    },
    async nextStep() {
      let text = ''
      if((this.isShowCash && Number(this.receiveCash) == 0) ||
        (this.isShowCheck && Number(this.receiveCheck) == 0) || 
        (this.isShowTransfer && Number(this.receiveTransfer) == 0) ||
        (this.isShowCreditcard && Number(this.receiveCreditcard) == 0)){
          text = 'กรุณากรอกข้อมูลการชำระเงินแต่ละประเภท'
      }else if((this.isShowCash && !this.receiveCashBank) ||
        (this.isShowTransfer && !this.receiveTransferBank)){
          text = 'กรุณากรอกข้อมูลธนาคาร'
      }else if(this.isShowCheck && (!this.checkdate || !this.checkno || !this.receiveCheckBank)){
          text = 'กรุณากรอกข้อมูลเช็คให้ครบถ้วน'
      }else{
        let sumCash = 0
        let sumCheck = 0
        let sumTransfer = 0
        let sumCreditCard = 0
        this.row.forEach(item => { 
          sumCash = sumCash + (Number(item.cashamount) || 0)
          sumCheck = sumCheck + (Number(item.checkamont) || 0)
          sumTransfer = sumTransfer + (Number(item.transferamont) || 0)
          sumCreditCard = sumCreditCard + (Number(item.creditcardamont) || 0)
        })
        if((this.isShowCash && sumCash != Number(this.receiveCash)) ||
            (this.isShowCheck && sumCheck !== Number(this.receiveCheck)) || 
            (this.isShowTransfer && sumTransfer !== Number(this.receiveTransfer)) ||
            (this.isShowCreditcard && sumCreditCard !== Number(this.receiveCreditcard))){
              text = 'กรุณากรอกข้อมูลการชำระเงินแต่ละประเภทของลูกค้าให้ถูกต้อง'
          }
      }
      if(!text){
        Swal.fire({
          title: 'รอสักครู่...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          width: 300,
          html: '<div class="spinner-border" role="status"><span class="sr-only">กำลังดึงข้อมูล</span></div>',
          onBeforeOpen: () => {
            Swal.showLoading()
          },
        })
        for (const data of this.row){
          const invoice = await this.executeInvoice(data);
          data.excutedInvoice = invoice
        }
        Swal.close()
        this.$store.commit('paymentreceive/SET_SELECTED_PAYMENT_RECEIVE', this.row)
        this.$store.commit('paymentreceive/SET_RECEIVE_DATA', {
          receiveCash: this.receiveCash,
          receiveCheck: this.receiveCheck,
          receiveTransfer: this.receiveTransfer,
          receiveCreditcard: this.receiveCreditcard,
          receiveCashBank: this.receiveCashBank,
          receiveTransferBank: this.receiveTransferBank,
          receiveCheckBank: this.receiveCheckBank,
          checkdate: this.checkdate,
          checkno: this.checkno
        })
        this.$store.commit('paymentreceive/SET_ATTACHMENT_FILES', {
          cashFiles: this.cashFiles,
          checkFiles: this.checkFiles,
          transferFiles: this.transferFiles,
          creditCardFiles: this.creditCardFiles
        })
        this.$store.commit('paymentreceive/SET_CURRENT_STEP', 4)
      }else{
        await Swal.fire({
            title: 'ข้อมูลไม่ถูกต้อง',
            text: text,
            icon: 'warning',
          })
      }
    },
    async previousStep() {
      this.$store.commit('paymentreceive/SET_SELECTED_PAYMENT_RECEIVE', this.row)
      this.$store.commit('paymentreceive/SET_RECEIVE_DATA', {
        receiveCash: this.receiveCash,
        receiveCheck: this.receiveCheck,
        receiveTransfer: this.receiveTransfer,
        receiveCreditcard: this.receiveCreditcard,
      })
      this.$store.commit('paymentreceive/SET_ATTACHMENT_FILES', {
          cashFiles: this.cashFiles,
          checkFiles: this.checkFiles,
          transferFiles: this.transferFiles,
          creditCardFiles: this.creditCardFiles
        })
      this.$store.commit('paymentreceive/SET_CURRENT_STEP', 2)
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
    isShowAttachment(){
      let foundCash = this.row.find(item => item.cash == true)
      if (foundCash) this.isShowCash = true
      let foundCheck = this.row.find(item => item.check == true)
      if (foundCheck) this.isShowCheck = true
      let foundTransfer = this.row.find(item => item.transfer == true)
      if (foundTransfer) this.isShowTransfer = true
      let foundCreditcard = this.row.find(item => item.creditcard == true)
      if (foundCreditcard) this.isShowCreditcard = true
    },
    getReceiveData(){
      this.receiveCash = this.receiveData.receiveCash
      this.receiveCheck = this.receiveData.receiveCheck
      this.receiveTransfer = this.receiveData.receiveTransfer
      this.receiveCreditcard = this.receiveData.receiveCreditcard
      this.receiveCashBank = this.receiveData.receiveCashBank
      this.receiveTransferBank = this.receiveData.receiveTransferBank
      this.receiveCheckBank = this.receiveData.receiveCheckBank
      this.checkdate = this.receiveData.checkdate
      this.checkno = this.receiveData.checkno
    },
    upload(files, i) {
      let uploads = []
      files.forEach((file, f) => {
        this.readers[f] = new FileReader();
        this.readers[f].onloadend = (e) => {
          let fileData = this.readers[f]
        }
        this.readers[f].readAsDataURL(files[f])
      })
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
