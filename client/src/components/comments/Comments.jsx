import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import moment from "moment";

import {makeRequest} from "../../axios"
import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";


const Comments = ({postId}) => {
  const [desc, setDec] = useState("")
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient()

  const {isLoading, error, data: comments} = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      return await makeRequest.get("/comments?postId="+postId).then(res => res.data)
    }
  })

  const mutation = useMutation({
    mutationKey: ['comments'],
    mutationFn: async (newComment) => {
      await makeRequest.post("/comments",newComment)
    },
    onSuccess: () => queryClient.invalidateQueries('comments')
  })

  const handlecClick = () => {
    mutation.mutate({desc,postId})
    setDec("")
  }
  
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" onChange={(e)=>setDec(e.target.value)} value={desc}/>
        <button onClick={handlecClick}>Send</button>
      </div>
      {isLoading? "Loading..." : comments.map((comment) => (
        <div className="comment">
          <img src={comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
