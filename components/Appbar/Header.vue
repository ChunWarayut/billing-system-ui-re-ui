<template>
  <div>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = true" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <span>
        {{user ? `${user.firstname} ${user.lastname}` : ''}}
      </span>
      <v-btn
        icon
        @click="onClickLogout"
        id="btn_auth_logout"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer"
      absolute
      temporary
      style="background-color:#2C74B3;" app>
     <v-list nav dense>
      <v-list-item-group v-model="model"
      active-class="border"
        color="indigo"
      >
      <v-list-item
        ></v-list-item>
         <v-divider></v-divider>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
        >
          <v-list-item-content style="color:white;" >
            <v-list-item-title >{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
import { menuItems } from '../../utills/constants';
import { hasPermission } from '../../utills/permissions';
export default {
  data () {
    return {
      title: 'I-Tech',
      drawer: false,
      group: null,
      model: 1,
      items: menuItems
    }
  },
  mounted(){
  },
  methods:{
    onClickLogout(){
      this.logout()
      this.$router.push('/auth')
    },
    checkPermission(permCode) {
      return hasPermission(permCode)
    },
    ...mapActions("auth", ["logout"]),
  },
   computed: {
    ...mapGetters("auth", ["user"]),
    showMenu() {
      const menu = []
      for (const mi of menuItems) {
        const hasPerm = hasPermission(mi.permission)
          if (hasPerm) {
            menu.push(mi)
          }
      }
      return menu
    },
  },
}
</script>
