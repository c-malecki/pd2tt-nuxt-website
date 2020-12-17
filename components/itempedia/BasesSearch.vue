<template>
  <div>
    <div class="Itempedia-filter-container">
      <div class="Itempedia-filter-row">
        <div class="Input-Wrapper">
          <v-autocomplete
            v-model="formValues.type"
            :items="getTypes"
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
            v-model="formValues.tier"
            :items="getTiers"
            label="Tier"
            item-text="name"
            item-value="code"
            clearable
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
            label="Sockets Min"
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
            label="Sockets Max"
            clearable
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
      <ItemTile v-for="item in paginateItems" :key="item.name" :item="item" />
    </v-row>
  </div>
</template>

<script>
import ItemTile from "./ItemTile";
import { mapGetters } from "vuex";

export default {
  name: "BasesSearch",
  components: {
    ItemTile,
  },
  data: () => ({
    page: 1,
    formValues: {
      type: undefined,
      tier: undefined,
      socketMin: undefined,
      socketMax: undefined,
    },
    formControl: {
      sockets: [1, 2, 3, 4, 5, 6],
    },
  }),
  computed: {
    ...mapGetters("items", ["getBases", "getTypes", "getTiers"]),
    calcSocketMax() {
      let socketMax = this.formControl.sockets;
      if (this.formValues.socketMin !== undefined) {
        socketMax = socketMax.slice(this.formValues.socketMin - 1);
      }
      return socketMax;
    },
    filteredItems() {
      let items = this.getBases;
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
  }
}
</style>
