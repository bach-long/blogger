import ky from "ky";

export const search = async (searchValue) => {
    try {
        const res = await ky.post('http://127.0.0.1:8000/api/search', {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
            json: {'searchValue': searchValue}
        }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}