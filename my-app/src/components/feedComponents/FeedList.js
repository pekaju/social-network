import React, { useState, useEffect } from "react";
import Post from "./Post";
import AddPost from "./AddPost";
import { getPosts } from "../../data/getData";
import useWindowDimensions from "../useWindowDimensions";
import SinglePost from "./SinglePost.js";

export default function FeedList({filter, type, id}) {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [refreshId, setRefreshId] = useState(0);
  const [displayPost, setDisplayPost] = useState([false, {}]);

  const feedWidth = 700;


  useEffect(() => {
    console.log(id)
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, id, refreshId]);

  useEffect(() => {
    function generateRows() {
      let r = [];
      for (let i = 0; i < data.length; i++) {
        r.push(<Post key={i + "-" + refreshId} data={data[i]} setDisplayPost={setDisplayPost} refresh={refresh}/>);
      }
      setRows(r);
    }
    generateRows();
  }, [data]);

  async function getData() {
    await getPosts(filter, id).then((d) => {
      d.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      setData(d);
    });
  }

  function refresh() {
    setRefreshId(refreshId + 1);
  }
  return (
    <div
      style={{
        width: feedWidth,
        overflow: "hidden",
        width:"100%",
      }}
    >
      <AddPost refresh={refresh} type={type} targetId={id} />
      {rows}
      {displayPost[0] === true && <SinglePost filter={filter} data={displayPost[1]} setDisplayPost={setDisplayPost} refresh={refresh} />}
      <div style={{ minHeight: 30 }}></div>
    </div>
  );
}
