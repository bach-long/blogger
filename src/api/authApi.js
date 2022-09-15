import ky from "ky";

export const signup = async (request) => {
    try {
        const res = await ky.post('http://127.0.0.1:8000/api/auth/signup', {body: request}).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const signin = async (request) => {
    try {
        const res = await ky.post('http://127.0.0.1:8000/api/auth/login', {body: request}).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}