import userModule from './store';
import {createStore} from 'vuex';
 
const store = createStore({
    modules:{
        users: userModule
    }
});
 
export default store;