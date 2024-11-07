import axios from "axios";

export default axios.create({
    baseURL: "https://youtube-clone-pi-peach.vercel.app/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})