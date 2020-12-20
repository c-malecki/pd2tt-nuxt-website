<template>
  <div class="WeaponItem-container">
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
      <v-btn
        v-if="
          getTier.type !== `abow` &&
          getTier.type !== `bow` &&
          getTier.type !== `xbow`
        "
        @click="isEthereal = !setEthereal"
      >
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
        <li>Damage: {{ calcDamage.main }}</li>
        <li v-if="getTier.damage.throw">Thrown: {{ calcDamage.throw }}</li>
        <li v-if="getTier.damage.barb1h">
          Barb One-Hand: {{ calcDamage.barb1h }}
        </li>
        <li v-if="getTier.props.level_req > 0">
          Level Req: {{ getTier.props.level_req }}
        </li>
        <li v-if="getTier.props.str_req > 0">
          Strength Req: {{ getTier.props.str_req }}
        </li>
        <li v-if="getTier.props.dex_req > 0">
          Dexterity Req: {{ getTier.props.dex_req }}
        </li>
        <li v-if="getTier.props.durability > 0">
          Durability: {{ getTier.props.durability }}
        </li>
        <li class="ItemTier">
          Max Sockets: {{ getTier.props.sockets ? getTier.props.sockets : 0 }}
        </li>
        <li>Speed: {{ getTier.props.speed }}</li>
        <li>Range: {{ getTier.props.range }}</li>
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
  name: "WeaponDisplay",
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
    hasRuneword: null,
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
      if (itemType === "1hswor" || itemType === "2hswor") {
        itemType = "swor";
      }
      if (itemType === "1haxe" || itemType === "2haxe") {
        itemType = "axe";
      }
      if (itemType === "h2h2") {
        itemType = "h2h";
      }
      if (itemType === "bow" || itemType === "xbox" || itemType === "abow") {
        itemType = "miss";
      }
      if (itemType === "aspe") {
        itemType = "spea";
      }
      return this.runewords.filter(
        (obj) =>
          obj.bases.includes(itemType) &&
          this.getTier.props.sockets >= obj.props.sock_req
      );
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
    calcDamage() {
      // surely there is a better way to do this
      const { has_barb_1h, throwable } = this.getTier.damage;
      const isEth = this.isEthereal;
      const ed = this.getTier.stats.filter((obj) => obj.code === "dmg%");
      const mindmg = this.getTier.stats.filter((obj) => obj.code === "dmg-min");
      const maxdmg = this.getTier.stats.filter((obj) => obj.code === "dmg-max");
      const dmgnorm = this.getTier.stats.filter(
        (obj) => obj.code === "dmg-norm"
      );
      const edVal =
        ed.length > 0 ? { min: ed[0].min, max: ed[0].max } : { min: 0, max: 0 };
      const mindmgVal =
        mindmg.length > 0
          ? { min: mindmg[0].min, max: mindmg[0].max }
          : { min: 0, max: 0 };
      const maxdmgVal =
        maxdmg.length > 0
          ? { min: maxdmg[0].min, max: maxdmg[0].max }
          : { min: 0, max: 0 };
      const dmgnormVal =
        dmgnorm.length > 0
          ? { min: dmgnorm[0].min, max: dmgnorm[0].max }
          : { min: 0, max: 0 };
      const main = this.getTier.damage.main;
      const thrown = throwable ? this.getTier.damage.throw : null;
      const barb1h = has_barb_1h ? this.getTier.damage.barb1h : null;
      const dmgFormula = (dmg) => {
        if (dmg) {
          let min = dmg.min;
          let max = dmg.max;
          let min2 = dmg.min;
          let max2 = dmg.max;
          if (isEth) {
            min = min * 1.5;
            max = max * 1.5;
            min2 = min2 * 1.5;
            max2 = max2 * 1.5;
          }
          min = Math.round(
            min * (1 + edVal.min / 100) + mindmgVal.min + dmgnormVal.min
          );
          max = Math.round(
            max * (1 + edVal.min / 100) + maxdmgVal.min + dmgnormVal.min
          );
          min2 = Math.round(
            min2 * (1 + edVal.max / 100) + mindmgVal.max + dmgnormVal.max
          );
          max2 = Math.round(
            max2 * (1 + edVal.max / 100) + maxdmgVal.max + dmgnormVal.max
          );
          return min !== min2
            ? `(${min} - ${min2}) to (${max} - ${max2})`
            : `${min} - ${max}`;
        } else {
          return dmg;
        }
      };
      return {
        main: dmgFormula(main),
        throw: dmgFormula(thrown),
        barb1h: dmgFormula(barb1h),
      };
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
    getTier(newItem, oldItem) {
      if (newItem.name !== oldItem.name) {
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
.WeaponItem-container {
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
