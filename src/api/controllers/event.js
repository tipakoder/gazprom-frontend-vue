import axios from "../axios"

export const getMonthEvents = async (month, year) => {
    const response = await axios.get(`/event/getMonthEvents?month=${month}&year=${year}`);

    if (response.status === 200) {
        return response.data.monthEvents;
    } else {
        alert ("Ошибка получения мероприятий на месяц");
        return false;
    }
}

export const exportTable = async (eventId) => {
    const response = await axios.get(`/event/exportTable?eventId=${eventId}`, {responseType: "blob"});
    
    if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `event_${eventId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } else {
        console.log("Ошибка получения файла");
    }
}

export const importTable = async (file) => {
    const formData = new FormData();
    formData.append("table", file);

    const token = localStorage.getItem("token");
    const response = await axios.post("/event/importTable", formData, {headers: {"Authorization": token}});

    if (response.status === 200) {
        return true;
    } else {
        alert (response.data.message);
        return false;
    }
}
export const create = async (organizerName,time,dateId,eventMembers) => {
    const token = localStorage.getItem("token");
    const data = {
        organizerName,
        time,
        dateId,
        eventMembers
    }
    const response = await axios.post("/event/create", data, {headers: {"Authorization": token}});
    if (response.status === 200) {
        return true;
    } else {
        alert (response.data.message);
        return false;
    }
}