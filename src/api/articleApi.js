import ky from "ky";

export const getAllArticles = async (page) => {
    try {
        const res = await ky.get('http://127.0.0.1:8000/api/article/all', {
            searchParams: {page}
        }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getMostViewed = async () => {
    try {
        const res = await ky.get('http://127.0.0.1:8000/api/article/mostviewed').json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getRecentArticles = async () => {
    try {
        const res = await ky.get('http://127.0.0.1:8000/api/article/recent').json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getArticleOfCategory = async (id, page) => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/category/${id}/articles`, {
            searchParams: {page}
        }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getById = async (articleId) => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/article/${articleId}`,{headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        ).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getRelated = async (id) => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/article/related/${id}`).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const create = async (request) => {
    try {
        const res = await ky.post('http://127.0.0.1:8000/api/article/create', {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}, body: request}).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const editArticle = async (request) => {
    try {
        const res = await ky.post('http://127.0.0.1:8000/api/article/edit', {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}, 
            body: request}).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getComments = async (articleId) => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/article/${articleId}/comments`).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}