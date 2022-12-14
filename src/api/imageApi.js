import ky from "ky";

export const upload = async (request) => {
    try {
        const res = await ky.post('http://127.0.0.1:8000/api/upload', {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
            body: request
        }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const deleteImage = async (id, name) => {
    try {
        const res = await ky.post('http://127.0.0.1:8000/api/image/delete', {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
            json: {'id': id, 'name': name}
        }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}