import axios from "../axios"

export const add = async(eventId, name) => {
    const token = localStorage.getItem("token");
    const data = {
        eventId,
        name
    }
    const response  = await axios.post("/eventMember/add", data, {headers: {"Authorization": token}});

    if (response.status === 200) {
        return true;
    } else {
        alert (response.data.message);
        return false;
    }
}

export const update = async(eventMemberId, name) => {
    const token = localStorage.getItem("token");
    const data = {
        eventMemberId,
        name
    }
    const response  = await axios.put("/eventMember/update", data, {headers: {"Authorization": token}});

    if (response.status === 200) {
        return true;
    } else {
        alert (response.data.message);
        return false;
    }
}

export const remove = async(eventMemberId) => {
    const token = localStorage.getItem("token");
    const response  = await axios.delete(`/eventMember/remove?eventMemberId=${eventMemberId}`, {headers: {"Authorization": token}});

    if (response.status === 200) {
        return true;
    } else {
        alert (response.data.message);
        return false;
    }
}