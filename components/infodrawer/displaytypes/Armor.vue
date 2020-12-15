<template>
  <div class="ArmorItem-container">
    <div class="ToggleItemOptions">
      <div class="ButtonRow">
        <v-btn
          v-if="getItemAndUp.normal && getItemAndUp.rarity !== `nmag`"
          @click="setTier = `norm`"
        >
          <span>Normal</span>
          <v-icon>
            {{
              setTier === "norm"
                ? "mdi-checkbox-marked"
                : "mdi-checkbox-blank-outline"
            }}
          </v-icon>
        </v-btn>
        <v-btn
          v-if="getItemAndUp.exceptional && getItemAndUp.rarity !== `nmag`"
          @click="setTier = `exc`"
        >
          <span>Exceptional</span>
          <v-icon>
            {{
              setTier === "exc"
                ? "mdi-checkbox-marked"
                : "mdi-checkbox-blank-outline"
            }}
          </v-icon>
        </v-btn>
        <v-btn
          v-if="getItemAndUp.elite && getItemAndUp.rarity !== `nmag`"
          @click="setTier = `elt`"
        >
          <span>Elite</span>
          <v-icon>
            {{
              setTier === "elt"
                ? "mdi-checkbox-marked"
                : "mdi-checkbox-blank-outline"
            }}
          </v-icon>
        </v-btn>
      </div>
      <v-btn @click="isEthereal = !setEthereal">
        <span>Ethereal</span>
        <v-icon>
          {{
            isEthereal ? "mdi-checkbox-marked" : "mdi-checkbox-blank-outline"
          }}
        </v-icon>
      </v-btn>
    </div>
    <div class="NameImage">
      <h5 :class="itemTextClass">{{ isTier.name }}</h5>
      <span v-if="isTier.props.rarity !== `nmag`" class="ItemTier">{{
        isTier.base_name
      }}</span>
      <div class="ImageContainer">
        <img :src="isTier.image" :alt="isTier.name" />
      </div>
    </div>
    <v-col>
      <ul>
        <li v-if="isTier.props.tier" class="ItemTier">
          {{ isTier.props.tier | itemTier }}
        </li>
        <li>Defense: {{ calcDefense }}</li>
        <li v-if="isTier.props.level_req > 0">
          Level Req: {{ isTier.props.level_req }}
        </li>
        <li v-if="isTier.props.str_req > 0">
          Strength Req: {{ isTier.props.str_req }}
        </li>
        <li>Durability: {{ isTier.props.durability }}</li>
        <li class="ItemTier">
          Max Sockets: {{ isTier.props.sockets ? isTier.props.sockets : 0 }}
        </li>
        <li v-if="isTier.defense.block">Block: {{ isTier.defense.block }}</li>
        <li v-if="isTier.damage && isTier.damage.smite">
          Smite: {{ isTier.damage.smite.min }}-{{ isTier.damage.smite.max }}
        </li>
        <ul v-if="isTier.stats.length > 0" class="ItemStats">
          <li v-for="(stat, idx) in isTier.stats" :key="`${stat.code}-${idx}`">
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
import { mapGetters } from "vuex";
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
    runewords: {
      type: Array,
    },
  },
  data: () => ({
    setEthereal: false,
    setTier: null,
  }),
  computed: {
    ...mapGetters("items", ["getItemAndUp"]),
    getRunewords() {
      let itemType = this.isTier.type;
      if (itemType === "phlm" || itemType === "pelt" || itemType === "circ") {
        itemType = "helm";
      }
      if (itemType === "head" || itemType === "ashd") {
        itemType = "shie";
      }
      return this.runewords.filter(
        (obj) =>
          obj.bases.includes(itemType) &&
          this.isTier.props.sockets >= obj.sock_req
      );
    },
    showRunewords() {
      return this.isTier.props.rarity === "nmag";
    },
    itemTextClass() {
      let text = "nmag";
      if (this.isTier.props.rarity === "uni") {
        text = "rw-uni";
      }
      return text;
    },
    calcDefense() {
      let defense = this.isTier.defense;
      const isEth = this.isEthereal;
      const ed = this.isTier.stats.filter((obj) => obj.code === "ac%");
      const ac = this.isTier.stats.filter((obj) => obj.code === "ac");
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
          this.isTier.stats.filter((obj) => obj.code === "ethereal").length > 0
        ) {
          return true;
        }
        return this.setEthereal;
      },
      set(bool) {
        return (this.setEthereal = bool);
      },
    },
    isTier: {
      get() {
        if (this.setTier === "exc") {
          return this.getItemAndUp.exceptional;
        }
        if (this.setTier === "elt") {
          return this.getItemAndUp.elite;
        }
        return this.getItemAndUp.baseItem;
      },
      set(tier) {
        return (this.setTier = tier);
      },
    },
  },
  watch: {
    isTier(newItem, oldItem) {
      if (newItem.name !== oldItem.name) {
        this.setEthereal = false;
        this.setTier = this.getItemAndUp.baseTier;
      }
    },
  },
  beforeMount() {
    this.setTier = this.getItemAndUp.baseTier;
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

  .ToggleItemOptions {
    display: flex;
    flex-direction: column;

    .ButtonRow {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    button {
      margin: 0.2rem 0;
      span {
        margin-right: 0.5rem;
      }
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
    align-items: center;
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
