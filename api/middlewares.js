import jwt from 'jsonwebtoken'
export const authenticateUser = (req,res,next) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("Unauthorized - Missing token!")

    try {
        const userInfo = jwt.verify(token, process.env.JWT_TOKEN)
        req.userInfo = userInfo
        next()
    } catch (error) {
        res.status(401).json({message: 'Unauthorized - Invalid token!'})
    }

}