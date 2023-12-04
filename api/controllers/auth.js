import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


import { db } from "../connect.js"

export const signup = (req, res) => {
    //check if user exists
    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        
        if(data.length) return res.status(409).json("User already exists!")

        //create a new user
            //has the password
            const salt = bcrypt.genSaltSync(10)
            const hasedPassword = bcrypt.hashSync(req.body.password,salt)
        
            const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)"

            const values = [req.body.username, req.body.email, hasedPassword, req.body.name]

            db.query(q,[values], (err, data) => {
                if(err) return res.status(500).json(error)
                return res.status(200).json("User created successfully!")
            })
    })

}

export const signin = (req, res) => {
    //check if user exists
    const q = "SELECT * FROM users WHERE username = ? OR email = ?"

    db.query(q, [req.body.username, req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        if(data.length === 0) return res.status(404).json("User not found")

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
        if(!checkPassword) return res.status(400).json("Invalid credentials!")

        const token = jwt.sign({id: data[0].id}, process.env.JWT_TOKEN)

        const {password, ...others} = data[0]

        res.cookie("accessToken",token, {httpOnly: true}).status(200).json(others)

    })
}

export const signout = (req, res) => {
    res.clearCookie("accessToken",{secure:true, sameSite:"none"}).status(200).json("User has be signed out successfully!")
}