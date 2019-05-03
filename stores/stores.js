// import { FbUserStore } from './fbUserStores';
import { action, observable } from "mobx"

class FbUserStore {
    @observable user = null;

    @action setUser (userData) {
        this.user = userData;
    }
}

const fbUserStore = new FbUserStore();

export {
  FbUserStore
}

export default {
  fbUserStore
}