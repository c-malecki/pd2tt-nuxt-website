<template>
  <div class="ItemDisplay-container" @click="openInfoDrawer(item)">
    <h5 :class="itemTextClass">{{ item.name }}</h5>
    <img :src="item.image" :alt="item.name" />
  </div>
</template>

<script>
export default {
  name: "ItemTile",
  props: {
    item: {
      type: Object,
    },
  },
  computed: {
    itemTextClass() {
      let text = "nmag";
      if (this.item.props.rarity === "uni") {
        text = "rw-uni";
      }
      return text;
    },
  },
  methods: {
    openInfoDrawer(item) {
      this.$store.commit("openDrawer", "item");
      this.$store.commit("items/currentItem", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.ItemDisplay-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 170px;
  overflow: hidden;
  margin: 0.5rem;
  border: 1px solid white;
  cursor: pointer;

  h5 {
    text-align: center;
    width: 100%;
    font-size: 1rem;
  }

  img {
    top: 20px;
    position: absolute;
  }

  .nmag {
    color: #ffffff;
  }

  .rw-uni {
    color: $uni-text;
  }

  @media (hover: hover) {
    &:hover {
      background-color: rgb(30, 30, 30);
    }
  }
}
</style>
