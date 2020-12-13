<template>
  <div v-click-outside="handleOutside" class="MiscItem-container">
    <div class="NameImage" @click="overlay = true">
      <h5 :class="itemTextClass">{{ item.name }}</h5>
      <span v-if="item.props.rarity !== `nmag`" class="ItemTier">{{
        item.base_name
      }}</span>
      <div class="ImageContainer">
        <img :src="item.image" :alt="item.name" />
      </div>
    </div>
    <v-col>
      <ul>
        <li v-if="item.props.level_req > 0">
          Level Req: {{ item.props.level_req }}
        </li>
        <ul v-if="item.stats.length > 0" class="ItemStats">
          <li v-for="stat in item.stats" :key="stat.code">
            {{ stat.display }}
          </li>
        </ul>
      </ul>
      <v-expansion-panels
        v-if="showRunewords"
        :style="{ maxHeight: `300px`, overflowY: `scroll`, marginTop: `1rem` }"
      >
        <v-expansion-panel>
          <v-expansion-panel-header> Runewords </v-expansion-panel-header>
          <v-expansion-panel-content
            v-for="rw in getRunewords"
            :key="rw.name"
            class="Runeword"
          >
            {{ rw.name }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </div>
</template>

<script>
export default {
  name: "MiscItemDisplay",
  filters: {
    itemTier(val) {
      let string = "Normal";
      if (val === "exc") {
        string = "Exceptional";
      } else if (val === "elt") {
        string = "Elite";
      }
      return string;
    },
  },
  props: {
    item: {
      type: Object,
    },
    runewords: {
      type: Array,
    },
  },
  data: () => ({
    overlay: false,
  }),
  computed: {
    getRunewords() {
      let itemType = this.item.type;
      if (itemType === "phlm" || itemType === "pelt" || itemType === "circ") {
        itemType = "helm";
      }
      if (itemType === "head" || itemType === "ashd") {
        itemType = "shie";
      }
      return this.runewords.filter(
        (obj) =>
          obj.bases.includes(itemType) &&
          this.item.props.sockets >= obj.sock_req
      );
    },
    showRunewords() {
      return this.item.props.rarity === "nmag";
    },
    itemTextClass() {
      let text = "nmag";
      if (this.item.props.rarity === "uni") {
        text = "rw-uni";
      }
      return text;
    },
  },
  methods: {
    handleOutside() {
      this.overlay = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.MiscItem-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $dark-bg;
  h5 {
    text-align: center;
    width: 100%;
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }
  .NameImage {
    display: flex;
    flex-direction: column;
    .ImageContainer {
      width: 150px;
      height: 150px;
      overflow: hidden;
    }
    span {
      text-align: center;
    }
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  ul {
    list-style: none;
    padding-left: 0;

    li {
      text-align: center;
    }
  }

  .ItemTier {
    color: $gray-text;
  }

  .ItemStats {
    color: $mag-text;
  }

  .nmag {
    color: #ffffff;
  }

  .rw-uni {
    color: $uni-text;
  }
}
</style>
