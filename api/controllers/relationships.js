import {db} from "../connect.js"
import jwt from "jsonwebtoken"

export const getRelationship = (req, res) => {
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId=?"

    db.query(q, [req.query.followedUserId], (err, data) =>{
        if (err) return res.status(500).json(err)
        return res.status(200).json(data.map(follower => follower.followerUserId))
    })
}

export const addRelationship = (req, res) => {

    const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?) "

    const values = [
        req.userInfo.id,
        req.body.userId
    ]

    db.query(q,[values], (err,data)=>{
        if(err) return res.status(500).json(err)
        return res.status(200).json("Following")
        })

}

export const deleteRelationship = (req, res) => {

    const q = "DELETE FROM relationships WHERE followerUserId=? AND followedUserId=?"

    const values = [
        req.userInfo.id,
        req.query.userId
    ]

    db.query(q,[...values], (err,data)=>{
        if(err) return res.status(500).json(err)
        return res.status(200).json("Not following")
        })

}