import cloudinary from 'cloudinary'
import fs from 'fs/promises'

import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Lm from "../models/lmsassignment.js"
import AppError from "../utils/error.util.js";

/**
 * @GET_ALL_ASSIGNMENTS
 * Fetches all courses excluding lectures.
 */
export const getAllAssignments = asyncHandler(async (req, res, next)=>{
    try {
        const assignments = await Lm.find({}).select('-lectures');
        res.status(200).json({
            success:true,
            message:'All assignments',
            assignments,
        })
        
    } catch (error) {
        return next(
            new AppError(e.message,500)
        )
    }
      
});
/**
 * @GET_ASSIGNMENT_BY_ID
 * Fetches a specific lecture.
 */
export const getAssignmentById = asyncHandler(async (req, res, next)=>{
    try {
        const {id} = req.params;

        const assi = await  Lm.findById(id);

        if(!assi){
            return next(
                new AppError(e.message,500)
            )
        }

        res.status(200).json({
            success:true,
            message:'assignments fetched sucesssfully ',
            
        })
        
        
    } catch (error) {
        return next(
            new AppError(e.message,500)
        )
    }
});
/**
 * @CREATE_A_ASSIGNMENT
 * Creates a new assignment and optionally uploads a thumbnail image.
 */
export const createAssignment = asyncHandler(async (req, res, next) => {
    const { title, description, alclass, createdBy,alyear, alstream } = req.body;
    if (!title || !description || !alclass || !createdBy ||!alyear ||!alstream) {
        return next(
            new AppError('All fields are required ', 400)
        );
    }

    const assi = await Lm.create({
        title,
        description,
        createdBy,
        alyear,alclass,alyear,
        
        lecDocument: {
            public_id: 'Dummy',
            secure_url: 'Dummy'
        },
        
    });

    if (!assi) {
        return next(
            new AppError('Class could not be created, please try again ', 500)
        );
    }

   

    if (req.files) {
        try {
            const lecFile11=req.files.lecFile[0];
            console.log(lecFile11);
    

    if(lecFile11){
        try {
            const result = await cloudinary.v2.uploader.upload(lecFile11.path,{
                folder:'lms', resource_type: lecFile11.mimetype === 'application/pdf' ? "raw" : undefined 
            });
            if(result){
               
                assi.lecDocument.public_id = result.public_id;
                assi.lecDocument.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${   lecFile11.filename}`);
        }catch (error) {
            return next(
                new AppError(error.message, 500)
            )
        }}

 await assi.save();

            res.status(200).json({
                success: true,
                message: "Assignment created successfully",
                assi
            });
        } catch (error) {
            return next(new AppError(error.message, 500));
        }
    } else {
        // Handle the case where no files were uploaded
        res.status(200).json({
            success: true,
            message: "Assignment successfully (no files uploaded)",
            assi
        });
    }
});
/**
 * @UPDATE_ASSIGNMENT_BY_ID
 * Updates an existing course by ID.
 */
export const updateAssignment = asyncHandler(async (req, res, next)=>{
    try {
        const {id}= req.params;

    const assi =  await Lm.findByIdAndUpdate(
        id,
        {
            $set:req.body
        },
        {
            runValidators: true
        }
    )   
    if(!assi){
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
 * @DELETE_ASSIGNMENT_BY_ID
 * Deletes a Lec by its id
 */
export const removeAssignment = asyncHandler(async (req, res, next)=>{
    try {
        const {id }= req.params;
        const lec = await  Lm.findById(id);
        if(!lec){
            return next (
                new AppError("Assignment with given id does not exist", 500)
            ) 
        }
        
        await Lm.findByIdAndDelete(id);

        res.status(200).json({
            success:true,
            message:'Assignment Removed sucesssfully ',
        })
        
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
});
