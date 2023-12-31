import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post, userId }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const regex = /(https?:\/\/[^\s]+)/g
  const regex2 = /(https?:\/\/[^\s]+)/g
  const isProfilePicUrl = regex.test(post.profilePic)
  const isImgUrl = regex2.test(post.img)

  const {currentUser} = useContext(AuthContext)

  const queryClient =  useQueryClient()

  const {isLoading, error, data: likes} = useQuery({
    queryKey: ['likes',post.id],
    queryFn: () => makeRequest(`/likes?postId=${post.id}`).then(res=>res.data)
  })

  const {data: comments} = useQuery({
    queryKey: ['comments', post.id],
    queryFn: async () => {
      return await makeRequest.get("/comments?postId="+post.id).then(res => res.data)
    }
  })

  const mutation = useMutation({
    mutationKey: [`likes`, post.id],
    mutationFn: (liked) => {
      if(liked) return makeRequest.delete("/likes?postId="+post.id)
      return makeRequest.post("/likes", {postId: post.id})
    },
    onSuccess: () => queryClient.invalidateQueries(['likes'])
  })

  const handleLikes = () => {
    mutation.mutate(likes.includes(currentUser.id))
  }


  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={isProfilePicUrl ? post.profilePic : userId ? "../uploads/"+post.profilePic: "./uploads/"+post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={isImgUrl ? post.img : userId ? "../uploads/"+post.img: "./uploads/"+post.img} alt="" onDoubleClick={handleLikes}/>
        </div>
        <div className="info">
          <div className="item">
            {likes && likes.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{color: "red"}} onClick={handleLikes}/> : <FavoriteBorderOutlinedIcon onClick={handleLikes}/>}
            {likes && likes.length}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {comments && comments.length}
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id}/>}
      </div>
    </div>
  );
};

export default Post;
