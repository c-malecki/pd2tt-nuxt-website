<template>
  <div
    :class="`ItemDisplay-container ${tileBorder}`"
    @click="openInfoDrawer(item)"
  >
    <h5 :class="itemTextClass">{{ item.name }}</h5>
    <img v-if="item.group !== `runeword`" :src="item.image" :alt="item.name" />
    <div v-if="item.group === `runeword`" class="rw-props">
      <span v-if="item.group === `runeword`">
        {{ item.rune_string }}
      </span>
      <ul>
        <li v-for="type in item.bases" :key="type" class="rw-basetype">
          {{ type | rwBases }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemTile",
  filters: {
    rwBases(string) {
      if (string === "swor") {
        return "Swords";
      }
      if (string === "shie") {
        return "Shields";
      }
      if (string === "axe") {
        return "Axes";
      }
      if (string === "h2h" || string === "h2h2") {
        return "Assassin Claws";
      }
      if (string === "miss") {
        return "Missile Weapons";
      }
      if (string === "club") {
        return "Clubs";
      }
      if (string === "hamm") {
        return "Hammers";
      }
      if (string === "mele") {
        return "Melee Weapons";
      }
      if (string === "scep") {
        return "Scepters";
      }
      if (string === "staf") {
        return "Staves";
      }
      if (string === "weap") {
        return "All Weapons";
      }
      if (string === "pole") {
        return "Polearms";
      }
      if (string === "spea") {
        return "Spears";
      }
      if (string === "wand") {
        return "Wands";
      }
      if (string === "tors") {
        return "Body Armors";
      }
      if (string === "helm") {
        return "Helms";
      }
      if (string === "ashd") {
        return "Paladin Shield";
      }
    },
  },
  props: {
    item: {
      type: Object,
    },
  },
  computed: {
    itemTextClass() {
      let text = "nmag";
      if (this.item.props.rarity === "uni" || this.item.group === "runeword") {
        text = "rw-uni";
      }
      return text;
    },
    tileBorder() {
      let borderClass = "border-nmag";
      if (this.item.props.rarity === "uni" || this.item.group === "runeword") {
        borderClass = "border-rw-uni";
      }
      return borderClass;
    },
  },
  methods: {
    openInfoDrawer(item) {
      this.$store.dispatch("items/setCurrent", item).then(() => {
        this.$store.commit("items/setRuneword", null);
        this.$store.commit("openDrawer", "item");
      });
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
  border-radius: 0.5rem;
  background-color: $dark-bg;
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

  .rw-props {
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      text-align: center;
    }

    ul {
      list-style: none;
      padding-left: 0;

      .rw-basetype {
        text-align: center;
        color: $gray-text;
      }
    }
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
.border-nmag {
  border: 1px solid #ffffff88;
}
.border-rw-uni {
  border: 1px solid #a5926393;
}
</style>
