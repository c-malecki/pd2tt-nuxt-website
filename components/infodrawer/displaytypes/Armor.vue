<template>
  <div class="ArmorItem-container">
    <div class="ToggleEth">
      <v-btn @click="isEthereal = !setEthereal">
        <span>Eth</span>
        <v-icon>
          {{
            isEthereal ? "mdi-checkbox-marked" : "mdi-checkbox-blank-outline"
          }}
        </v-icon>
      </v-btn>
    </div>
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
        <li v-if="item.props.tier" class="ItemTier">
          {{ item.props.tier | itemTier }}
        </li>
        <li>Defense: {{ calcDefense }}</li>
        <li v-if="item.props.level_req > 0">
          Level Req: {{ item.props.level_req }}
        </li>
        <li v-if="item.props.str_req > 0">
          Strength Req: {{ item.props.str_req }}
        </li>
        <li>Durability: {{ item.props.durability }}</li>
        <li class="ItemTier">
          Max Sockets: {{ item.props.sockets ? item.props.sockets : 0 }}
        </li>
        <li v-if="item.defense.block">Block: {{ item.defense.block }}</li>
        <li v-if="item.damage && item.damage.smite">
          Smite: {{ item.damage.smite.min }}-{{ item.damage.smite.max }}
        </li>
        <ul v-if="item.stats.length > 0" class="ItemStats">
          <li v-for="(stat, idx) in item.stats" :key="`${stat.code}-${idx}`">
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
  name: "ArmorDisplay",
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
    setEthereal: false,
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
    calcDefense() {
      const { defense } = this.item;
      const isEth = this.isEthereal;
      const ed = this.item.stats.filter((obj) => obj.code === "ac%");
      const ac = this.item.stats.filter((obj) => obj.code === "ac");
      const edVal =
        ed.length > 0 ? { min: ed[0].min, max: ed[0].max } : { min: 0, max: 0 };
      const acVal =
        ac.length > 0 ? { min: ac[0].min, max: ac[0].max } : { min: 0, max: 0 };

      let min = isEth ? defense.min * 1.5 : defense.min;
      let max = isEth ? defense.max * 1.5 : defense.max;
      let min2 = isEth ? defense.min * 1.5 : defense.min;
      let max2 = isEth ? defense.max * 1.5 : defense.max;
      min = Math.round(min * (1 + edVal.min / 100) + acVal.min);
      max = Math.round(max * (1 + edVal.min / 100) + acVal.min);
      min2 = Math.round(min2 * (1 + edVal.max / 100) + acVal.max);
      max2 = Math.round(max2 * (1 + edVal.max / 100) + acVal.max);
      return min !== min2
        ? `(${min} - ${min2}) to (${max} - ${max2})`
        : `${min} - ${max}`;
    },
    isEthereal: {
      get() {
        if (
          this.item.stats.filter((obj) => obj.code === "ethereal").length > 0
        ) {
          return true;
        }
        return this.setEthereal;
      },
      set(bool) {
        return (this.setEthereal = bool);
      },
    },
  },
  watch: {
    item(newItem, oldItem) {
      if (newItem.name !== oldItem.name) {
        this.setEthereal = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ArmorItem-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $dark-bg;

  .ToggleEth {
    position: absolute;
    top: 0;
    left: 0;
    span {
      margin-right: 0.5rem;
    }
  }

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
