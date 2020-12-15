<template>
  <v-app dark>
    <v-app-bar fixed app>
      <NuxtLink to="/" class="LogoLink">
        <v-img src="/logo.png" max-height="80" max-width="120" />
      </NuxtLink>
      <v-tabs v-model="active" grow class="hidden-sm-and-down">
        <NuxtLink
          v-for="link in links"
          :key="link.text"
          :to="link.path"
          class="NavTab"
        >
          <v-tab>{{ link.text }}</v-tab>
        </NuxtLink>
      </v-tabs>
      <v-menu offset-y class="elevation-0">
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon
            class="hidden-md-and-up ml-auto"
            color="white"
            v-bind="attrs"
            v-on="on"
          ></v-app-bar-nav-icon>
        </template>
        <v-list>
          <v-list-item v-for="link in links" :key="link.text">
            <NuxtLink :to="link.path" class="NavTab">
              {{ link.text }}
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-menu>
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
      <div class="Donate">
        <form
          action="https://www.paypal.com/donate"
          method="post"
          target="_top"
        >
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="7UFBGK9Y84WK2" />
          <input type="hidden" name="currency_code" value="USD" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
            border="0"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
      </div>
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
      active: 0,
      links: [
        {
          id: 0,
          path: "/",
          text: "Home",
        },
        {
          id: 1,
          path: "/itempedia",
          text: "Itempedia",
        },
      ],
    };
  },
  computed: {
    drawerState: {
      get() {
        return this.$store.state.drawer.isOpen;
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
      if (viewWidth < 600) {
        width = "100%";
      }
      return width;
    },
  },
  beforeMount() {
    this.active =
      this.links.find((obj) => obj.path === this.$route.path).id || 0;
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
.Donate {
  margin-left: auto;
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
