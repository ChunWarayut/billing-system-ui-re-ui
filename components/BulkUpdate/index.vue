<template>
    <v-app id="bulkupdate" class="mb-5">
        <PageTitle title="Bulk Update" />
        <div class="my-5">
            <v-row>
                <v-col cols="12" md="4" sm="6">
                    <Select :items="orgs" label="Hospital" v-model="selectedOrg" :required="true">
                    </Select>
                </v-col>
            </v-row>
        </div>
        <div v-if="selectedOrg">
            <h2 class="primary--text pl-5 pb-3">Demographic</h2>
            <div class="border-card pa-5">
                <v-row>
                    <v-col cols="6" class="d-flex align-center font-title-issue">
                        Patient Note
                    </v-col>
                    <v-col class="d-flex justify-center align-center">
                        <v-btn
                            depressed
                            large
                            @click="onClickExportTemplate('patientnotes')"
                            >Template
                            <v-icon
                                right
                                dark
                                color="primary"
                            >
                                mdi-arrow-down-bold-box
                            </v-icon>
                        </v-btn>
                    </v-col>
                    <v-col class="d-flex justify-center align-center">
                        <v-btn
                            outlined
                            large
                            color="primary"
                            @click="onClickImportTemplate('patientnotes')"
                            >Import
                            <v-icon
                                right
                                dark
                            >
                                mdi-arrow-up-bold-box
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
            <h2 class="primary--text pl-5 pt-3 pb-3">Unbilled</h2>
            <div class="border-card pa-5">
                <v-row>
                    <v-col cols="6" class="d-flex align-center font-title-issue">
                      Unbilled by VN
                    </v-col>
                    <v-col class="d-flex justify-center align-center">
                        <v-btn
                            depressed
                            large
                            @click="onClickExportTemplate('unbilled')"
                            >Template
                            <v-icon
                                right
                                dark
                                color="primary"
                            >
                                mdi-arrow-down-bold-box
                            </v-icon>
                        </v-btn>
                    </v-col>
                    <v-col class="d-flex justify-center align-center">
                        <v-btn
                            outlined
                            large
                            color="primary"
                            @click="onClickImportTemplate('unbilled')"
                            >Import
                            <v-icon
                                right
                                dark
                            >
                                mdi-arrow-up-bold-box
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
            <input ref="inputFile" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="d-none" @change="onChangedFile" />
        </div>
        <Dialog title="Error" :description="errorMessage" :open="showErrorMessage" @close="clearErrorMessage" />
        <LoadingDialog title="Please wait" description="We are processing your uploaded file." :open="showLoadingDialog" />
    </v-app>
</template>

<script>
import { mapActions } from "vuex";
import PageTitle from '../../components/Base/PageTitle.vue';
import Select from '../../components/Base/Select.vue';
import DatePicker from '../../components/Base/DatePicker.vue';
import Input from '../../components/Base/Input.vue';
import Alert from '../Base/ConfirmAlert.vue';
import Dialog from '../Base/Dialog.vue';
import LoadingDialog from '../Base/LoadingDialog.vue';

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
            orgs: [],
            selectedOrg: null,
            selectedTemplate: "",
            showLoadingDialog: false,
            allowedExtension: /(\.xlsx)$/i,
            showErrorMessage: false,
            errorMessage: '',
        }
    },
    created() {

    },
    mounted() {
        this.getOrgs()
    },
    destroyed() {
    },
    watch: {
    },
    computed: {
    },
    methods: {
        ...mapActions("base", ["listOrgs"]),
        ...mapActions("bulkUpdate", ["exportTemplate", "importPatientNotes", "importUnbilled"]),
        async getOrgs() {
          let res = await this.listOrgs();
          this.orgs = (res || []).map(item => {
              return {
                  key: item._id,
                  text: item.name,
                  code: item.code
              }
          });
        },
        async onClickExportTemplate(templateName) {
          await this.exportTemplate({ name: templateName });
        },
        onClickImportTemplate(templateName) {
          this.clearErrorMessage();
          this.$refs.inputFile.value = null;
          this.$refs.inputFile.click();
          this.selectedTemplate = templateName;
        },
        async onChangedFile() {
          const files = this.$refs.inputFile.files;
          if (!this.allowedExtension.exec(files[0].name)) {
            this.setErrorMessage('The import file type is not allow, please select .xlsx');
            return;
          }
          this.showLoadingDialog = true;
          switch (this.selectedTemplate) {
            case "patientnotes":
              await this.importPatientNotes({
                  file: files[0],
                  org: this.selectedOrg
              });
              this.showLoadingDialog = false;
              break;
            case "unbilled":
              await this.importFileUnbilled(files[0]);
              this.showLoadingDialog = false;
              break;
          }
        },
        async setErrorMessage(message) {
            this.showErrorMessage = true;
            this.errorMessage = message;
        },
        async clearErrorMessage() {
            this.showErrorMessage = false;
            this.errorMessage = '';
        },
        async importFileUnbilled(file) {
          const res = await this.importUnbilled({
              file: file,
              org: this.selectedOrg
          });
          if (res?.error === true) {
            if (res?.message) {
              this.setErrorMessage(res.message);
            }
          } else {
            return false;
          }
        }
    },
}
</script>
<style lang="scss" scoped>
.border-card {
    border-radius: 10px;
    border: 1px solid #82B7C2;
}
.font-title-issue {
  font-size: 20px;
}

</style>

