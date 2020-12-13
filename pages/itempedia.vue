<template>
  <v-col>
    <h1>Itempedia</h1>
    <CategoryTabs @changeCat="handleChangeCat" />
    <component :is="displaySearchCat" />
  </v-col>
</template>

<script>
import BasesSearch from "../components/itempedia/BasesSearch";
import UniquesSearch from "../components/itempedia/UniquesSearch";
import CategoryTabs from "../components/itempedia/CategoryTabs";
export default {
  name: "Itempedia",
  components: {
    CategoryTabs,
    BasesSearch,
    UniquesSearch,
  },
  data: () => ({
    selected: 0,
  }),
  computed: {
    displaySearchCat() {
      let component = BasesSearch;
      if (this.selected === 1) {
        component = UniquesSearch;
      }
      return component;
    },
  },
  methods: {
    handleChangeCat(id) {
      this.selected = id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
