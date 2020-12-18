import armorTypes from "../assets/json/armor_types.json";
import weaponTypes from "../assets/json/weapon_types.json";
import miscTypes from "../assets/json/misc_types.json";
import armorBases from "../assets/json/armor_bases.json";
import weaponBases from "../assets/json/weapon_bases.json";
import uniqueItems from "../assets/json/final_uniques.json";
import runewords from "../assets/json/all_runewords.json";
import runes from "../assets/json/runes.json";
import itemStats from "../assets/json/all_item_stats.json";
import mapStats from "../assets/json/map_stats.json";

export const state = () => ({
  current: {
    item: null,
  },
  stats: {
    itemStats: itemStats,
    mapStats: mapStats,
  },
  types: {
    armors: armorTypes,
    weapons: weaponTypes,
    misc: miscTypes,
  },
  bases: {
    armors: armorBases,
    weapons: weaponBases,
  },
  uniques: uniqueItems,
  runewords: runewords,
  runes: runes,
  tiers: [
    { name: "Normal", code: "norm" },
    { name: "Exceptional", code: "exc" },
    { name: "Elite", code: "elt" },
  ],
});

export const mutations = {
  currentItem(state, payload) {
    state.current = payload;
  },
};

export const actions = {
  setCurrent({ commit }, item) {
    commit("currentItem", item);
  },
};

export const getters = {
  getItemAndUp: (state) => {
    const item = state.current;
    const { tier, upgrade, rarity } = item.props;
    const allBases = [...state.bases.weapons, ...state.bases.armors];
    const baseTier = tier;
    let normal = null;
    let exceptional = null;
    let elite = null;
    if (tier === "norm") {
      normal = item;
      exceptional = allBases.find((obj) => obj.code === upgrade.code);
      elite = allBases.find(
        (obj) => obj.code === exceptional.props.upgrade.code
      );
      if (rarity !== "nmag") {
        exceptional = {
          ...item,
          base_name: exceptional.name,
          code: exceptional.code,
          damage: exceptional.damage,
          defense: exceptional.defense,
          props: {
            ...exceptional.props,
            rarity: rarity,
          },
        };
        elite = {
          ...item,
          base_name: elite.name,
          code: elite.code,
          damage: elite.damage,
          defense: elite.defense,
          props: {
            ...elite.props,
            rarity: rarity,
          },
        };
      }
    }
    if (tier === "exc") {
      exceptional = item;
      elite = allBases.find((obj) => obj.code === upgrade.code);
      if (rarity !== "nmag") {
        elite = {
          ...item,
          base_name: elite.name,
          code: elite.code,
          damage: elite.damage,
          defense: elite.defense,
          props: {
            ...elite.props,
            rarity: rarity,
          },
        };
      }
    }
    if (tier === "elt") {
      exceptional = { name: "old" };
      elite = item;
    }
    return {
      baseItem: item,
      baseTier,
      rarity,
      normal,
      exceptional,
      elite,
    };
  },
  getCurrentItem: (state) => {
    return state.current;
  },
  getTiers: (state) => {
    return state.tiers;
  },
  getUniques: (state) => {
    return state.uniques;
  },
  getRunewords: (state) => {
    return state.runewords;
  },
  getRunes: (state) => {
    return state.runes;
  },
  getItemStats: (state) => {
    return state.stats.itemStats;
  },
  getBases: (state) => {
    return [...state.bases.weapons, ...state.bases.armors];
  },
  getTypes: (state) => {
    const allTypes = [
      ...state.types.armors,
      ...state.types.weapons,
      ...state.types.misc,
    ].sort((a, b) => a.type_name.localeCompare(b.type_name));
    return allTypes.map((obj) => {
      return {
        name: obj.type_name,
        code: obj.type_code,
      };
    });
  },
  getRwTypes: (state) => {
    const allTypes = [...state.types.armors, ...state.types.weapons];
    const rwTypes = allTypes.filter(
      (obj) =>
        obj.type_code !== "tkni" &&
        obj.type_code !== "taxe" &&
        obj.type_code !== "jave" &&
        obj.type_code !== "ajav" &&
        obj.type_code !== "glov" &&
        obj.type_code !== "boot" &&
        obj.type_code !== "belt"
    );
    const sorted = rwTypes.sort((a, b) =>
      a.type_name.localeCompare(b.type_name)
    );
    return sorted.map((obj) => {
      return {
        name: obj.type_name,
        code: obj.type_code,
      };
    });
  },
};
