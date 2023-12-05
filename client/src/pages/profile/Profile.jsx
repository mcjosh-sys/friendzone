import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/comments/update/Update";

const Profile = () => {
  const {currentUser} = useContext(AuthContext)
  const [openUpdate, setOpenUpdate] = useState(false)
  const userId = parseInt(useLocation().pathname.split('/')[2])
  const queryClient = useQueryClient()
  const regex = /(https?:\/\/[^\s]+)/g

  const {isLoading, data: user} = useQuery({
    queryKey: ['user'],
    queryFn: () => makeRequest(`/users/find/${userId}`).then(res=>res.data)
  })

  const {data: followers} = useQuery({
    queryKey: ['follow'],
    queryFn: () => makeRequest(`/relationships?followedUserId=${userId}`).then(res=>res.data)
  })

  const mutation = useMutation({
    mutationKey: [`follow`],
    mutationFn: (following) => {
      if(following) return makeRequest.delete("/relationships?userId="+userId)
      return makeRequest.post("/relationships", {userId: userId})
    },
    onSuccess: () => queryClient.invalidateQueries(['user'])
  })

  const handleFollow = () => {
    mutation.mutate(followers.includes(currentUser.id))
  }

  const isProfilePicUrl = user && regex.test(user.profilePic)
  const isCoverPicUrl = user && regex.test(user.coverPic)
  return (
    <div className="profile">
      {isLoading ? "Loading..." : <>
      <div className="images">
        <img
          src={regex.test(user.coverPic) ? user.coverPic : "../uploads/"+user.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={isProfilePicUrl ? user.profilePic : "../uploads/"+user.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{user.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{user.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{user.website}</span>
              </div>
            </div>
            {userId===currentUser.id? <button onClick={()=>setOpenUpdate(true)}>Update</button>: 
            <button onClick={handleFollow}>{followers && followers.includes(currentUser.id) ? "Following" : "Follow"}</button>}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts userId={userId}/>
      {openUpdate && <Update props={{setOpenUpdate, coverPic: user.profilePic, profilePic: user.profilePic}} />}
      </div>
      </>}
    </div>
  );
};

export default Profile;
