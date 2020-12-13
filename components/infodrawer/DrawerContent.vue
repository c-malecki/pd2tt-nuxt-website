<template>
  <div class="InfoDrawerContent-container">
    <component
      :is="getComponentType"
      v-if="this.$store.state.infoDrawer.current"
      :data="getDataForComponent"
    ></component>
  </div>
</template>

<script>
import ItemDisplay from "./displaytypes/ItemDisplay";
export default {
  name: "InfoDrawerContent",
  components: {
    ItemDisplay,
  },
  computed: {
    getComponentType() {
      let component;
      const type = this.$store.state.infoDrawer.current.type;
      if (type === "item") {
        component = ItemDisplay;
      }
      return component;
    },
    getDataForComponent() {
      return this.$store.state.infoDrawer.current.data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
