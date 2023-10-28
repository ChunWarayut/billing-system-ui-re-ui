<template>
  <v-app id="orders">
    <PageTitle title="User Management" />
    <div class="my-5">
      <v-row no-gutters>
        <v-col cols="12" sm="6" md="8">
          <v-row class="pa-2" outlined tile>
            <v-col cols="12" md="6">
              <Input v-model="searchText" hideDetails="auto"></Input>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn depressed color="primary" @click="search()"> Search </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-divider></v-divider>
    <div>
      <v-data-table
        :headers="headers"
        hide-default-footer
        :items-per-page="countUsers"
        :items="users"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                  New User
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.firstname"
                          label="Firstname"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.lastname"
                          label="Lastname"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.mobile"
                          label="Mobile"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.username"
                          label="Username"
                        ></v-text-field>
                      </v-col>
                      <v-col v-if="editedIndex === -1" cols="12" sm="6" md="4">
                        <v-text-field
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          v-model="editedItem.password"
                          label="Password"
                          :type="showPassword ? 'text' : 'password'"
                          @click:append="showPassword = !showPassword"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.roleId"
                          :items="roles"
                          item-value="id"
                          item-text="name"
                          label="Role"
                        />
                      </v-col>

                      <v-col cols="12" sm="6" md="8">
                        <v-select
                          v-model="editedItem.companycode"
                          :items="companys"
                          item-value="code"
                          item-text="name"
                          label="Company Code"
                        />
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.employeecode"
                          label="Employee Code"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="close"> Cancel </v-btn>
                  <v-btn color="primary" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogResetPassword" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Reset Password</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          v-model="editedItem.newPassword"
                          label="Password"
                          :type="showResetPassword ? 'text' : 'password'"
                          @click:append="showResetPassword = !showResetPassword"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.confirmNewPassword"
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          label="Password"
                          :type="showConfirmResetPassword ? 'text' : 'password'"
                          @click:append="
                            showConfirmResetPassword = !showConfirmResetPassword
                          "
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="closeResetPassword"> Cancel </v-btn>
                  <v-btn
                    color="primary"
                    text
                    :disabled="
                      !(
                        editedItem.newPassword &&
                        editedItem.confirmNewPassword &&
                        editedItem.newPassword == editedItem.confirmNewPassword
                      )
                    "
                    @click="saveResetPassword"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Are you sure you want to delete this user?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="primary" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.name="{ item }">
          {{ item.firstname }} {{ item.lastname }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon small class="mr-2" @click="resetPasswordItem(item)">
            mdi-lock-reset
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          :length="amountPage"
          :total-visible="10"
          @input="selectPage()"
        ></v-pagination>
      </div>
    </div>
  </v-app>
</template>

<script>
import moment from "moment-timezone";
import { mapActions, mapGetters } from "vuex";
import DatePicker from "../../components/Base/DatePicker.vue";
import Input from "../../components/Base/Input.vue";
import PageTitle from "../../components/Base/PageTitle.vue";
import Select from "../../components/Base/Select.vue";
export default {
  layout: "default",
  name: "IndexPage",
  components: {
    PageTitle,
    Select,
    DatePicker,
    Input,
  },
  data() {
    return {
      users: [],
      roles: [],
      companys: [],
      searchText: null,
      showPassword: false,
      showResetPassword: false,
      showConfirmResetPassword: false,
      page: 1,
      amountPage: 0,
      headers: [
        { text: "Username", value: "username", sortable: false },
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Employee Code", value: "employeecode", sortable: false },
        { text: "Company", value: "companycode", sortable: false },
        { text: "Role", value: "role.name", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      sortBy: "orderdate",
      sortDesc: false,
      footerOptions: {
        itemsPerPageOptions: [10, 20],
      },
      dialog: false,
      dialogDelete: false,
      dialogResetPassword: false,
      editedIndex: -1,
      editedItem: {
        firstname: "",
        lastname: "",
        username: "",
        roleId: 0,
        mobile: "",
        password: "",
        id: 0,
        newPassword: "",
        confirmNewPassword: "",
        companycode: "",
        employeecode: "",
      },
      defaultItem: {
        firstname: "",
        lastname: "",
        username: "",
        roleId: 0,
        mobile: "",
        password: "",
        id: 0,
        newPassword: "",
        confirmNewPassword: "",
      },
    };
  },
  async created() {
    await this.getCompanyList();
    await this.getRoleList({});
    await this.setUserData();
    this.roles = this.roleList;
    this.companys = this.companyList;
    this.page = this.userPage;
  },
  async mounted() {},
  destroyed() {},
  watch: {},
  computed: {
    ...mapGetters("users", ["userList", "countUsers", "userPageSize", "userPage"]),
    ...mapGetters("roles", ["roleList"]),
    ...mapGetters("company", ["companyList"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  methods: {
    ...mapActions("users", ["getUserList", "createUser", "updateUser", "deleteUser"]),
    ...mapActions("roles", ["getRoleList"]),
    ...mapActions("company", ["getCompanyList"]),
    async setUserData() {
      await this.getUserList({ searchText: this.searchText, page: this.page });
      this.users = this.userList.map((item) => {
        return {
          ...item,
          companycode: this.companyList.find((c) => c.code == item.companycode)?.name || "",
        };
      })
      this.amountPage = Math.ceil(this.countUsers / this.userPageSize);
      this.page = this.userPage;
    },
    formatTime(datetime) {
      return moment(datetime).tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm");
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, { ...item, roleId: Number(item.roleId) });
      this.dialog = true;
    },
    resetPasswordItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, { ...item, roleId: Number(item.roleId) });
      this.dialogResetPassword = true;
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, { ...item, roleId: Number(item.roleId) });
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      if (this.editedItem.id) {
        await this.deleteUser(this.editedItem.id);
      }
      this.setUserData();
      this.closeDelete();
    },

    close() {
      this.showPassword = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeResetPassword() {
      this.dialogResetPassword = false;
      this.showResetPassword = false;
      this.showConfirmResetPassword = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      if (this.editedIndex > -1) {
        await this.updateUser(this.editedItem);
      } else {
        await this.createUser(this.editedItem);
      }
      this.setUserData();
      this.showPassword = false;
      this.close();
    },
    async saveResetPassword() {
      await this.updateUser(this.editedItem);
      this.setUserData();
      this.showPassword = false;
      this.closeResetPassword();
    },
    async search() {
      this.setUserData();
    },
    async selectPage() {
      console.log("selectPage", this.page);
      this.setUserData();
    },
  },
};
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
