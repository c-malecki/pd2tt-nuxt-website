<template>
  <div class="ArmorItem-container">
    <div class="ToggleItemOptions">
      <div class="ButtonRow">
        <v-btn
          v-if="getItemAndUp.normal && getItemAndUp.rarity !== `nmag`"
          @click="getTier = `norm`"
        >
          <span>Normal</span>
          <v-icon>
            {{
              isCurrentTier === "norm"
                ? "mdi-checkbox-marked"
                : "mdi-checkbox-blank-outline"
            }}
          </v-icon>
        </v-btn>
        <v-btn
          v-if="
            getItemAndUp.exceptional.name !== `old` &&
            getItemAndUp.rarity !== `nmag`
          "
          @click="getTier = `exc`"
        >
          <span>Exceptional</span>
          <v-icon>
            {{
              isCurrentTier === "exc"
                ? "mdi-checkbox-marked"
                : "mdi-checkbox-blank-outline"
            }}
          </v-icon>
        </v-btn>
        <v-btn
          v-if="getItemAndUp.elite && getItemAndUp.rarity !== `nmag`"
          @click="getTier = `elt`"
        >
          <span>Elite</span>
          <v-icon>
            {{
              isCurrentTier === "elt"
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
      <h5 v-if="getAppliedRuneword" class="rw-uni">{{ getTier.rw_name }}</h5>
      <h5 :class="itemTextClass">{{ getTier.name }}</h5>
      <span v-if="getTier.props.rarity !== `nmag`" class="ItemTier">{{
        getTier.base_name
      }}</span>
      <span v-if="getAppliedRuneword" class="ItemTier">{{
        getTier.rune_string
      }}</span>
      <div class="ImageContainer">
        <img :src="getTier.image" :alt="getTier.name" />
      </div>
    </div>
    <v-col>
      <ul>
        <li v-if="getTier.props.tier" class="ItemTier">
          {{ getTier.props.tier | itemTier }}
        </li>
        <li>Defense: {{ calcDefense }}</li>
        <li v-if="getTier.props.level_req > 0">
          Level Req: {{ getTier.props.level_req }}
        </li>
        <li v-if="getTier.props.str_req > 0">
          Strength Req: {{ getTier.props.str_req }}
        </li>
        <li>Durability: {{ getTier.props.durability }}</li>
        <li class="ItemTier">
          Max Sockets: {{ getTier.props.sockets ? getTier.props.sockets : 0 }}
        </li>
        <li v-if="getTier.defense.block">Block: {{ getTier.defense.block }}</li>
        <li v-if="getTier.damage && getTier.damage.smite">
          Smite: {{ getTier.damage.smite.min }}-{{ getTier.damage.smite.max }}
        </li>
        <ul v-if="getTier.stats.length > 0" class="ItemStats">
          <li v-for="(stat, idx) in getTier.stats" :key="`${stat.code}-${idx}`">
            {{ stat.display }}
          </li>
        </ul>
      </ul>
      <v-autocomplete
        v-if="showRunewords"
        v-model="hasRuneword"
        class="mt-2"
        label="Runeword"
        :items="getRunewords"
        item-text="name"
        clearable
        return-object
        flat
        dense
        outlined
        hide-details
        @change="handleApplyRuneword($event)"
      />
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
    isCurrentTier: null,
    hasRuneword: false,
  }),
  methods: {
    handleApplyRuneword(rwObj) {
      if (rwObj === undefined) {
        this.$store.commit("items/setRuneword", null);
      } else {
        this.$store.commit("items/setRuneword", rwObj);
      }
    },
  },
  computed: {
    ...mapGetters("items", ["getItemAndUp", "getAppliedRuneword"]),
    getRunewords() {
      let itemType = this.getTier.type;
      if (itemType === "phlm" || itemType === "pelt" || itemType === "circ") {
        itemType = "helm";
      }
      if (itemType === "head" || itemType === "ashd") {
        itemType = "shie";
      }
      let results;
      if (this.getTier.type === "ashd") {
        results = this.runewords.filter(
          (obj) =>
            (obj.bases.includes(itemType) || obj.bases.includes("ashd")) &&
            this.getTier.props.sockets >= obj.props.sock_req
        );
      } else {
        results = this.runewords.filter(
          (obj) =>
            obj.bases.includes(itemType) &&
            this.getTier.props.sockets >= obj.props.sock_req
        );
      }
      return results;
    },
    showRunewords() {
      return this.getTier.props.rarity === "nmag";
    },
    itemTextClass() {
      let text = "nmag";
      if (this.getTier.props.rarity === "uni") {
        text = "rw-uni";
      }
      return text;
    },
    calcDefense() {
      let defense = this.getTier.defense;
      const isEth = this.isEthereal;
      const ed = this.getTier.stats.filter((obj) => obj.code === "ac%");
      const ac = this.getTier.stats.filter((obj) => obj.code === "ac");
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
          this.getTier.stats.filter((obj) => obj.code === "ethereal").length > 0
        ) {
          return true;
        }
        return this.setEthereal;
      },
      set(bool) {
        return (this.setEthereal = bool);
      },
    },
    getTier: {
      get() {
        if (this.getAppliedRuneword) {
          return this.getAppliedRuneword;
        }
        if (!this.getAppliedRuneword && this.isCurrentTier === "exc") {
          return this.getItemAndUp.exceptional;
        }
        if (!this.getAppliedRuneword && this.isCurrentTier === "elt") {
          return this.getItemAndUp.elite;
        }
        return this.getItemAndUp.baseItem;
      },
      set(tier) {
        return (this.isCurrentTier = tier);
      },
    },
  },
  watch: {
    getTier(oldItem, newItem) {
      if (oldItem.name !== newItem.name) {
        this.hasRuneword = null;
        this.isCurrentTier = this.getItemAndUp.baseTier;
        this.setEthereal = false;
      }
    },
  },
  beforeMount() {
    this.isCurrentTier = this.getItemAndUp.baseTier;
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
