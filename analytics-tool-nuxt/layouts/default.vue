<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-row align="center">
        <v-col md="8" lg="9" cols="8">
          <p class="mt-4" :class="responsiveText">VAST Challenge 2014</p>
        </v-col>
        <v-col lg="3" md="4" cols="6" class="hidden-md-and-down">
          <v-btn
            small
            text
            v-for="(item, index) in menuItems"
            :key="'L' + index"
            router
            :to="item.link"
            active-class="button-link-active"
            >{{ item.title }}</v-btn
          >
        </v-col>
      </v-row>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      color="#c6382c"
      dark
      style="position:fixed; top:0; left:0; overflow-y:scroll;"
    >
      <v-divider class="mt-2"></v-divider>
      <v-list nav dense>
        <v-list-item-group
          active-class="text--accent-4"
          v-for="(item, index) in menuItems"
          :key="'K' + index"
        >
          <v-list-item :to="item.link" class="mt-2">
            <v-list-item-icon>
              <v-icon>fas fa-{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  computed: {
    responsiveText() {
      return {
        "body-1": this.$vuetify.breakpoint.mdAndDown,
        headline: this.$vuetify.breakpoint.mdAndUp
      };
    }
  },

  data: () => ({
    drawer: false,
    collapseOnScroll: true,
    menuItems: [
      {
        title: "Timeline Novelty",
        link: "/novelty",
        icon: "history"
      },
      {
        title: "Email",
        link: "/email",
        icon: "at"
      }
    ]
  })
};
</script>
<style scoped>
.button-link-active {
  background-color: #c6382c !important;
}
.button-link-active::before {
  background-color: #c6382c !important;
}
/* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
} */
</style>
