<template>
  <div>
    <div class="Itempedia-filter-container">
      <div class="Itempedia-filter-row">
        <div class="Input-Wrapper">
          <v-text-field
            v-model="formValues.name"
            label="Name"
            flat
            dense
            outlined
            hide-details
          />
        </div>

        <div class="Input-Wrapper">
          <v-autocomplete
            v-model="formValues.type"
            :items="getRwTypes"
            label="Type"
            item-text="name"
            item-value="code"
            clearable
            flat
            dense
            outlined
            hide-details
          />
        </div>

        <div class="Input-Wrapper">
          <v-autocomplete
            v-model="formValues.runes"
            :items="getRunes"
            label="Runes (Currently partial match)"
            item-text="name"
            item-value="code"
            clearable
            multiple
            flat
            dense
            outlined
            hide-details
          />
        </div>
        <div class="Input-Wrapper Sockets">
          <v-autocomplete
            v-model="formValues.socketMin"
            :items="formControl.sockets"
            label="Socket Req Min"
            clearable
            flat
            dense
            outlined
            hide-details
          />
        </div>
        <div class="Input-Wrapper Sockets">
          <v-autocomplete
            v-model="formValues.socketMax"
            :items="calcSocketMax"
            label="Socket Req Max"
            clearable
            flat
            dense
            outlined
            hide-details
          />
        </div>
        <div class="Input-Wrapper Properties">
          <v-autocomplete
            v-model="formValues.selectedStats"
            :items="getItemStats"
            item-text="display"
            item-value="display"
            label="Properties (Currently partial match)"
            clearable
            multiple
            return-object
            flat
            dense
            outlined
            hide-details
          />
        </div>
      </div>
    </div>
    <v-pagination
      v-model="getCurrentPage"
      :length="getPageTotal"
    ></v-pagination>
    <v-row align="center" justify="center">
      <ItemTile
        v-for="(item, idx) in paginateItems"
        :key="`${item.name}-${idx}`"
        :item="item"
      />
    </v-row>
  </div>
</template>

<script>
import ItemTile from "./ItemTile";
import { mapGetters } from "vuex";

export default {
  name: "RunewordsSearch",
  components: {
    ItemTile,
  },
  data: () => ({
    page: 1,
    formValues: {
      name: "",
      type: undefined,
      runes: [],
      socketMin: undefined,
      socketMax: undefined,
      selectedStats: [],
    },
    formControl: {
      sockets: [1, 2, 3, 4, 5, 6],
    },
  }),
  computed: {
    ...mapGetters("items", [
      "getBases",
      "getRwTypes",
      "getRunes",
      "getItemStats",
      "getRunewords",
    ]),
    calcSocketMax() {
      let socketMax = this.formControl.sockets;
      if (this.formValues.socketMin !== undefined) {
        socketMax = socketMax.slice(this.formValues.socketMin - 1);
      }
      return socketMax;
    },
    filteredItems() {
      let items = this.getRunewords;
      const {
        name,
        type,
        runes,
        socketMin,
        socketMax,
        selectedStats,
      } = this.formValues;
      items = items.filter((obj) =>
        obj.name.toLowerCase().includes(name.toLowerCase())
      );
      if (runes.length > 0) {
        items = items.filter((obj) => {
          for (let i = 0; i < runes.length; i++) {
            for (let j = 0; j < obj.props.rune_recipe.length; j++) {
              if (runes[i] === obj.props.rune_recipe[j]) {
                return obj;
              }
            }
          }
        });
      }

      if (type !== undefined) {
        let fixType = type;
        let isAllWeapon = false;
        let isMeleeWeapon = false;
        if (type === "1hswor" || type === "2hswor") {
          fixType = "swor";
        }
        if (type === "1haxe" || type === "2haxe") {
          fixType = "axe";
        }
        if (type === "h2h2") {
          fixType = "h2h";
        }
        if (type === "bow" || type === "xbow" || type === "abow") {
          fixType = "miss";
        }
        if (type === "aspe") {
          fixType = "spea";
        }
        if (type === "phlm" || type === "pelt" || type === "circ") {
          fixType = "helm";
        }
        if (type === "head") {
          fixType = "shie";
        }
        if (
          fixType !== "helm" &&
          fixType !== "shie" &&
          fixType !== "ashd" &&
          fixType !== "tors"
        ) {
          isAllWeapon = true;
          if (fixType !== "miss") {
            isMeleeWeapon = true;
          }
        }

        if (isAllWeapon && !isMeleeWeapon) {
          items = items.filter(
            (obj) => obj.bases.includes(fixType) || obj.bases.includes("weap")
          );
        } else if (isAllWeapon && isMeleeWeapon) {
          items = items.filter(
            (obj) =>
              obj.bases.includes(fixType) ||
              obj.bases.includes("mele") ||
              obj.bases.includes("weap")
          );
        } else {
          items = items.filter((obj) => obj.bases.includes(fixType));
        }
      }
      if (socketMin !== undefined) {
        items = items.filter(
          (obj) => obj.props.sock_req && obj.props.sock_req >= socketMin
        );
      }
      if (socketMax !== undefined) {
        items = items.filter(
          (obj) => obj.props.sock_req && obj.props.sock_req <= socketMax
        );
      }
      if (selectedStats.length > 0) {
        items = items.filter((obj) => {
          for (let i = 0; i < this.getSelectedStats.length; i++) {
            for (let j = 0; j < obj.stats.length; j++) {
              if (
                this.getSelectedStats[i].code === obj.stats[j].code &&
                this.getSelectedStats[i].skill === obj.stats[j].skill
              ) {
                return obj;
              }
            }
          }
        });
      }
      return items;
    },
    getSelectedStats() {
      return this.formValues.selectedStats.map((obj) => {
        return {
          code: obj.code,
          skill: obj.skill,
        };
      });
    },
    getCurrentPage: {
      get() {
        const itemCount = this.filteredItems.length;
        if (itemCount <= 50) {
          return 1;
        }
        if (Math.ceil(itemCount / 50) < this.page) {
          return Math.ceil(itemCount / 50);
        }
        return this.page;
      },
      set(val) {
        return (this.page = val);
      },
    },
    getPageTotal() {
      const itemCount = this.filteredItems.length;
      if (itemCount === 0) {
        return 1;
      }
      return itemCount % 50 !== 0 ? Math.ceil(itemCount / 50) : itemCount / 50;
    },
    paginateItems() {
      const num = this.getCurrentPage;
      const start = (num - 1) * 50;
      const end = num * 50;
      const items = this.filteredItems.slice(start, end);
      return items;
    },
    getMinSockVal() {
      return this.formValues.socketMin;
    },
  },
  watch: {
    getMinSockVal(val) {
      if (val > this.formValues.socketMax) {
        this.formValues.socketMax = val;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.Itempedia-filter-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  .Itempedia-filter-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    .Input-Wrapper {
      margin: 0.5rem;
      width: 100%;
      max-width: 330px;
    }
    .Sockets {
      width: 100%;
      max-width: 200px;
    }
    .Properties {
      width: 100%;
      max-width: 600px;
    }
  }
}
</style>
