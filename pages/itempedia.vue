<template>
  <div class="page-content">
    <CategoryTabs @changeCat="handleChangeCat" />
    <component :is="displaySearchCat" />
  </div>
</template>

<script>
import BasesSearch from "../components/itempedia/BasesSearch";
import UniquesSearch from "../components/itempedia/UniquesSearch";
import RunewordsSearch from "../components/itempedia/RunewordSearch";
import CategoryTabs from "../components/itempedia/CategoryTabs";
export default {
  name: "Itempedia",
  components: {
    CategoryTabs,
    BasesSearch,
    UniquesSearch,
    RunewordsSearch,
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
      if (this.selected === 2) {
        component = RunewordsSearch;
      }
      return component;
    },
  },
  methods: {
    handleChangeCat(id) {
      this.selected = id;
    },
  },
  head: () => ({
    title: "Itempedia",
  }),
};
</script>

<style lang="scss" scoped>
.page-content {
  background-color: $ui-bg;
}
</style>
