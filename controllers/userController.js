import User from '../models/userModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js"
import AppError from "../utils/error.util.js";
import mongoose from 'mongoose';

const createUser = asyncHandler(async (req, res) => {
    const { username, email,alStream,alYear, password} = req.body;

    if(!username || !email || !password){
        throw new Error("Please fill all the inputs.");
    }

    const userExists = await User.findOne({email})
    if(userExists) res.status(400).send("User already exists.");

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({username, email,alStream,alYear, password: hashedPassword});
    try {
        await newUser.save();
        createToken(res, newUser._id);


        res.status(201).send({
            _id: newUser._id,
            username:newUser.username,
            email:newUser.email,
            role: newUser.role,
            profilePicture: newUser.profilePicture,
        });
    } catch (error) {
        res.status(400)
        throw new Error("Invalid user data")
        
    }
    
});

const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email})

    if(existingUser) {
        const isPasswordValid =await bcrypt.compare(password, existingUser.password)

        if(isPasswordValid) {
           createToken(res, existingUser._id) 
           
           res.status(201).send({
            _id: existingUser._id,
            username:existingUser.username,
            email:existingUser.email,
            role: existingUser.role,
            profilePicture: existingUser.profilePicture,

        });
        return;

        }
        else{
            res.status(400).send({
                message:"The credentials invalid"
            })
    }
};

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly:true,
        expires: new Date(0),
    })

    res.status(200).json({message: "Logged out successfully"});

});

const getAllUsers = asyncHandler(async (req, res) => {
    const users= await User.find({});
    res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
        })
    }else {
        res.status(404).json({message: "User not found"})
    }
});

const updateCurrentUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email ;
        user.profilePicture = req.body.profilePicture || user.profilePicture;

    

    if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
    }

    const updatedUser = await user.save()

    res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role:updatedUser.role,
        profilePicture: updatedUser.profilePicture,
    });

}else {
    res.status(404);
    throw new Error("User not found");
}
    

});

const deleteUserById = asyncHandler(async (req,res) => {
    const user = await User.findByIdAndDelete(req.params.id)

    if (user) {
        if (user.role === "admin") {
            res.status(400)
            throw new Error("You can't delete an admin") 
        }
        await User.deleteOne({_id:user._id})
        res.json({message: "User deleted successfully"})
        
    }else {
        res.status(404);
        throw new Error("User not found.");

    }
}); 

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password")

    if(user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserById = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.role = req.body.role|| user.role;
        user.profilePicture = req.body.profilePicture || user.profilePicture;


        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,

        });
    }else {
        res.status(404);
        throw new Error("User not found.");
    }
});

 const getTeacherNameId =asyncHandler(async (req, res, next)=>{
    try {
        const teachers = await User.find(
            {role:"instructor"}
          );
        
        res.status(200).json({
            success:true,
            message:'Teacher ids and names',
            teachers,
        })
        
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }

   
})

const addStudentToClass = asyncHandler(async (req, res, next) => {
    const { classId, userDetail } = req.body;
  
    if (!classId || !userDetail) {
      return res.status(400).json({ message: "classId and userDetail are required" });
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userDetail,
        { $addToSet: { enrolledClasses: new mongoose.Types.ObjectId(classId) } }, // avoids duplicates
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Class added to user", user: updatedUser });
    } catch (error) {
      next(error); // use next for asyncHandler to catch
    }
  });

 

const getEnrolledClassesByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId).select('enrolledClasses');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user.enrolledClasses);
});

const updateUserVerificationStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { isAccountVerified } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.isAccountVerified = isAccountVerified;
    await user.save();

    res.status(200).json({
        message: "User verification status updated successfully",
        isAccountVerified: user.isAccountVerified
    });
});

  

export { 
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById,
    getTeacherNameId,
    addStudentToClass,
    getEnrolledClassesByUserId,
    updateUserVerificationStatus

     };
