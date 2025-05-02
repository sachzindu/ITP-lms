import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    alStream: {
        type: String,
        required: true,
        default:null
    },
    alYear: {
        type: Number,
        required: true,
        default:null
    },
    enrolledClasses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lmsclass"
    }],
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student"
    },
    profilePicture: {
        type: String,
        default: "default-profile.png"
    },
    password:{
        type:String,
        required:true
    },
    verifyOtp: {
        type: String,
        default:''
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default:''
    },
 
}, {timestamps:true}
);

const User = mongoose.model('User', userSchema);

export default User;