<template>
    <v-app id="orders">
        <PageTitle title="Order Cancellation"/>
        <div class="my-5">
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12" md="4" sm="6">
                        <Select
                            :items="hospitals"
                            item-text="name"
                            item-value="_id"
                            label="Hospital"
                            v-model="selectedHospital"
                            :required="true"
                            >
                        </Select>
                    </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div class="d-flex justify-space-between">
                      <div class="d-flex column s-input">
                        <div style="min-width: 180px;width: 180px;">
                          <DatePicker
                            label="Visit Date from"
                            v-model="visitDateStart"
                            :required="true"
                          ></DatePicker>
                        </div>
                        <div style="min-width: 180px;width: 180px;">
                          <DatePicker
                            label="Visit Date to"
                            v-model="visitDateEnd"
                            :required="true"
                          ></DatePicker>
                        </div>
                        <div style="min-width: 180px;width: 180px;">
                          <Input label="Patient" :required="true" v-model="hn"></Input>
                        </div>
                        <div style="min-width: 180px;width: 180px;">
                          <Input label="Visit" :required="true" v-model="vn"></Input>
                        </div>
                        <div style="min-width: 180px;width: 180px;">
                          <Input label="Order No." v-model="orderNo"></Input>
                        </div>
                      </div>
                      <div class="s-btn">
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                                icon
                                depressed
                                large
                                v-on="on"
                                @click="onClickSearch"
                                :disabled="!validateSearchBtn"
                              >
                                <v-icon color="#0f869b">mdi-magnify</v-icon>
                            </v-btn>
                          </template>
                          <span>ค้นหาข้อมูล</span>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              icon
                              depressed
                              large
                              v-on="on"
                              @click="onClickClear"
                            >
                              <v-icon color="#82b7c2">mdi-refresh</v-icon>
                            </v-btn>
                          </template>
                          <span>ล้างข้อมูล</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </v-col>
                </v-row>
            </v-form>
        </div>
        <v-divider></v-divider>
        <div class="my-5" v-if="!!orderList && !!orderList.info">
            <v-row>
                <v-col><h3>Patient Visit Information</h3></v-col>
            </v-row>
            <v-row>
                <v-col><b>Name:</b> <span style="color:#66AAB9">{{ orderList.info.fullName }}</span></v-col>
                <v-col><b>Visit Date:</b> <span style="color:#66AAB9">{{ this.formatTime(orderList.info.visitDate) }}</span></v-col>
            </v-row>
            <v-row><v-col><h3>Order Item</h3></v-col></v-row>
        </div>
        <div class="my-5" v-if="!!orderList && !!orderList.items">
            <v-data-table
                class="elevation-1 table-order-list"
                :headers="headers"
                :items="orderList.items"
                :footer-props="footerOptions"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
            >
                <template v-slot:item.orderdate="{ item }">
                    <span v-if="!!item && !!item.orderdate">{{ formatTime(item.orderdate) }}</span>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="action-btn" style="display: inline-flex;gap: 8px;">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img v-if="item.statusflag != 'D'" class="btn-icon" src="~/assets/icons/icon-de-activate-order.png" alt="Action de-activate" width="70" v-on="on" @click="onClickdeactivateChargeCode(item)"/>
                          <img v-else class="btn-icon disabled" src="~/assets/icons/icon-de-activate-order-disabled.png" alt="Action de-activate" width="70" v-on="on" />
                        </template>
                        <span>Deactivate Charge Code: ใช้กรณีที่ยกเลิก order แล้ว แต่ order ยังแสดงที่หน้า Bill</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img v-if="item.status != 'Cancelled'" class="btn-icon" src="~/assets/icons/icon-cancel-order.png" alt="Action cancel order" width="70" v-on="on" @click="onClickcancelOrder(item)"/>
                          <img v-else class="btn-icon disabled" src="~/assets/icons/icon-cancel-order-disabled.png" alt="Action cancel order" width="70" v-on="on" />
                        </template>
                        <span>Cancel Order: ใช้กรณีที่ต้องการยกเลิก order ที่มี status Ordered</span>
                    </v-tooltip>
                  </div>
                </template>
            </v-data-table>
        </div>
        <Alert
            :description="modalMessage"
            :text-input-enabled="true"
            text-input-label="Ticket No. & Reason"
            :open="modalActive" @close="onModalClose" @confirm="confirmCancellation"
        />
    </v-app>
</template>

<script>
import moment from 'moment-timezone';
import { mapActions, mapGetters } from "vuex";
import DatePicker from '../../components/Base/DatePicker.vue';
import Input from '../../components/Base/Input.vue';
import PageTitle from '../../components/Base/PageTitle.vue';
import Select from '../../components/Base/Select.vue';
import Alert from '../../components/Base/ConfirmAlert.vue';
export default {
  layout: 'default',
  name: 'IndexPage',
  components: {
    PageTitle,
    Select,
    DatePicker,
    Input,
    Alert
  },
  data() {
    return {
        selectedHospital:  null,
        visitDateStart: null,
        visitDateEnd: null,
        hn: null,
        vn: null,
        orderNo: null,
        orderList: null,
        res: null,
        selectedItem: null,
        modalActive: false,
        isCancelOrder: false,
        headers: [
            {
                text: 'Order No.',
                value: 'ordernumber',
            },
            {
                text: 'Order Date',
                value: 'orderdate',
                width: '113px',
            },
            {
                text: 'Item Code',
                value: 'chargecode',
            },
            {
                text: 'Item Name',
                value: 'orderitemname',
            },
            {
                text: 'Qty',
                value: 'quantity',
            },
            {
                text: 'Order Status',
                value: 'status',
            },
            {
                text: 'Bill No.',
                value: 'billstatus',
            },
            {
                text: 'Charge Code Status',
                value: 'statusflag',
                width: '80px',
                align: 'center',
            },
            {
                text: 'Action',
                value: 'actions',
                sortable: false,
                width: '150px',
            },
        ],
        sortBy: 'orderdate',
        sortDesc: false,
        footerOptions: {
            itemsPerPageOptions: [10, 20],
        },
    }
  },
  async created() {
    await this.getHospitals();
  },
  mounted() {
  },
  destroyed() {
  },
  watch: {
  },
  computed: {
    ...mapGetters("orders", ["hospitals", "orders"]),
    modalMessage() {
        if (!this.selectedItem) return 'You have not selected any order yet.';
        return `You are going to ${!this.isCancelOrder ? `deactivate charge code "${this.selectedItem.chargecode}" of` : 'cancel'} order "${this.selectedItem.ordernumber}". Please specify ticket number and a good short reason.`;
    },
    validateSearchBtn() {
        const trimmedHN = (typeof this.hn === 'string') ? this.hn.trim() : this.hn;
        const trimmedVN = (typeof this.vn === 'string') ? this.vn.trim() : this.vn;
        if (this.selectedHospital && this.visitDateStart && this.visitDateEnd && trimmedHN && trimmedVN) return true;
        return false;
    },
  },
  methods: {
    formatTime(datetime) {
        return moment(datetime).tz('Asia/Bangkok').format('DD-MM-YYYY HH:mm');
    },
    async onClickSearch() {
        if(this.$refs.form.validate()){
            await this.clearOrders();
            await this.loadOrders();
        }
    },
    async onClickClear() {
        this.$refs.form.reset();
        this.selectedHospital = null;
        this.visitDateStart = null;
        this.visitDateEnd = null;
        this.hn = null;
        this.vn = null;
        this.orderNo = null;
        await this.clearOrders();
        this.orderList = this.orders;
    },
    async onModalClose() {
        this.modalActive = false;
        this.reason = '';
        this.selectedItem = null;
    },
    async onClickdeactivateChargeCode(item) {
        this.isCancelOrder = false;
        this.modalActive = true;
        this.selectedItem = item;
    },
    async onClickcancelOrder(item) {
        this.isCancelOrder = true;
        this.modalActive = true;
        this.selectedItem = item;
    },
    async confirmCancellation(reason) {
        this.modalActive = false;
        if (!!this.selectedItem && !!this.selectedItem.chargecodeuid && !!this.selectedItem.patientorderuid && !!this.selectedItem.patientorderitemuid) {
            const audit = {
                item: this.selectedItem,
                reason,
            };
            const params = {
                chargecodeuid: this.selectedItem.chargecodeuid,
                patientorderuid: this.selectedItem.patientorderuid,
                patientorderitemuid: this.selectedItem.patientorderitemuid,
                audit,
            }
            if (this.isCancelOrder) this.res = await this.cancelOrder(params);
            else this.res = await this.deactivateChargeCode(params);
            if (!!this.res) {
                await this.loadOrders();
            }
        }
        this.selectedItem = null;
    },
    async loadOrders() {
        await this.getOrders({
            visitdatestart: this.visitDateStart,
            visitdateend: this.visitDateEnd,
            orguid: this.selectedHospital._id,
            hn: (typeof this.hn === 'string') ? this.hn.trim() : this.hn,
            vn: (typeof this.vn === 'string') ? this.vn.trim() : this.vn,
            orderno: this.orderNo,
        });
        this.orderList = this.orders;
    },
    ...mapActions('orders', ['getHospitals', 'getOrders', 'clearOrders', 'deactivateChargeCode', 'cancelOrder']),
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
