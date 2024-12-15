import jwt from "jsonwebtoken"

export const authMiddleware = async (req , res, next)  => {

  try {

    const token = req.cookies.token

    if(!token) {

        return res.status(400).json({
            message:"invalid token",
            success:false
        })
    }

    const decodedUser = await jwt.verify(token,process.env.JWT_SECRET_KEY)

    if(!decodedUser) {
        return res.status(400).json({
            message:"user not found ",
            success:false
        })
    }

    req._id = decodedUser._id

    console.log(req._id);

    next()
    

  } catch (error) {

    return res.status(400).json({
        message:"error in auth middleware",
        error:error.message
    })
    
  }
    
}