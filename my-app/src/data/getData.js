export async function getUserData(userId) {
    const myId = await getUserId()
    let url = window.location.protocol + "//" + window.location.hostname + ":3001/getUser?userId=" + userId + "&myId=" + myId
    let data = await fetch(url, {
     method: "GET"
    })
    .then(response => response.json())
    .catch(error => console.log('error', error));
    if(data["error"] == "no user found") {
      url = window.location.protocol + "//" + window.location.hostname + ":3001/groupData?groupId=" + userId
      data = await fetch(url, {
       method: "GET"
      })
      .then(response => response.json())
      .catch(error => console.log('error', error));
      console.log(data)
    }
    return data
}

export async function getUserId() {
    let elements = document.cookie.split('=')
    let value = elements[1]
    const url = window.location.protocol + "//" + window.location.hostname + ":3001/getUserId?value="+value
    let data = await fetch(url, {
      method: "GET"
    })
    .then(response => response.json())
    .catch(error => console.log("error: ", error))
    return data
}

export async function getPosts(filter, id) {
    
    const url = window.location.protocol + "//" + window.location.hostname + ":3001/posts"
    let data = await fetch(url, {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"filter": filter, "id": id}),
    })
    .then(response => response.json())
    .catch(error => console.log('error', error));

    return data
}

export async function searchInputHandler(url, body) {
    try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
    
        if (response.ok) {
         const response2 = await response.json()
            return response2 == null ? [] : response2
        }else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.log("Error:", error);
        throw error;
      }
}

export async function getGroupData(groupId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/groups"
  let groups = await fetch(url, {
    method: "GET"
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  const userId = await getUserId()
  const userGroups = await sendRequest("userGroups", "POST", JSON.stringify({"userID": userId}) )

  let data = groups.filter(e => e.group_id === groupId)
  let groupData = data[0]
  const checkIfUserFollowsGroup = userGroups.filter(e => e.group_id === groupData.group_id)
  if (checkIfUserFollowsGroup.length > 0) {
    groupData.userFollows = true
  } else {
    groupData.userFollows = false
  }
  return groupData
}

export async function unfollowGroup(groupId) {
  const userId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/groups/unfollow"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"userID": userId, "groupID": groupId}),
  })
  .then(response => (!response.ok && console.log("ERROR")))
  .catch(error => console.log('error', error));
}

export async function getMessagesData(userId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/getLastMessages?userId=" + userId
    let data = await fetch(url, {
     method: "GET"
    })
    .then(response => response.json())
    .catch(error => console.log('error', error));
    return data
}

export async function getLastGroupMsgData(userId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/getLastGroupMessages?userId=" + userId
  let data = await fetch(url, {
   method: "GET"
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));
  return data
}

export async function getSingleChatData(otherUserId, myUserId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/getSingleChatData?myUserId=" + myUserId + "&otherUserId=" + otherUserId
  let data = await fetch(url, {
   method: "GET"
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));
  return data
} 

export async function sendGroupInvites(userIds, groupId) {
  const fromId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/sendGroupInvite"
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "userIds": userIds,
      "groupId": groupId,
      "fromId": fromId
  }),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

}

export async function followUser(followedId) {
  const userId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/user/follow"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"followerID": userId, "followedID": followedId}),
  })
  .then(response => (!response.ok && console.log("ERROR")))
  .catch(error => console.log('error', error));
}

export async function followRequestUser(followedId) {
  const userId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/followRequest"
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"followerID": userId, "followedID": followedId}),
  })
  .then(response => (!response.ok && console.log("ERROR")))
  .catch(error => console.log('error', error));
}

export async function acceptGroupInviteHandler(sender, groupId) {
  const userId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/acceptGroupInvitation"
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"inviterId": sender, "inviteeId": userId, "groupId": groupId}),
  })
  .then(response => (!response.ok && console.log("ERROR")))
  .catch(error => console.log('error', error));
}
export async function deleteGroupInviteHandler(sender, groupId) {
  const userId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/deleteGroupInvitation"
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"inviterId": sender, "inviteeId": userId, "groupId": groupId}),
  })
  .then(response => (!response.ok && console.log("ERROR")))
  .catch(error => console.log('error', error));
}

export async function acceptFollowRequest(sender) {
  const userId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/acceptFollowRequest"
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"followerID": sender, "followedID": userId}),
  })
  .then(response => (!response.ok && console.log("ERROR")))
  .catch(error => console.log('error', error));
}

export async function deleteFollowRequest(sender) {
  const userId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/deleteFollowRequest"
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"followerID": sender, "followedID": userId}),
  })
  .then(response => (!response.ok && console.log("ERROR")))
  .catch(error => console.log('error', error));
}

export async function unfollowUser(followedId) {
  const userId = await getUserId()
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/user/unfollow"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"followerID": userId, "followedID": followedId}),
  })
  .then(response => (!response.ok && console.log("ERROR")))
  .catch(error => console.log('error', error));
}

export async function checkIfUserIsFollowed(followedUserId) {
  const userId = await getUserId()
  const userFollowings = await sendRequest("userFollowings", "POST", JSON.stringify({"userID": userId}))
  
  let data = userFollowings.filter(e => e.Id === followedUserId)
  if (data.length === 0) {
    return false
  } else {
    return true
  }
}

export async function getGroupFollowers(groupId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/groupFollowers"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"groupID": groupId}),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function getIsRequestSent(userId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/isGroupRequestSent"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"userId": userId}),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function sendGroupRequest(userId, groupId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/sendGroupRequest"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "userId": userId,
      "groupId": groupId
    }),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function acceptGroupRequestHandler(userId, groupId){
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/acceptGroupRequest"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "userId": userId,
      "groupId": groupId
    }),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function deleteGroupHandler(groupId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/deleteGroup"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "groupId": groupId
    }),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function createEvent(title, desc, date, groupId, creator) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/createEvent"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "title": title,
      "desc": desc,
      "date": date,
      "groupId": groupId,
      "creator": creator
    }),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));
  return data
}

export async function getEvents(groupId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/getEvents"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "groupID": groupId
    }),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));
  return data
}

export async function deleteGroupRequestHandler(userId, groupId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/deleteGroupRequest"
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "userId": userId,
      "groupId": groupId
    }),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function postLikedByUser(postId) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/likedByUser"
  const userId = await getUserId();
  const body = {
      userId: userId,
      postId: postId
  }
  let data = await fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          },
      body: JSON.stringify(body)
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function getNotifications() {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/notifications"
  const userId  = await getUserId()
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"userID": userId}),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function getUnreadNotificationsCount() {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/notifications/unreadCount"
  const userId  = await getUserId()
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"userID": userId}),
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function handlePublicStatusChange(status) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/changePublicStatus"
  const userId  = await getUserId()
  const body = JSON.stringify({
    userId: userId,
    status: status
  })
  let data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}

export async function sendRequest(urlEnding, method, body) {
  const url = window.location.protocol + "//" + window.location.hostname + ":3001/" + urlEnding
  let data = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
  .then(response => response.json())
  .catch(error => console.log('error', error));

  return data
}