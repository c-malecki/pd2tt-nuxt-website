<template>
  <div class="ItemDisplay-container">
    <component :is="getGroup" :runewords="filterRunewords"></component>
  </div>
</template>

<script>
import allRunewords from "../../../assets/json/all_runewords.json";
import Weapon from "./Weapon";
import Armor from "./Armor";
import MiscItem from "./MiscItem";
export default {
  name: "ItemDisplay",
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    getGroup() {
      let component;
      if (this.data.group === "weapon") {
        component = Weapon;
      } else if (this.data.group === "armor") {
        component = Armor;
      } else if (this.data.group === "misc") {
        component = MiscItem;
      }
      return component;
    },
    filterRunewords() {
      const runewords = [...allRunewords];
      const weaponTypes = [
        "club",
        "hamm",
        "mace",
        "mele",
        "scep",
        "swor",
        "axe",
        "staff",
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
