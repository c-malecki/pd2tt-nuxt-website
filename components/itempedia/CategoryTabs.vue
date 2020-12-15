<template>
  <v-tabs>
    <v-tab
      v-for="tab in tabs"
      :key="tab.text"
      @click="changeCategory(tab.id)"
      >{{ tab.text }}</v-tab
    >
  </v-tabs>
</template>

<script>
export default {
  name: "CategoryTabs",
  data: () => ({
    tabs: [
      { id: 0, text: "Bases / Non-Magic" },
      { id: 1, text: "Unique Items" },
      { id: 2, text: "Runewords" },
    ],
  }),
  methods: {
    changeCategory(id) {
      this.$emit("changeCat", id);
    },
  },
};
</script>

<style></style>
