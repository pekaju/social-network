import { getUserId } from "./getData"

export async function submitComment(comment, postId, commentImaage) {
    const url = window.location.protocol + "//" + window.location.hostname + ":3001/addComment"
    const userId = await getUserId();
    const body = {
        comment: comment,
        userId: userId,
        postId: postId,
        likes: 0
    }
    const formData = new FormData();
    formData.append("image", commentImaage)
    for (let [key, value] of Object.entries(body)) {
        formData.append(key, value)
    }
    const sendComment = async () => {
        await fetch(url, {
            method: "POST",
            body: formData
        })
    }
    await sendComment(comment)
}

export async function likePost(postId) {
    const url = window.location.protocol + "//" + window.location.hostname + ":3001/likePost"
    const userId = await getUserId();
    const body = {
        userId: userId,
        postId: postId
    }
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            },
        body: JSON.stringify(body)
    })
    .then(response => {
        if(response.ok) {
            return true
        } else {
            return false
        }
    })
}

export async function setNotificationRead(id) {
    const url = window.location.protocol + "//" + window.location.hostname + ":3001/notifications/read"
    const userId = await getUserId();
    const body = {
        "id": id,
    }
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            },
        body: JSON.stringify(body)
    })
    .then(response => {
        if(response.ok) {
            return true
        } else {
            return false
        }
    })
}