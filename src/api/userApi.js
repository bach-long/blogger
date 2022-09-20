import ky from "ky";

export const getArticlesOfUser = async (userId, page) => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/user/${userId}/articles`, {
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

export const getInfo = async (userId) => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/user/${userId}/info`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        }).json();
        console.log(res);
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getBookmark = async (userId, page) => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/user/${userId}/bookmark`, {
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

export const getStatistic = async (userId) => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/user/${userId}/statistic`).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const bookmarkHandle = async (userId, articleId) => {
    try {
        const res = await ky.post(`http://127.0.0.1:8000/api/bookmark`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
            json: {'userId' : userId, 'articleId': articleId}
        }).json();
        console.log(res);
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const followHandle = async (userId, followingId) => {
    try {
        const res = await ky.post(`http://127.0.0.1:8000/api/follow`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
            json: {'userId' : userId, 'followingId': followingId}
        }).json();
        console.log(res);
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const reactHandle = async (articleId, value) => {
    try {
        const res = await ky.post(`http://127.0.0.1:8000/api/react`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
            json: {'articleId': articleId, 'value': value}
        }).json();
        console.log(res);
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const me = async () => {
    try {
        const res = await ky.get(`http://127.0.0.1:8000/api/me`,{headers: 
        {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const logout = async () => {
    try {
        const res = await ky.post(`http://127.0.0.1:8000/api/logout`,{headers: 
        {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        }).json();
        localStorage.clear();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const editProfile = async (request) => {
    try {
        const res = await ky.post(`http://127.0.0.1:8000/api/user/edit`,{headers: 
        {'Authorization': `Bearer ${localStorage.getItem('token')}`}, 
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

export const createComment = async (articleId, content, parentId, replyId) => {
    try {
        const res = await ky.post(`http://127.0.0.1:8000/api/comment`,{headers: 
        {'Authorization': `Bearer ${localStorage.getItem('token')}`}, 
        json: {'articleId': articleId, 'parentId': parentId, 'replyId' : replyId, 'content': content }
        }).json();
        console.log(res)
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const editComment = async (commentId, content) => {
    try {
        const res = await ky.post(`http://127.0.0.1:8000/api/comment/edit`,{headers: 
        {'Authorization': `Bearer ${localStorage.getItem('token')}`}, 
        json: {'id': commentId, 'content': content}
        }).json();
        console.log(res)
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}