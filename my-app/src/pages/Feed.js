import React, { useState, useEffect } from "react";
import { getUserId } from "../data/getData";
import FeedList from "../components/feedComponents/FeedList";

export default function Feed() {

  const [userId, setUserId] = useState(0)

  useEffect(() => {
    async function getUserIdHandler() {
      await getUserId().then(d => setUserId(d))
    }
    getUserIdHandler()
  }, [])

  return (
    <FeedList filter={"userFeed"} type={"1"} id={userId}/>
  );
}
