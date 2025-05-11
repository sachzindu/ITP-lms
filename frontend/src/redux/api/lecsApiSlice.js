 import { apiSlice } from "../api/apiSlice.js";
 import { LECS_URL,} from "../features/constants";
 
 export const lecsApiSlice = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
 
         createLec: builder.mutation({
             query: (data) => ({
                 url: `${LECS_URL}`,
                 method: "POST",
                 body: data,
             }),
             invalidatesTags: ["Lec"],
         }),

         getLecByClass: builder.mutation({
            query: (data) => ({
                url: `${LECS_URL}/getlecbyclass`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Lec"],
        }),
 
         getLecs : builder.query({
             query: () => ({
                 url:`${LECS_URL}`,
             }),
             providesTags: ['Lec'],
             keepUnusedDataFor: 5,
         }),
 
         deleteLec:builder.mutation({
            query: lecId => ({
             url: `${LECS_URL}/${lecId}`,
             method: "DELETE",
            }), 
         }),  
 
         getLecDetails: builder.query({
             query: (id) => ({
                 url: `${LECS_URL}/${id}`,
             }),
             keepUnusedDataFor:5,
         }),
 
         updateLec: builder.mutation({
             query: ({id,body}) => ({
                 url: `${LECS_URL}/${id}`,
                 method: "PUT",
                 body: body,
 
             }),
             invalidatesTags: ["Lec"],
         }),
     }),
 });
 
 export const { 
    useCreateLecMutation,
    useGetLecsQuery,
    useGetLecDetailsQuery,
    useDeleteLecMutation,
    useUpdateLecMutation,
    useLazyGetLecsQuery,
    useLazyGetLecDetailsQuery,
    useGetLecByClassMutation

    
    

     
  } = lecsApiSlice;