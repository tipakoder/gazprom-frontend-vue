import axios from "../axios";

export const login = async (login, password) => {
    const response = await axios.post("/account/login", {login, password});

    if (response.status === 200) {
        return response.data;
    }

    alert (response.data.message);
}

export const get = async (token) => {
    const response = await axios.get("/account/get", {headers: {"Authorization": token}});

    if (response.status === 200) {
        return response.data;
    }

    alert (response.data.message);
}