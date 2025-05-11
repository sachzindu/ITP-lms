import {Router} from 'express'

import { getAllCourse, createCourse, updateCourse, removeCourse ,getClassNameId, getClassesByTeacherId, getClassesByStream, getClassesByIds} from '../controllers/class.controller.js';

import upload from '../middlewares/multer.middleware.js';
import stripepayment from '../payments/stripepayment.js';


const router = Router();
/**
 * @route GET /courses
 * @description Get all courses
 * @access Public
 */
router.route('/')
    .get( 
        getAllCourse
    )
    .post(
            
            upload.single('thumbnail'), 
           createCourse
        );
/**
 * @route GET, PUT, DELETE /courses/:id
 * @description Get, update, or remove a course by ID
 * @access Admin only
 * 
 */

router.route('/nameid').get(getClassNameId);
router.route('/addstudent').post(stripepayment);
router.route('/getclassesbyids').post(getClassesByIds);
router.route('/getclassesofstream').get(getClassesByStream);

router.route('/classesofteacher/:id').get(getClassesByTeacherId);
router.route('/:id')
 
    .put(
        upload.single('thumbnail'),
       
        updateCourse
    )
    .delete(
        
        removeCourse
    );





export default router;