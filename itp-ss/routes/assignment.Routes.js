import {Router} from 'express'

import { getAllAssignments, getAssignmentById, createAssignment, updateAssignment,removeAssignment, getAssignmentsByClassId } from '../controllers/assignment.controller.js';

import upload from '../middlewares/multer.middleware.js';

const router = Router();
/**
 * @route GET /assignments
 * @description Get all assignments
 * @access Public
 */
router.route('/')
    .get( 
        getAllAssignments
    )
    .post(
            
            upload.fields([{name:"lecFile",maxCount:1}]) ,
           createAssignment
        );
/**
 * @route GET, PUT, DELETE /courses/:id
 * @description Get, update, or remove a assignment by ID
 * 
 */
router.route('/asbyclassid/:id').get(getAssignmentsByClassId);
router.route('/:id')
 
    .put(
        upload.single() ,
       
        updateAssignment
    )
    .delete(
        
        removeAssignment
    ).get(
        getAssignmentById
    )



export default router;