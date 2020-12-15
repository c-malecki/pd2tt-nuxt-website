<template>
  <div class="ItemDisplay-container">
    <component :is="getGroup" :runewords="filterRunewords"></component>
  </div>
</template>

<script>
import Weapon from "./Weapon";
import Armor from "./Armor";
import Runeword from "./Runeword";
import MiscItem from "./MiscItem";
import { mapGetters } from "vuex";
export default {
  name: "ItemDisplay",
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters("items", ["getRunewords"]),
    getGroup() {
      let component;
      if (this.data.group === "weapon") {
        component = Weapon;
      } else if (this.data.group === "armor") {
        component = Armor;
      } else if (this.data.group === "misc") {
        component = MiscItem;
      } else if (this.data.group === "runeword") {
        component = Runeword;
      }
      return component;
    },
    filterRunewords() {
      const runewords = this.getRunewords;
      const weaponTypes = [
        "club",
        "hamm",
        "mace",
        "mele",
        "scep",
        "swor",
        "axe",
        "staf",
        "miss",
        "wand",
        "weapon",
        "pole",
        "spea",
        "h2h",
        "h2h2",
      ];
      const armorTypes = ["shie", "tors", "helm"];
      let result = [];
      if (this.data.group === "weapon") {
        result = runewords.filter((obj) => {
          for (let i = 0; i < weaponTypes.length; i++) {
            if (obj.bases.includes(weaponTypes[i])) {
              return obj;
            }
          }
        });
      }
      if (this.data.group === "armor") {
        result = runewords.filter((obj) => {
          for (let i = 0; i < armorTypes.length; i++) {
            if (obj.bases.includes(armorTypes[i])) {
              return obj;
            }
          }
        });
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.ItemDisplay-container {
  margin: 0.5rem;
  border: 1px solid white;
  cursor: pointer;
}
</style>
