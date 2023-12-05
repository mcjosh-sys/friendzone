import jwt from 'jsonwebtoken'
import moment from 'moment'
import {db} from "../connect.js"

export const getComments = (req, res) => {
    const q = "SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c \
        JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createdAt DESC"
    
    db.query(q,[req.query.postId], (err,data)=>{

        if(err) return res.status(500).json(err)
        return res.status(200).json(data)

        })

}

export const addComment = (req, res) => {
    const q = "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?) "

    const values = [
        req.body.desc,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        req.userInfo.id,
        req.body.postId
    ]

    db.query(q,[values], (err,data)=>{
        if(err) return res.status(500).json(err)
        return res.status(200).json("Comment has been created")
        })
}