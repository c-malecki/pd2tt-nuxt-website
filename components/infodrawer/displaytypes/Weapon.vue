<template>
  <div class="WeaponItem-container">
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
        <li>Damage: {{ calcDamage.main }}</li>
        <li v-if="item.damage.throw">Thrown: {{ calcDamage.throw }}</li>
        <li v-if="item.damage.barb1h">
          Barb One-Hand: {{ calcDamage.barb1h }}
        </li>
        <li v-if="item.props.level_req > 0">
          Level Req: {{ item.props.level_req }}
        </li>
        <li v-if="item.props.str_req > 0">
          Strength Req: {{ item.props.str_req }}
        </li>
        <li v-if="item.props.dex_req > 0">
          Dexterity Req: {{ item.props.dex_req }}
        </li>
        <li v-if="item.props.durability > 0">
          Durability: {{ item.props.durability }}
        </li>
        <li class="ItemTier">
          Max Sockets: {{ item.props.sockets ? item.props.sockets : 0 }}
        </li>
        <li>Speed: {{ item.props.speed }}</li>
        <li>Range: {{ item.props.range }}</li>
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
            class="rw-uni"
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
      if (itemType === "1hswor" || itemType === "2hswor") {
        itemType = "swor";
      }
      if (itemType === "1haxe" || itemType === "2haxe") {
        itemType = "axe";
      }
      if (itemType === "h2h2") {
        itemType = "h2h";
      }
      if (itemType === "bow" || itemType === "xbox") {
        itemType = "miss";
      }
      if (itemType === "aspe") {
        itemType = "spea";
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
    calcDamage() {
      // surely there is a better way to do this
      const { has_barb_1h, throwable } = this.item.damage;
      const isEth = this.isEthereal;
      const ed = this.item.stats.filter((obj) => obj.code === "dmg%");
      const mindmg = this.item.stats.filter((obj) => obj.code === "dmg-min");
      const maxdmg = this.item.stats.filter((obj) => obj.code === "dmg-max");
      const dmgnorm = this.item.stats.filter((obj) => obj.code === "dmg-norm");
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
      const main = this.item.damage.main;
      const thrown = throwable ? this.item.damage.throw : null;
      const barb1h = has_barb_1h ? this.item.damage.barb1h : null;
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
.WeaponItem-container {
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
