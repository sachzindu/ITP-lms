import {Router} from 'express'

import { getAlllectures, getLecturesById, createLecture, updateLecture,removeLec, getLecsByClass } from '../controllers/lecture.controller.js';

import upload from '../middlewares/multer.middleware.js';

const router = Router();
/**
 * @route GET /courses
 * @description Get all courses
 * @access Public
 */
router.route('/')
    .get( 
        getAlllectures
    )
    .post(
            
            upload.fields([{name:"lecFile",maxCount:1},{name:"lecVideo",maxCount:1}]) ,
           createLecture
        );
/**
 * @route GET, PUT, DELETE /courses/:id
 * @description Get, update, or remove a course by ID
 * @access Admin only
 */

router.route('/getlecbyclass').post(getLecsByClass);
router.route('/:id')
 
    .put(
        upload.single() ,
       
        updateLecture
    )
    .delete(
        
        removeLec
    ).get(
        getLecturesById
    )



export default router;