import {model , Schema} from "mongoose";

/**
 * @courseSchema - Mongoose schema for Class.
 * This schema defines the structure and validation rules for class data, including title, description, category, thumbnail, lectures, and metadata.
 */

const classSchema = new Schema({
    title:{
        type:String,
        required:[true, "Title is required" ],
        minLength:[8, "Title must be atleast 8 characters"],
        maxLength:[60,"Title should be less than 60 characters"],
        trim:true
    },
    description:{
        type: String,
        required:[true, "Description is required" ],
        minLength:[8, "Description must be atleast 8 characters"],
        maxLength:[200,"Description should be less than 200 characters"],
        trim:true
    },
    teacher:{
        type:String,
        required:[true, "Teacher is required" ],
    },
    alyear:{
        type:String,
        required:[true, "Al year is required" ],
    },

    alstream:{
        type:String,required:true

    },
    thumbnail:{
        public_id:{
            type:String,
            required:true,
        },
        secure_url:{
            type:String,
            required:true,
        }
    },
    
    createdBy:{
        type:String,
        required:true,
    }

},{
    timestamps:true
})

const Lmsclass = model('Lmsclass', classSchema);

export default Lmsclass;