import './update.scss'
import { useRef, useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { makeRequest } from '../../../axios'

const Update = ({props}) => {
    const [texts, setTexts] = useState({
        name: '',
        city: '',
        website: ''
    })
    const [cover, setCover] = useState()
    const [profile, setProfile] = useState()
    const profileRef = useRef();
    const coverRef = useRef()

    const setOpenUpdate = props.setOpenUpdate
    const handleChange = (e) => {
        setTexts(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    const queryClient = useQueryClient()
    
    const upload = async (file) => {
        try {
          const formData = new FormData()
          formData.append("file",file)
          const res = await makeRequest.post("/upload", formData)
          return res.data
        } catch (error) {
          console.log(error)
        }
      }

    const mutation = useMutation({
        mutationKey: ['user'],
        mutationFn: ({profileUrl, coverUrl}) => makeRequest.put('/users',{...texts, profilePic: profileUrl, coverPic: coverUrl}),
        onSuccess: () => queryClient.invalidateQueries(['user'])
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        let profileUrl = props.profilePic
        let coverUrl = props.coverPic

        coverUrl = cover ? await upload(cover): coverUrl
        profileUrl = profile ? await upload(profile): profileUrl
        console.log(coverUrl)
        mutation.mutate({profileUrl,coverUrl})
        setOpenUpdate(false)
    }

  return (
    <div className='update'>
        <button className='closeBtn' onClick={()=>setOpenUpdate(false)}>X</button>
        <form>
          <div className='img-container'>
            <div className='profile-container' onClick={()=>profileRef.current.click()}>
              {profile ? <img src={URL.createObjectURL(profile)} alt='' className='profile' /> : <><p>+ Profile picture</p></> }
              <input type='file'  className='file' onChange={(e)=>setProfile(e.target.files[0])} ref={profileRef}/>
            </div>
            <div className="cover-container" onClick={()=>coverRef.current.click()}>
              {cover ? <img src={URL.createObjectURL(cover)} alt='' className='cover' /> : <><p>+ Cover picture</p></>}
              <input type='file' className='file'  onChange={(e)=>setCover(e.target.files[0])} ref={coverRef}/>
            </div>
          </div>
            <input type='text' placeholder='Name' name='name' onChange={handleChange} value={texts.name}/>
            <input type='text' placeholder='City' name='city' onChange={handleChange} value={texts.city}/>
            <input type='text' placeholder='Website' name='website' onChange={handleChange} value={texts.website}/>
            <button onClick={handleSubmit}>Update</button>
        </form>
    </div>
  )
}

export default Update