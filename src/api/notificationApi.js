import ky from "ky";

export const notify = async (receiverId, type, articleId) => {
    try {
        const res = await ky.post(`http://127.0.0.1:8000/api/notification/send`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
            json: {'receiverId': receiverId, 'type': type, 'articleId': articleId}
        }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getAll = async () => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/notification/all`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}