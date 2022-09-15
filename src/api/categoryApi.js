import ky from "ky";

export const getAllCategories = async () => {
    try {
        const res = await ky.get('http://127.0.0.1:8000/api/category/all').json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}