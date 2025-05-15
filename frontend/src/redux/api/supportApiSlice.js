 import { apiSlice } from "../api/apiSlice.js";
 import { SUPPORT_URL} from "../features/constants";
 
 export const supportApiSlice = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
 
         createTicket: builder.mutation({
             query: (data) => ({
                 url: `${SUPPORT_URL}`,
                 method: "POST",
                 body: data,
             }),
             invalidatesTags: ["Support"],
         }),
 
         getTickets : builder.query({
             query: () => ({
                 url:`${SUPPORT_URL}`,
             }),
             providesTags: ['Support'],
             keepUnusedDataFor: 5,
         }),
 
         deleteTicket:builder.mutation({
            query: asId => ({
             url: `${SUPPORT_URL}/${asId}`,
             method: "DELETE",
            }), 
         }),  
 
         getTicketDetails: builder.query({
             query: (id) => ({
                 url: `${SUPPORT_URL}/${id}`,
             }),
             keepUnusedDataFor:5,
         }),
 
         updateTicket: builder.mutation({
             query: ({id,data}) => ({
                 url: `${SUPPORT_URL}/${id}`,
                 method: "PUT",
                 body: data,
 
             }),
             invalidatesTags: ["Support"],
         }),
     }),
 });
 
 export const { 
useCreateTicketMutation,
useLazyGetTicketsQuery,
useDeleteTicketMutation,
useLazyGetTicketDetailsQuery,
useUpdateTicketMutation

     
  } = supportApiSlice;