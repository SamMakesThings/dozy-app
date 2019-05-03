import { action, observable } from "mobx"

class FbUserStore {
    @observable user = null;

    @action setUser (userData) {
        this.user = userData;
    }
}

export default FbUserStore;