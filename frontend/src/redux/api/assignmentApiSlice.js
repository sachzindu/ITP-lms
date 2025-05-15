 import { apiSlice } from "../api/apiSlice.js";
 import { ASSIGNMENT_URL} from "../features/constants";
 
 export const assignmentApiSlice = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
 
         createAssignment: builder.mutation({
             query: (data) => ({
                 url: `${ASSIGNMENT_URL}`,
                 method: "POST",
                 body: data,
             }),
             invalidatesTags: ["Assignment"],
         }),
 
         getAssignments : builder.query({
             query: () => ({
                 url:`${ASSIGNMENT_URL}`,
             }),
             providesTags: ['Assignment'],
             keepUnusedDataFor: 5,
         }),
 
         deleteAssignment:builder.mutation({
            query: asId => ({
             url: `${ASSIGNMENT_URL}/${asId}`,
             method: "DELETE",
            }), 
         }),  
 
         getAssignmentDetails: builder.query({
             query: (id) => ({
                 url: `${ASSIGNMENT_URL}/${id}`,
             }),
             keepUnusedDataFor:5,
         }),

         getAssignmentsByClassId: builder.query({
            query: (id) => ({
                url: `${ASSIGNMENT_URL}/asbyclassid/${id}`,
            }),
            keepUnusedDataFor:60,
        }),
 
         updateAssignment: builder.mutation({
             query: ({id,body}) => ({
                 url: `${ASSIGNMENT_URL}/${id}`,
                 method: "PUT",
                 body: body,
 
             }),
             invalidatesTags: ["Assignment"],
         }),
     }),
 });
 
 export const { 
   useGetAssignmentDetailsQuery,
   useCreateAssignmentMutation,
   useDeleteAssignmentMutation,
   useUpdateAssignmentMutation,
   useGetAssignmentsQuery,
   useLazyGetAssignmentsQuery,
   useLazyGetAssignmentDetailsQuery,
   useLazyGetAssignmentsByClassIdQuery

     
  } = assignmentApiSlice;