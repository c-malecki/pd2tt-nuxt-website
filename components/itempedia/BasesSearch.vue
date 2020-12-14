<template>
  <v-col>
    <div class="Itempedia-filter-container">
      <v-form>
        <v-container fluid>
          <v-row dense>
            <v-col xs="12" sm="12" md="6" lg="3" xl="3">
              <v-autocomplete
                v-model="formValues.type"
                :items="getTypes"
                label="Type"
                item-text="name"
                item-value="code"
                clearable
              />
            </v-col>
            <v-col xs="12" sm="12" md="6" lg="3" xl="3">
              <v-autocomplete
                v-model="formValues.tier"
                :items="formControl.tier"
                label="Tier"
                item-text="name"
                item-value="code"
                clearable
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col xs="12" sm="6" md="4" lg="2" xl="2">
              <v-autocomplete
                v-model="formValues.socketMin"
                :items="formControl.sockets"
                label="Sockets Min"
                clearable
              />
            </v-col>
            <v-col xs="12" sm="6" md="4" lg="2" xl="2">
              <v-autocomplete
                v-model="formValues.socketMax"
                :items="calcSocketMax"
                label="Sockets Max"
                clearable
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <v-pagination
      v-model="getCurrentPage"
      :length="getPageTotal"
    ></v-pagination>
    <v-row align="center" justify="center">
      <ItemTile v-for="item in paginateItems" :key="item.name" :item="item" />
    </v-row>
  </v-col>
</template>

<script>
import armorTypes from "../../assets/json/armor_types.json";
import weaponTypes from "../../assets/json/weapon_types.json";
import weaponBases from "../../assets/json/weapon_bases.json";
import armorBases from "../../assets/json/armor_bases.json";
import ItemTile from "./ItemTile";
const sortTypesAlpha = [...weaponTypes, ...armorTypes].sort((a, b) =>
  a.type_name.localeCompare(b.type_name)
);
export default {
  name: "BasesSearch",
  components: {
    ItemTile,
  },
  data: () => ({
    page: 1,
    allItems: [...weaponBases, ...armorBases],
    formValues: {
      type: undefined,
      tier: undefined,
      socketMin: undefined,
      socketMax: undefined,
    },
    formControl: {
      types: sortTypesAlpha,
      sockets: [1, 2, 3, 4, 5, 6],
      tier: [
        { name: "Normal", code: "norm" },
        { name: "Exceptional", code: "exc" },
        { name: "Elite", code: "elt" },
      ],
    },
  }),
  computed: {
    getTypes() {
      return this.formControl.types.map((obj) => {
        return {
          name: obj.type_name,
          code: obj.type_code,
        };
      });
    },
    calcSocketMax() {
      let socketMax = this.formControl.sockets;
      if (this.formValues.socketMin !== undefined) {
        socketMax = socketMax.slice(this.formValues.socketMin);
      }
      return socketMax;
    },
    filteredItems() {
      let items = this.allItems;
      const { type, tier, socketMin, socketMax } = this.formValues;
      if (type !== undefined) {
        items = items.filter((obj) => obj.type === type);
      }
      if (tier !== undefined) {
        items = items.filter((obj) => obj.props.tier === tier);
      }
      if (socketMin !== undefined) {
        items = items.filter(
          (obj) => obj.props.sockets && obj.props.sockets >= socketMin
        );
      }
      if (socketMax !== undefined) {
        items = items.filter(
          (obj) => obj.props.sockets && obj.props.sockets <= socketMax
        );
      }
      return items;
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
  },
};
</script>

<style lang="scss" scoped></style>
