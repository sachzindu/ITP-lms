import cloudinary from 'cloudinary'
import fs from 'fs/promises'

import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Lmsclass from "../models/lmsclass.js"
import AppError from "../utils/error.util.js";

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
