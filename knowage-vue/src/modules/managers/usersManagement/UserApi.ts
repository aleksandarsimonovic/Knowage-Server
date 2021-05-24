import { iUser } from './UsersManagement';
import UsersService from './UserService';
import store from '@/App.store';

const userService = new UsersService();

export async function insertUser($t : any, user: any) {
    const response = await userService.insert(user);

    if (response.status == 201) {
        if (response.data) {
            store.commit("setInfo", {
                title: $t("managers.usersManagement.info.createTitle"),
                msg: $t("managers.usersManagement.info.createMessage"),
            });
            return true;
        }
    } else {
        return false;
    }
}

export async function updateUser($t : any, user: iUser, userID: number) {
    const response = await userService.update(userID, user);

    if (response.status == 201) {
        if (response.data) {
            store.commit("setInfo", {
                title: $t("managers.usersManagement.info.updateTitle"),
                msg: $t("managers.usersManagement.info.updateMessage"),
            });
            return true;
        }
    } else {
        return false;
    }
}

export async function deleteUserById($t : any, id: number) {
    const response = await userService.delete(id);

    if (response.status == 200) {
        if (response.data) {
            store.commit("setInfo", {
                title: $t("managers.usersManagement.info.deleteTitle"),
                msg: $t("managers.usersManagement.info.deleteMessage"),
            });
            return true;
        }
    } else {
        return false;
    }
}