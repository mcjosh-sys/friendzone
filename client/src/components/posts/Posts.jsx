import {useQuery} from "@tanstack/react-query"

import Post from "../post/Post";
import "./posts.scss";
import { makeRequest } from "../../axios";

const Posts = ({userId}) => {
  
  const {isLoading, error, data:posts} = useQuery({
    queryKey: ['posts'],
    queryFn: () => makeRequest.get(userId ? "/posts?userId="+userId : "/posts").then(res => res.data)
  })
  //console.log(posts)
  return <div className="posts">
    {error ? "Something went wrong!" : isLoading ? "Loading..." : posts.map(post=>(
      <Post post={post} userId={userId} key={post.id}/>
    ))}
  </div>;
};

export default Posts;
