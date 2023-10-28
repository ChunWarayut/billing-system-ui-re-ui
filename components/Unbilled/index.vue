<template>
    <v-app id="unbilled" class="mb-5">
        <PageTitle title="Unbilled Patients" />
        <div class="my-5">
            <v-row>
                <v-col cols="12" md="4" sm="6">
                    <Select :items="orgs" label="Hospital" v-model="selectedOrg" :required="true">
                    </Select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="8">
                    <v-row>
                        <v-col>
                            <DatePicker label="Visit Date from" v-model="visitDateStart" :required="!showImportedOrderList"
                                :disabled="showImportedOrderList" :maxDate="maxDate">
                            </DatePicker>
                        </v-col>
                        <v-col>
                            <DatePicker label="Visit Date to" v-model="visitDateEnd" :required="!showImportedOrderList"
                                :disabled="showImportedOrderList" :maxDate="maxDate">
                            </DatePicker>
                        </v-col>
                        <v-col>
                            <Input label="Patient" v-model="hn" :disabled="showImportedOrderList">
                            </Input>
                        </v-col>
                        <v-col>
                            <Input label="Visit" v-model="vn" :disabled="showImportedOrderList">
                            </Input>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="4">
                    <v-row no-gutters class="d-flex align-center justify-end">
                        <v-spacer></v-spacer>
                        <v-col cols="2" class="d-flex justify-end">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn icon depressed large v-on="on" @click="onClickSearch" :disabled="!validateSearchBtn">
                                  <v-icon color="#0f869b">mdi-magnify</v-icon>
                              </v-btn>
                              </template>
                              <span>ค้นหาข้อมูล</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2" class="d-flex justify-end">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn icon depressed large v-on="on" @click="onClickClear">
                                  <v-icon color="#82b7c2">mdi-refresh</v-icon>
                                </v-btn>
                              </template>
                              <span>ล้างข้อมูล</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2" class="d-flex justify-end">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn icon depressed large :disabled="!validateUploadBtn"
                                  v-on="on"
                                  @click="onClickUpload">
                                  <v-icon color="#FBC948">
                                    mdi-upload
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span>ค้นหาจากไฟล์</span>
                            </v-tooltip>
                            <input ref="inputFile" type="file" class="d-none" @change="onChangedFile" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <span class="red--text" v-if="visitDatesAreSelected && !validateVisitDateRange.valid">
                {{ validateVisitDateRange.error }}
            </span>
        </div>
        <div>
          <v-row>
            <v-col cols="12" md="9">
              <v-row no-gutters class="d-flex align-center">
                <v-col cols="12" md="3" class="d-flex justfiy-start px-2">
                  Patient List (Total: {{ orderlist.length }})
                </v-col>
                <v-col cols="12" md="9">
                  <v-row no-gutters class="d-flex align-center">
                    <v-col class="d-flex justify-end px-2">
                      <v-switch inset v-model="showOrder" label="Order" @change="toggleShowOrder()"></v-switch>
                    </v-col>
                    <v-col class="d-flex justify-end px-2">
                        <v-switch inset v-model="showPackage" label="Package" @change="toggleShowOrder()"></v-switch>
                    </v-col>
                    <v-col class="d-flex justify-end px-2">
                        <v-switch inset v-model="showAcrossPackage" label="Across Visit PKG"
                            @change="toggleShowOrder()"></v-switch>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="3">
              <v-row no-gutters class="d-flex align-center">
                <v-col cols="9" class="d-flex justify-end">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon depressed large v-on="on" :disabled="orderlist.length == 0"
                        @click="onClickExport">
                        <v-icon color="#4CAF50">
                            mdi-download
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>ดึงข้อมูลออกมาเป็นไฟล์</span>
                  </v-tooltip>
                </v-col>
                <v-col class="d-flex justify-end">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon depressed large v-on="on" :disabled="selectedOrder.length === 0 ? true : false"
                          @click="onClickUnbilled">
                          <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                  d="M12.5 0C5.59647 0 0 5.59642 0 12.5C0 19.4036 5.59647 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59647 19.4036 0 12.5 0ZM19.0579 5.94214C22.3567 9.24093 22.5861 14.2829 20.1 17.819L7.18095 4.9C10.7195 2.4123 15.7609 2.64521 19.0579 5.94214ZM5.94214 19.0579C2.64335 15.7591 2.41391 10.7171 4.89995 7.181L17.8191 20.1C14.2806 22.5877 9.23911 22.3548 5.94214 19.0579Z"
                                  :fill="selectedOrder.length === 0 ? '#bfbfbf ' : '#b71c1c'" />
                              <path
                                  d="M14.795 11.7118L11.0283 10.6096C10.5923 10.4841 10.2889 10.076 10.2889 9.62261C10.2889 9.05411 10.7493 8.59373 11.3178 8.59373H13.6301C14.0556 8.59373 14.4742 8.72278 14.8229 8.95994C15.0357 9.10294 15.3217 9.06806 15.5031 8.89019L16.7168 7.70436C16.9644 7.46371 16.9295 7.06262 16.654 6.84987C15.7995 6.18023 14.7323 5.80704 13.6371 5.80355V4.12945C13.6371 3.82253 13.386 3.57141 13.0791 3.57141H11.963C11.6561 3.57141 11.405 3.82253 11.405 4.12945V5.80355H11.3178C9.09611 5.80355 7.31039 7.71134 7.51617 9.97487C7.66265 11.5827 8.89033 12.8906 10.4389 13.344L14.0138 14.3903C14.4498 14.5194 14.7532 14.924 14.7532 15.3774C14.7532 15.9459 14.2928 16.4062 13.7243 16.4062H11.412C10.9865 16.4062 10.5679 16.2772 10.2192 16.04C10.0064 15.897 9.72041 15.9319 9.53905 16.1098L8.32532 17.2956C8.07769 17.5363 8.11257 17.9373 8.3881 18.1501C9.24259 18.8197 10.3098 19.1929 11.405 19.1964V20.8705C11.405 21.1774 11.6561 21.4286 11.963 21.4286H13.0791C13.386 21.4286 13.6371 21.1774 13.6371 20.8705V19.1894C15.2624 19.158 16.7865 18.1919 17.3236 16.6539C18.0735 14.5054 16.8144 12.3012 14.795 11.7118Z"
                                  :fill="selectedOrder.length === 0 ? '#bfbfbf ' : '#b71c1c'" />
                          </svg>
                      </v-btn>
                    </template>
                    <span>ยกเลิกค่าใช้จ่าย และเปลี่ยนสถานะเป็น Financial Discharge</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div>
            <v-row no-gutters class="d-flex align-center px-2">
                <v-col class="d-flex justfiy-start pl-2">
                    <v-checkbox v-model="selectingAllOrders" label="All" :readonly="orderlist.length == 0" :disabled="showImportedOrderList"></v-checkbox>
                </v-col>
                <v-col class="d-flex justify-end">
                    Total Selected: {{ selectedOrder.length }}
                </v-col>
            </v-row>
        </div>
        <div>
            <v-data-table v-model="selectedOrder" :page="page" :headers="patientordersHeaders" :items="orderlist"
                item-key="vn" show-select class="elevation-1" :items-per-page="itemsPerPage" hide-default-footer>
                <!-- sneakingly replace header.data-table-select with readonly ticked checkbox when select all -->
                <!-- i would like to override its logic but vuetify doc is lacking -->
                <template v-if="selectingAllOrders" v-slot:header.data-table-select>
                    <v-simple-checkbox :value="true" :readonly="true" :disabled="true"></v-simple-checkbox>
                </template>
                <template v-slot:item.data-table-select="{ isSelected, select }">
                    <v-simple-checkbox :value="isSelected" :readonly="selectingAllOrders" :disabled="selectingAllOrders"
                        @input="select($event)"></v-simple-checkbox>
                </template>
                <template v-slot:item.payorName="{ item }">
                    {{ item.payorName }} / {{ item.payoragreementName }}
                </template>
                <template v-slot:item.topay="{ item }">
                    {{ numberFormat(item.topay) }}
                </template>
                <template v-slot:item.hasOrder="{ item }">
                    <v-icon v-if="item.hasOrder" color="green">mdi-check-circle</v-icon>
                    <v-icon v-if="!item.hasOrder" color="red">mdi-close-circle</v-icon>
                </template>
                <template v-slot:item.hasNormalPackage="{ item }">
                    <v-icon v-if="item.hasNormalPackage" color="green">mdi-check-circle</v-icon>
                    <v-icon v-if="!item.hasNormalPackage" color="red">mdi-close-circle</v-icon>
                </template>
                <template v-slot:item.hasAcrossPackage="{ item }">
                    <v-icon v-if="item.hasAcrossPackage" color="green">mdi-check-circle</v-icon>
                    <v-icon v-if="!item.hasAcrossPackage" color="red">mdi-close-circle</v-icon>
                </template>
                <template v-slot:item.startdate="{ item }">
                    {{ formatDate(item.startdate) }}
                </template>
            </v-data-table>
            <v-pagination class="py-2" v-model="page" circle show-first-last-page :length="pageCount" :total-visible="7"></v-pagination>
        </div>
        <Alert
            :description="`Are you confirm to change patient order status to 'Financial Discharge' for the selected orders (${selectedOrder.length}) and auto export file?`"
            :open="openAlert" @close="openAlert = false" @confirm="confirmUnbilled" />
        <Dialog title="Error" :description="errorMessage" :open="showErrorMessage" @close="clearErrorMessage" />
        <LoadingDialog title="Please wait" description="We are processing your uploaded file." :open="showLoadingDialog" />
    </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { csv2jsonAsync, json2csvAsync } from 'json-2-csv'
import dayjs from "dayjs"
import customParseformat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import PageTitle from '../../components/Base/PageTitle.vue'
import Select from '../../components/Base/Select.vue'
import DatePicker from '../../components/Base/DatePicker.vue'
import Input from '../../components/Base/Input.vue'
import Alert from '../Base/ConfirmAlert.vue'
import Dialog from '../Base/Dialog.vue'
import LoadingDialog from "../Base/LoadingDialog.vue"

dayjs.extend(customParseformat);
dayjs.extend(timezone);
dayjs.extend(utc);

export default {
    layout: 'default',
    name: 'IndexPage',
    components: {
        PageTitle,
        Select,
        DatePicker,
        Input,
        Alert,
        Dialog,
        LoadingDialog,
    },
    data() {
        return {
            page: 1,
            itemsPerPage: 100,
            orgs: [],
            selectedOrg: null,
            visitDateStart: null,
            visitDateEnd: null,
            hn: null,
            vn: null,
            selectedOrder: [],
            orderlist: [],
            allOrder: [],
            uploadedOrderList: [],
            allUploadedOrderList: [],
            patientordersHeaders: [
                {
                    text: 'HN',
                    align: 'start',
                    value: 'hn',
                    width: '11%',
                    sortable: false,
                },
                { text: 'VN', value: 'vn', sortable: false },
                { text: 'Visit Date', value: 'startdate', width: '13%', sortable: false },
                { text: 'Visit status', value: 'visitstatus', sortable: false },
                { text: 'Payor / Payor Agreement', value: 'payorName', sortable: false },
                { text: 'To Pay', value: 'topay', sortable: false },
                { text: 'Order', value: 'hasOrder', width: '83px', align: 'center', sortable: false },
                { text: 'Package', value: 'hasNormalPackage', width: '83px', align: 'center', sortable: false },
                { text: 'AcrsPkg', value: 'hasAcrossPackage', width: '83px', align: 'center', sortable: false },
            ],
            selectingAllOrders: false,
            disabledSelectAll: false,
            showOrder: true,
            showPackage: true,
            showAcrossPackage: true,
            showImportedOrderList: false,
            openAlert: false,
            showErrorMessage: false,
            errorMessage: '',
            showLoadingDialog: false,
            csvOptions: {
                excelBOM: true,
                delimiter: {
                    warp: '"',
                    field: ',',
                    eol: '\n',
                },
                keys: ['hn', 'vn', 'startdate', 'visitstatus', 'payorName', 'payoragreementName', 'topay', 'hasOrder', 'hasNormalPackage', 'hasAcrossPackage', 'orguid', 'patientuid', 'patientvisituid'],
                trimHeaderFields: true,
                trimFieldValues: true,
            },
            maxDate: null,
        }
    },
    created() {
      this.maxDate = this.getYesterDayDate();
    },
    mounted() {
        this.getOrgs();
    },
    destroyed() {
    },
    watch: {
        orderlist(newOrderlist, oldOrderlist) {
          this.selectingAllOrders = false;
          if (this.showImportedOrderList) {
            this.forceSelectedAll();
          }
        },
        selectingAllOrders(newSelectAll, oldSelectAll) {
            if (newSelectAll) this.selectAllOrders();
            else this.deselectAllOrders();
        },
        pageCount(newPageCount, oldPageCount) {
            if (newPageCount < this.page) this.page = newPageCount;
        },
    },
    computed: {
        ...mapGetters("unbilled", ["patientorders", "importedPatientOrders"]),
        pageCount() {
            return Math.ceil(this.orderlist.length / this.itemsPerPage);
        },
        visitDatesAreSelected() {
            return (!!this.visitDateStart && !!this.visitDateEnd);
        },
        validateVisitDateRange() {
            if (!this.visitDateStart && !this.visitDateEnd) return { valid: false, error: 'Both start date and end date are required' };
            const start = dayjs(this.visitDateStart);
            const end = dayjs(this.visitDateEnd);
            const dayDifference = end.diff(start, 'days');
            if (dayDifference < 0) return { valid: false, error: 'Selected start date must come before end date' };
            if (dayDifference > 30) return { valid: false, error: 'Selected date range exceeds 31 days' };
            return { valid: true, error: '' };
        },
        validateSearchBtn() {
            if (this.selectedOrg && this.visitDateStart && this.visitDateEnd && !this.showImportedOrderList && this.validateVisitDateRange.valid) return true;
            return false;
        },
        validateUploadBtn() {
            if (this.selectedOrg) return true;
            return false;
        },
    },
    methods: {
        ...mapActions("unbilled", ["listOrgs", "listPatientOrders", "unbilledPatients", "clearPatientOrders", "listImportedPatientOrders", "clearImportedPatientOrders"]),
        formatDate(date) {
            return dayjs(date).format('DD-MM-YYYY HH:mm')
        },
        async onClickSearch() {
            await this.listPatientOrders({
                org: this.selectedOrg.key,
                visitDateStart: this.visitDateStart,
                visitDateEnd: this.visitDateEnd,
                hn: (typeof this.hn === 'string') ? this.hn.trim() : this.hn,
                vn: (typeof this.vn === 'string') ? this.vn.trim() : this.vn
            });
            this.showImportedOrderList = false;
            await this.listOrders();
        },
        onClickUnbilled() {
            this.openAlert = true;
        },
        async confirmUnbilled() {
            this.openAlert = false
            let res = await this.unbilledPatients({ orders: this.selectedOrder, orgCode: this.selectedOrg });
            if (res) {
                this.selectedOrder.forEach(order => {
                    let newList = this.orderlist.filter(item => {
                        return order != item
                    })
                    this.orderlist = newList
                })
                this.selectedOrder.forEach(order => {
                    let newList = this.allOrder.filter(item => {
                        return order != item
                    })
                    this.allOrder = newList
                })
            }
            if (!this.showImportedOrderList) {
              this.deselectAllOrders();
              this.selectingAllOrders = false;
              this.disabledSelectAll = false;
            }
        },
        async getOrgs() {
            let res = await this.listOrgs();
            this.orgs = (res || []).map(item => {
                return {
                    key: item._id,
                    text: item.name,
                    code: item.code,
                }
            })
        },
        toggleShowOrder() {
            if (this.showOrder && this.showPackage && this.showAcrossPackage) {
                this.orderlist = this.allOrder
            } else if (this.showOrder && this.showPackage && !this.showAcrossPackage) {
                this.orderlist = this.allOrder.filter(item => {
                    return (!item.hasOrder && !item.hasNormalPackage && !item.hasAcrossPackage) || (item.hasOrder && item.hasNormalPackage && !item.hasAcrossPackage)
                })
            } else if (this.showOrder && !this.showPackage && this.showAcrossPackage) {
                this.orderlist = this.allOrder.filter(item => {
                    return (!item.hasOrder && !item.hasNormalPackage && !item.hasAcrossPackage) || (item.hasOrder && !item.hasNormalPackage && item.hasAcrossPackage)
                })
            } else if (this.showOrder && !this.showPackage && !this.showAcrossPackage) {
                this.orderlist = this.allOrder.filter(item => {
                    return (!item.hasOrder && !item.hasNormalPackage && !item.hasAcrossPackage) || (item.hasOrder && !item.hasNormalPackage && !item.hasAcrossPackage)
                })
            } else if (!this.showOrder && this.showPackage && this.showAcrossPackage) {
                this.orderlist = this.allOrder.filter(item => {
                    return (!item.hasOrder && !item.hasNormalPackage && !item.hasAcrossPackage) || (!item.hasOrder && item.hasNormalPackage && item.hasAcrossPackage)
                })
            } else if (!this.showOrder && this.showPackage && !this.showAcrossPackage) {
                this.orderlist = this.allOrder.filter(item => {
                    return (!item.hasOrder && !item.hasNormalPackage && !item.hasAcrossPackage) || (!item.hasOrder && item.hasNormalPackage && !item.hasAcrossPackage)
                })
            } else if (!this.showOrder && !this.showPackage && this.showAcrossPackage) {
                this.orderlist = this.allOrder.filter(item => {
                    return (!item.hasOrder && !item.hasNormalPackage && !item.hasAcrossPackage) || (!item.hasOrder && !item.hasNormalPackage && item.hasAcrossPackage)
                })
            } else if (!this.showOrder && !this.showPackage && !this.showAcrossPackage) {
                this.orderlist = this.allOrder.filter(item => {
                    return !item.hasOrder && !item.hasNormalPackage && !item.hasAcrossPackage
                })
            }
        },
        async onClickClear() {
            await this.clearPatientOrders();
            this.selectedOrg = null;
            this.visitDateStart = null;
            this.visitDateEnd = null;
            this.hn = null;
            this.vn = null;
            this.selectedOrder = [];
            this.orderlist = [];
            this.allOrder = [];
            this.showOrder = true;
            this.showPackage = true;
            this.showAcrossPackage = true;
            this.openAlert = false;
            this.showImportedOrderList = false;
            this.disabledSelectAll = false;
            await this.clearErrorMessage();
        },
        async onClickUpload() {
            this.$refs.inputFile.value = null;
            this.$refs.inputFile.click();
        },
        async onChangedFile() {
            this.showLoadingDialog = true;
            const files = this.$refs.inputFile.files;
            if (files.length === 0) {
                this.showLoadingDialog = false;
                this.setErrorMessage("NO FILE SELECTED");
            }
            else {
                const reader = new FileReader();
                reader.onload = async () => await this.loadCSVFromFile(reader.result);
                reader.readAsText(files[0]);
            }
        },
        async loadCSVFromFile(result) {
            this.deselectAllOrders();
            this.selectingAllOrders = false;
            this.disabledSelectAll = false;
            const json = await csv2jsonAsync(result, this.csvOptions);
            const filteredJson = json.filter(order => order.visitstatus != 'Billing Inprogress' && order.visitstatus != 'Financial Discharge');
            const mappedJson = [];
            for (let i = 0; i < filteredJson.length; i++) {
                let order = filteredJson[i];
                const validatedStatuses = await this.validateOrderStatuses(order);
                if (validatedStatuses.valid === false) {
                    this.showLoadingDialog = false;
                    this.setErrorMessage(validatedStatuses.errorMessage);
                    return;
                }
                let modifiedOrder = { ...order };
                modifiedOrder.hasOrder = validatedStatuses.parsedResult.hasOrder;
                modifiedOrder.hasNormalPackage = validatedStatuses.parsedResult.hasNormalPackage;
                modifiedOrder.hasAcrossPackage = validatedStatuses.parsedResult.hasAcrossPackage;
                modifiedOrder.startdate = dayjs(order.startdate, 'DD-MM-YYYYTHH:mm:ssSSSZ').toISOString();
                mappedJson.push(modifiedOrder);
            }
            const res = await this.listImportedPatientOrders(mappedJson);
            this.showImportedOrderList = true;
            await this.listOrders();
            await this.forceSelectedAll();
            this.showLoadingDialog = false;
        },
        async validateOrderStatuses(order) {
            let validationResult;
            const parsedResult = {};
            validationResult = await this.validateBooleanString(order.hasOrder);
            if (validationResult.error) {
                return { 'valid': false, 'errorMessage': `Invalid value for patientvisituid: ${order.patientvisituid} ("hasOrder": ${order.hasOrder})`, 'parsedResult': parsedResult };
            }
            parsedResult.hasOrder = validationResult.value;
            validationResult = await this.validateBooleanString(order.hasNormalPackage);
            if (validationResult.error) {
                return { 'valid': false, 'errorMessage': `Invalid value in patientvisituid: ${order.patientvisituid} ("hasNormalPackage": ${order.hasNormalPackage})`, 'parsedResult': parsedResult };
            }
            parsedResult.hasNormalPackage = validationResult.value;
            validationResult = await this.validateBooleanString(order.hasAcrossPackage);
            if (validationResult.error) {
                return { 'valid': false, 'errorMessage': `Invalid value for patientvisituid: ${order.patientvisituid} ("hasAcrossPackage": ${order.hasAcrossPackage})`, 'parsedResult': parsedResult };
            }
            parsedResult.hasAcrossPackage = validationResult.value;
            return {'valid': true, 'errorMessage': null, 'parsedResult': parsedResult };
        },
        async validateBooleanString(value) {
            if (typeof value === 'boolean') return { 'error': false, 'value': value };
            if (typeof value === 'string' || value instanceof String) {
                const trimmedValue = value.trim();
                if (trimmedValue.toLowerCase() === 'false') return { 'error': false, 'value': false };
                if (trimmedValue.toLowerCase() === 'true') return { 'error': false, 'value': true };
            }
            return { 'error': true, 'value': null };
        },
        async listOrders() {
            this.orderlist = (this.showImportedOrderList) ? this.importedPatientOrders : this.patientorders;
            this.allOrder = (this.showImportedOrderList) ? this.importedPatientOrders : this.patientorders;
            this.showOrder = true;
            this.showPackage = true;
            this.showAcrossPackage = true;
            this.selectedOrder = [];
            await this.clearErrorMessage();
        },
        async setErrorMessage(message) {
            this.showErrorMessage = true;
            this.errorMessage = message;
        },
        async clearErrorMessage() {
            this.showErrorMessage = false;
            this.errorMessage = '';
        },
        async onClickExport() {
            const sortedOrderList = [...this.orderlist].sort((a, b) => a.vn.localeCompare(b.vn));
            const mappedOrderList = sortedOrderList.map((order) => {
                let modifiedOrder = { ...order };
                modifiedOrder.startdate = dayjs(order.startdate).tz("Asia/Bangkok").format('DD-MM-YYYYTHH:mm:ssSSSZ');
                modifiedOrder.topay = this.numberFormat(order.topay, 2, false);
                return modifiedOrder;
            });
            const csv = await json2csvAsync(mappedOrderList, this.csvOptions);
            // Adding UTF-8 BOM to start of blob, so Excel will recognize encoding.
            const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'application/csv;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'patientorders.csv';
            link.click();
            URL.revokeObjectURL(link.href);
        },
        async selectAllOrders() {
            this.selectedOrder = this.orderlist;
        },
        async deselectAllOrders() {
            this.selectedOrder = [];
        },
        getYesterDayDate() {
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() - 1);
          return maxDate.toISOString().split('T')[0];
        },
        numberFormat(number, digit = 2, grouping = true) {
          return new Intl.NumberFormat('en-US', { minimumFractionDigits: digit, maximumFractionDigits: digit , useGrouping: grouping}).format(number);
        },
        async forceSelectedAll() {
          this.selectingAllOrders = true;
        }
    },
}
</script>

