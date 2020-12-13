export const state = () => ({
  infoDrawer: {
    isOpen: false,
    current: null,
  },
});

export const mutations = {
  openDrawer(state, payload) {
    state.infoDrawer.isOpen = true;
    state.infoDrawer.current = {
      type: payload.type,
      data: payload.data,
    };
  },
  closeDrawer(state, payload) {
    state.infoDrawer.isOpen = payload;
  },
};
