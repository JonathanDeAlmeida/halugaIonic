const state = () => ({
  user: null
});

const getters = {};
 
const actions = {
  getUser(context, params) {
    context.commit('setUser', params)    
  }
};
 
const mutations = {
  setUser(state, data) {
    state.user = data
  }
};
 
export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}