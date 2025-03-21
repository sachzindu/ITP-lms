import cloudinary from 'cloudinary'
import fs from 'fs/promises'

import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Lm from "../models/lmslecture.js"
import AppError from "../utils/error.util.js";

/**
 * @GET_ALL_LECTURES
 * Fetches all lectures excluding lectures.
 */
export const getAlllectures = asyncHandler(async (req, res, next)=>{
    try {
        const lec = await Lm.find({}).select('-lectures');
        res.status(200).json({
            success:true,
            message:'All lectures',
            lec,
        })
        
    } catch (error) {
        return next(
            new AppError(e.message,500)
        )
    }
      
});
/**
 * @GET_LECTURES_BY_ID
 * Fetches a specific lecture.
 */
export const getLecturesById = asyncHandler(async (req, res, next)=>{
    try {
        const {id} = req.params;

        const lec = await  Lm.findById(id);

        if(!course){
            return next(
                new AppError(e.message,500)
            )
        }

        res.status(200).json({
            success:true,
            message:'lectures fetched sucesssfully ',
            
        })
        
        
    } catch (error) {
        return next(
            new AppError(e.message,500)
        )
    }
});
/**
 * @CREATE_LECTURE
 * Creates a new lecture and optionally uploads a thumbnail image.
 */
export const createLecture = asyncHandler(async (req, res, next) => {
    const { title, description, alclass, createdBy,month,week } = req.body;
    if (!title || !description || !alclass || !createdBy ||!week ||!month) {
        return next(
            new AppError('All fields are required ', 400)
        );
    }

    const lec = await Lm.create({
        title,
        description,
        alclass,
        createdBy,
        week,
        month,
        lecDocument: {
            public_id: 'Dummy',
            secure_url: 'Dummy'
        },
        lecVideo: {
            public_id: 'Dummy',
            secure_url: 'Dummy'
        }
    });

    if (!lec) {
        return next(
            new AppError('Lecture record could not be created, please try again ', 500)
        );
    }

   

    if (req.files) {
        try {
            const lecFile11=req.files.lecFile[0];
            console.log(lecFile11);
    const lecVideo11=req.files.lecVideo[0];

    if(lecFile11){
        try {
            const result = await cloudinary.v2.uploader.upload(lecFile11.path,{
                folder:'lms', resource_type: lecFile11.mimetype === 'application/pdf' ? "raw" : undefined 
            });
            if(result){
               
                lec.lecDocument.public_id = result.public_id;
                lec.lecDocument.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${   lecFile11.filename}`);
        }catch (error) {
            return next(
                new AppError(error.message, 500)
            )
        }}

if(lecVideo11){
        try {
            const result = await cloudinary.v2.uploader.upload(lecVideo11.path,{
                folder:'lms',resource_type: "video"
            });
            if(result){
               
                lec.lecVideo.public_id = result.public_id;
                lec.lecVideo.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${lecVideo11.filename}`);
        }catch (error) {
            return next(
                new AppError(error.message, 500)
            )
        }}

            await lec.save();

            res.status(200).json({
                success: true,
                message: "Lec created successfully",
                lec
            });
        } catch (error) {
            return next(new AppError(error.message, 500));
        }
    } else {
        // Handle the case where no files were uploaded
        res.status(200).json({
            success: true,
            message: "Lec created successfully (no files uploaded)",
            lec
        });
    }
});
/**
 * @UPDATE_LECTURE_BY_ID
 * Updates an existing course by ID.
 */
export const updateLecture = asyncHandler(async (req, res, next)=>{
    try {
        const {id}= req.params;

    const lec =  await Lm.findByIdAndUpdate(
        id,
        {
            $set:req.body
        },
        {
            runValidators: true
        }
    )   
    if(!lec){
        return next (
            new AppError("Lec with given id does not exist", 500)
        ) 
    }

    
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }

    
    res.status(200).json({
        success:true,
        message:'Lec Updated sucesssfully ',
    })
});
/**
 * @DELETE_LEC_BY_ID
 * Deletes a Lec by its id
 */
export const removeLec = asyncHandler(async (req, res, next)=>{
    try {
        const {id }= req.params;
        const lec = await  Lm.findById(id);
        if(!lec){
            return next (
                new AppError("Lec with given id does not exist", 500)
            ) 
        }
        
        await Lm.findByIdAndDelete(id);

        res.status(200).json({
            success:true,
            message:'Lec Removed sucesssfully ',
        })
        
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
});
