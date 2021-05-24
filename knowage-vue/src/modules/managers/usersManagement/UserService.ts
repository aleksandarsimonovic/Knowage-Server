import { iUser } from './UsersManagement';
import axios from 'axios'


export default class UserService {
    
    API_URL = process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/";
    HEADERS = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    async insert(user: iUser) {
        return await axios.post<iUser[]>(this.API_URL + "users", JSON.stringify(user), this.HEADERS);
    }

    async update(id: number, user: iUser) {
        return await axios.put<iUser[]>(this.API_URL + "users/" + id,
            JSON.stringify(user), this.HEADERS
        );
    }

    async delete(id: number) {
        return await axios.delete(this.API_URL + "users/" + id);
    }

}