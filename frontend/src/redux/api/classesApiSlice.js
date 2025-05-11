import { apiSlice } from "../api/apiSlice.js";
import { USERS_URL, CLASSES_URL,} from "../features/constants";

export const classApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        createClass: builder.mutation({
            query: (data) => ({
                url: `${CLASSES_URL}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Class"],
        }),

        makePayment: builder.mutation({
            query: (data) => ({
                url: `${CLASSES_URL}/addstudent`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Class"],
        }),

        getClasses : builder.query({
            query: () => ({
                url:`${CLASSES_URL}`,
            }),
            providesTags: ['Class'],
            keepUnusedDataFor: 5,
        }),

        getClassesByStream : builder.query({
            query: (stream) => ({
                url:`${CLASSES_URL}/getclassesofstream`,
            }),
            providesTags: ['Class'],
            keepUnusedDataFor: 5,
        }),


        getClassesNameId : builder.query({
            query: () => ({
                url:`${CLASSES_URL}/nameid`,
            }),
            providesTags: ['Class'],
            keepUnusedDataFor: 60,
        }),

        getClassesByTeacherId : builder.query({
            query: (id) => ({
                url:`${CLASSES_URL}/classesofteacher/${id}`,
            }),
            providesTags: ['Class'],
            keepUnusedDataFor: 60,
        }),

        getClassesByClassId : builder.query({
            query: (classes) => ({
                url:`${CLASSES_URL}/getclassesbyids`,
                method: "POST",
                body:classes
            }),
            providesTags: ['Class'],
            keepUnusedDataFor: 5,
        }),


        deleteClass:builder.mutation({
           query: classId => ({
            url: `${CLASSES_URL}/${classId}`,
            method: "DELETE",
           }), 
        }),  

        getClassDetails: builder.query({
            query: (id) => ({
                url: `${CLASSES_URL}/${id}`,
            }),
            keepUnusedDataFor:5,
        }),

        updateClass: builder.mutation({
            query: ({classId,body}) => ({
                url: `${CLASSES_URL}/${classId}`,
                method: "PUT",
                body: body,

            }),
            invalidatesTags: ["Class"],
        }),
       
    
    }),
});

export const { 
    useCreateClassMutation,
    useGetClassesQuery,
    useLazyGetClassesQuery,
    useDeleteClassMutation,
    useGetClassDetailsQuery,
    useUpdateClassMutation,
    useLazyGetClassDetailsQuery,
    useLazyGetClassesNameIdQuery,
    useLazyGetClassesByTeacherIdQuery,
    useMakePaymentMutation,
    useLazyGetClassesByStreamQuery,
    useLazyGetClassesByClassIdQuery
 } = classApiSlice;