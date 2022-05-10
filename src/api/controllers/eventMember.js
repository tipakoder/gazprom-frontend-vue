import axios from "../axios"

export const update = async(eventMemberId,name) =>{
    const data={
        eventMemberId,
        name
    }
    const response  = await axios.put("/eventMember/update",data)
    if (response.status === 200) {
        return true;
    } else {
        alert (response.data.message);
        return false;
    }
}