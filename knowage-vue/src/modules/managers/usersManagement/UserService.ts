import { iUser } from './UsersManagement';
import store from '@/App.store';
import axios from 'axios'


export default class UserService {
    constructor(t: any) {
        this.$t = t;
    }

    API_URL = process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/";
    HEADERS = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    $t: any;

    async insert(user: iUser) {
        const response = await axios.post<iUser>(this.API_URL + "users", user, this.HEADERS);

        if (response.status == 201) {
            if (response.data) {
                store.commit("setInfo", {
                    title: this.$t("managers.usersManagement.info.createTitle"),
                    msg: this.$t("managers.usersManagement.info.createMessage"),
                });
                return true;
            }
        } else {
            return false;
        }
    }

    async update(user: iUser) {
        const response = await axios.put<iUser>(this.API_URL + "users/" + user.id,
            user, this.HEADERS
        );

        if (response.status == 201) {
            if (response.data) {
                store.commit("setInfo", {
                    title: this.$t("managers.usersManagement.info.updateTitle"),
                    msg: this.$t("managers.usersManagement.info.updateMessage"),
                });
                return true;
            }
        } else {
            return false;
        }
    }

    async delete(id: number) {
        const response = await axios.delete(this.API_URL + "users/" + id);

        if (response.status == 200) {
            if (response.data) {
                store.commit("setInfo", {
                    title: this.$t("managers.usersManagement.info.deleteTitle"),
                    msg: this.$t("managers.usersManagement.info.deleteMessage"),
                });
                return true;
            }
        } else {
            return false;
        }
    }

}
