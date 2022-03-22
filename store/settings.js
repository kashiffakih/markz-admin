export const state = () => ({
  baseColor: 'blue',
  baseHeight: "50px",
  darkStatus: true,
  organization: {
    value: '',
    text: '',
    time_zone: '',
    logo_path: '',
  },
  city: {
    id: '',
    name: '',
  },
  mediaUrl: 'http://api.venkon.aaibuzz.com/storage/',
  baseUrl: 'http://api.venkon.aaibuzz.com/api',
  // mediaUrl: 'http://localhost:8080/storage/',
  // baseUrl: 'http://localhost:8080/api',

  // mediaUrl: 'http://192.168.29.9:8080/storage/',
  // baseUrl: 'http://192.168.29.9:8080/api',
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
  city(state) {
    return state.city;
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
  },
  SET_CITY(state, city) {
    state.city = city;
  }
}

export const actions = {
  setOrganization({commit}, organization) {
    commit('SET_ORGANIZATION', organization);
  },
  setCity({commit}, city) {
    commit('SET_CITY', city);
  }
}