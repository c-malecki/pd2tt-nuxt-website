<template>
  <div class="InfoDrawerContent-container">
    <component
      :is="getComponentData.component"
      :data="getComponentData.data"
    ></component>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ItemDisplay from "./displaytypes/ItemDisplay";
export default {
  name: "InfoDrawerContent",
  components: {
    ItemDisplay,
  },
  computed: {
    ...mapGetters("items", ["getCurrentItem"]),
    getComponentData() {
      let component;
      let data;
      const type = this.$store.state.drawer.type;
      if (type === "item") {
        component = ItemDisplay;
        data = this.getCurrentItem;
      }
      return {
        component: component,
        data: data,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
