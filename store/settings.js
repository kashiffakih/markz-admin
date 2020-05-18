export const state = () => ({
  baseColor: 'blue',
  baseHeight: "50px",
  darkStatus: true,
  organization: {
    value: '',
    text: '',
    time_zone: '',
    logo_path: ''
  },
  // mediaUrl: 'https://api.vishwjeet.aaibuzz.com/storage/',
  // baseUrl: 'https://api.vishwjeet.aaibuzz.com/api',
  mediaUrl: 'http://localhost:8080/storage/',
  baseUrl: 'http://localhost:8080/api',
})

export const getters = {
  baseColor(state) {
    return state.baseColor;
  },
  baseHeight(state) {
    return state.baseHeight;
  },
  darkStatus(state) {
    return state.darkStatus;
  },
  organization(state) {
    return state.organization;
  },
  mediaUrl(state) {
    return state.mediaUrl;
  },
  baseUrl(state) {
    return state.baseUrl;
  },
}

export const mutations = {
  SET_ORGANIZATION(state, organization) {
    state.organization = organization
  }
}

export const actions = {
  setOrganization({commit}, organization) {
    commit('SET_ORGANIZATION', organization);
  }
}