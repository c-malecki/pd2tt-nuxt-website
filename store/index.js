export const state = () => ({
  drawer: {
    isOpen: false,
    type: null,
  },
});

export const mutations = {
  openDrawer(state, payload) {
    // "item", ...
    state.drawer.type = payload;
    state.drawer.isOpen = true;
  },
  closeDrawer(state, payload) {
    state.drawer.isOpen = payload;
  },
};
