<template>
    <v-app id="orders">
      <PageTitle title="Role Management"/>
      <div class="my-5">
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="8">
            <v-row class="pa-2" outlined tile >
              <v-col cols="12" md="6">
                <Input v-model="searchText" hideDetails="auto"></Input>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn 
                  depressed
                  color="primary"
                  @click="search()">
                  Search
                </v-btn>
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
          :items="roles"
          class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New Role
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="editedItem.selectedPermissions"
                            :items="permissions"
                            label="Select Permissions"
                            item-value="id" 
                            item-text="name" 
                            multiple
                            chips
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
      
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="save"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Are you sure you want to delete this role?</v-card-title>
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
            {{item.name}}
          </template>
          <template v-slot:item.permissions="{ item }">
            <div style="text-align: start; width:100%">
              <li v-for="(perm, i) in item.permissions" :key="i" class="py-1">
                {{ perm.name }}
              </li>
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
      </div>
       </div>
    </v-app>
</template>

<script>
import moment from 'moment-timezone';
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
      roles: [],
      permissions: [],
      searchText: null,
      showPassword: false,
      page: 1,
      amountPage: 0,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Permissions', value: 'permissions', sortable: false, align: 'start',},
        { text: 'Actions', value: 'actions', sortable: false },
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
      editedItem: {
        code: '',
        name: '',
        selectedPermissions: [],
        id: 0
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
    await this.setRoleData()
    await this.setPermissionData()
  },
  async mounted() {
  },
  destroyed() {
  },
  watch: {
  },
  computed: {
    ...mapGetters("roles", ["roleList"]),
    ...mapGetters("permissions", ["permissionList"]),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },

  },
  methods: {
    ...mapActions('roles', ['getRoleList', 'createRole', 'updateRole']),
    ...mapActions('permissions', ['getPermissionList']),
    async setRoleData(){
      await this.getRoleList({ includepermission : true, search: this.searchText || ""});
      this.roles = this.roleList
    },
    async setPermissionData(){
      await this.getPermissionList();
      this.permissions = this.permissionList
    },
    formatTime(datetime) {
        return moment(datetime).tz('Asia/Bangkok').format('DD-MM-YYYY HH:mm');
    },
    editItem (item) {
      let selectedPermissions = item.permissions && item.permissions.map(pm => pm.id)
      this.editedIndex = this.roles.indexOf(item)
      this.editedItem = Object.assign({}, { ...item, roleId: Number(item.roleId), selectedPermissions})
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.roles.indexOf(item)
      this.editedItem = Object.assign({}, { ...item, roleId: Number(item.roleId)})
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      if(this.editedItem.id){
        await this.deleteUser(this.editedItem.id)
      }
      this.setUserData()
      this.closeDelete()
    },

    close () {
      this.showPassword = false
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async save () {
      if (this.editedIndex > -1) {
        await this.updateRole(this.editedItem)
      } else {
        await this.createRole(this.editedItem)
      }
      this.setRoleData()
      this.close()
    },
    async search() {
      this.setRoleData()
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
