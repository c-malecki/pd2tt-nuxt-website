<template>
  <v-app dark>
    <v-app-bar fixed app>
      <NuxtLink to="/" class="LogoLink">
        <v-img src="/logo.png" max-height="80" max-width="120" />
      </NuxtLink>
      <v-tabs grow>
        <NuxtLink
          v-for="link in links"
          :key="link.text"
          :to="link.path"
          class="NavTab"
        >
          <v-tab>{{ link.text }}</v-tab>
        </NuxtLink>
      </v-tabs>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawerState"
      temporary
      app
      right
      :width="drawerWidth"
    >
      <v-btn @click="drawerState = false">X</v-btn>
      <DrawerContent />
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer fixed app>
      <span>PD2tooling.tech &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import DrawerContent from "../components/infodrawer/DrawerContent";
export default {
  name: "Root",
  components: {
    DrawerContent,
  },
  data() {
    return {
      links: [
        {
          path: "/",
          text: "Home",
        },
        {
          path: "/itempedia",
          text: "Itempedia",
        },
      ],
    };
  },
  computed: {
    drawerState: {
      get() {
        return this.$store.state.infoDrawer.isOpen;
      },
      set(val) {
        return this.$store.commit("closeDrawer", val);
      },
    },
    drawerWidth() {
      let width = "600";
      const viewWidth = this.$vuetify.breakpoint.width;
      if (viewWidth < 1264) {
        width = "500";
      }
      if (viewWidth < 960) {
        width = "400";
      }
      if (viewWidth < 600) {
        width = "100%";
      }
      return width;
    },
  },
};
</script>

<style lang="scss">
.LogoLink {
  margin-right: 3rem;
}
.NavTab {
  text-decoration: none;
  display: flex;
}
</style>
