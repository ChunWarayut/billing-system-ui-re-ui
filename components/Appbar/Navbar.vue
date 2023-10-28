<template>
   <v-navigation-drawer 
      style="background-color:#2C74B3;" app
      class="d-none d-md-flex d-lg-flex d-xl-flex">
     <v-list nav dense>
      <v-list-item-group v-model="model"
      active-class="border"
        color="indigo"
      >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6" style="color:white;">
            {{ title }}
          </v-list-item-title>
      </v-list-item-content>
      </v-list-item>
        <v-list-item
          v-for="(item, i) in showMenu"
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
</template>

<script>
import { menuItems } from '../../utills/constants';
import { hasPermission } from '../../utills/permissions';

export default {
  data () {
    return {
      title: 'I-Tech',
      model: 1,
      items: menuItems
    }
  },
  computed: {
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
  methods: {
    checkPermission(permCode) {
      return hasPermission(permCode)
    }
  },
}
</script>
<style scoped>
.border {
  color: white;
}
</style>
