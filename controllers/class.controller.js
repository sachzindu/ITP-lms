import cloudinary from 'cloudinary'
import fs from 'fs/promises'

import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Lmsclass from "../models/lmsclass.js"
import AppError from "../utils/error.util.js";
import payment from "../payments/payments.js"

import joi from 'joi';

/**
 * @GET_ALL_COURSES
 * Fetches all courses excluding lectures.
 */
export const getAllCourse = asyncHandler(async (req, res, next)=>{
    try {
        const courses = await Lmsclass.find({}).select('-lectures');
        res.status(200).json({
            success:true,
            message:'All classes',
            data:courses
        })
        
    } catch (error) {
        return next(
            new AppError(e.message,500)
        )
    }
      
});
/**
 * @GET_LECTURES_BY_COURSE_ID
 * Fetches lectures for a specific course.
 */
export const getLecturesByCourseId = asyncHandler(async (req, res, next)=>{
    try {
        const {id} = req.params;

        const course = await  Lmsclass.findById(id);

        if(!course){
            return next(
                new AppError(e.message,500)
            )
        }

        res.status(200).json({
            success:true,
            message:'Class lectures fecthed sucesssfully ',
            lectures:course.lectures,
        })
        
        
    } catch (error) {
        return next(
            new AppError(e.message,500)
        )
    }
});

export const getClassNameId =asyncHandler(async (req, res, next)=>{
    try {
        const lec = await Lmsclass.find({}).select('_id title');
        console.log(lec);
        res.status(200).json({
            success:true,
            message:'class ids and names',
            lec,
        })
        
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }

   
})



/**
 * @CREATE_COURSE
 * Creates a new course and optionally uploads a thumbnail image.
 */
export const createCourse = asyncHandler(async (req, res, next)=>{
    const {title, description , teacher, createdBy,alyear,alstream}= req.body;
    if(!title||! description ||! teacher||!createdBy || !alyear){
        return next(
            new AppError('Alll fields are required ', 400)
        )
    }
    
    const course = await Lmsclass.create({
        title,
        description,
        teacher,
        alyear,
        alstream,
        createdBy,
        thumbnail:{
            public_id:'Dummy',
            secure_url:'Dummy'
        },
    });

    if(!course){
        return next(
            new AppError('Class could not created please try again  ', 500)
        )
    }
    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms'
            });
            if(result){
                course.thumbnail.public_id=result.public_id;
                course.thumbnail.secure_url=result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);
        }catch (error) {
            return next(
                new AppError(error.message, 500)
            )
        }
        await course.save();
        
        res.status(200).json({
            success:true,
            message:'Course created sucesssfully ',
            course,
        })
   
    } 
    
});
/**
 * @UPDATE_COURSE_BY_ID
 * Updates an existing course by ID.
 */
export const updateCourse = asyncHandler(async (req, res, next)=>{






    
    try {
        const {id}= req.params;

    const course =  await Lmsclass.findByIdAndUpdate(
        id,
        {
            $set:req.body
        },
        {
            runValidators: true
        }
    )   
    if(!course){
        return next (
            new AppError("Class with given id does not exist", 500)
        ) 
    }

    
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }

    
    res.status(200).json({
        success:true,
        message:'Class Updated sucesssfully ',
    })
});
/**
 * @DELETE_COURSE_BY_ID
 * Deletes a class by its id
 */
export const removeCourse = asyncHandler(async (req, res, next)=>{
    try {
        const {id }= req.params;
        const course = await  Lmsclass.findById(id);
        if(!course){
            return next (
                new AppError("Class with given id does not exist", 500)
            ) 
        }
        
        await Lmsclass.findByIdAndDelete(id);

        res.status(200).json({
            success:true,
            message:'Class Removed sucesssfully ',
        })
        
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
});

export const getClassesByTeacherId =asyncHandler(async (req, res, next)=>{
    const {id}=req.params;
    try {
        const classes = await Lmsclass.find({ teacher: id });
        console.log(classes);
        res.status(200).json({
            success:true,
            message:'classes of teacher',
            classes,
        })
        
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }

   
})

function validateCard(data) {
    const cardSchema = joi.object({
        number: joi.string().pattern(/^[0-9]{13,19}$/).required()
            .messages({
                'string.pattern.base': 'Card number must be between 13 and 19 digits'
            }),
        cvc: joi.string().pattern(/^[0-9]{3,4}$/).required()
            .messages({
                'string.pattern.base': 'CVC must be 3 or 4 digits'
            }),
        exp_month: joi.string().pattern(/^(0[1-9]|1[0-2])$/).required()
            .messages({
                'string.pattern.base': 'Expiration month must be between 01 and 12'
            }),
        exp_year: joi.string().pattern(/^[0-9]{2}$/).required()
            .messages({
                'string.pattern.base': 'Expiration year must be 2 digits'
            }),
        amount: joi.number().positive().required()
            .messages({
                'number.base': 'Amount must be a number',
                'number.positive': 'Amount must be positive'
            })
    });
    
    return cardSchema.validate(data);
}



export const addStudent=asyncHandler(
    async (req, res, next) => {
        const { number, amount, cvc, exp_month, exp_year } = req.body;
        const { error: validationError } = validateCard(req.body);
        
        try {
            // Check for validation error
            if (validationError) {
                const error = new Error(validationError.details[0].message);
                error.statusCode = 400;
                throw error;
            }
    
            const result = await payment(number, cvc, exp_month, exp_year, amount);
            
            // Check if payment was successful
            if (!result) {
                const error = new Error("Payment processing failed");
                error.statusCode = 500;
                throw error;
            }
            
            console.log(result);
            res.status(200).json({ message: "Success", paymentId: result.id });
            
        } catch (error) {
            next(error);
        }
    }
)

export const getClassesByStream =asyncHandler(async (req, res, next)=>{
    const stream=req.body;
    console.log(stream);
    try {
        const classes = await Lmsclass.find(
            {alstream:stream}
          );
        
        res.status(200).json({
            success:true,
            message:'Classes by stream',
            classes,
        })
        
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }

   
})

export const getClassesByIds = asyncHandler(async (req, res) => {
    const classIds = req.body // expecting an array of IDs in the request body

    if (!Array.isArray(classIds) || classIds.length == 0) {
      
        console.log("Classes can't be empty");
        res.status(400);
    }

    const classes = await Lmsclass.find({ _id: { $in: classIds } });

    res.json(classes);
});

