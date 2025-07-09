import { apiSlice } from "../api/apiSlice.js";
import {USERS_URL } from "../features/constants";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        createUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        addStudentToClass: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/addstudenttoclass`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        
        
        login:builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: "POST",
                body: data,
            }),
        }),

        logout:builder.mutation({
            query: () =>({
                url: `${USERS_URL}/logout`,
                method:`POST`,
            }),
        }),

        register:builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body:data,
            })

        }),

        profile:builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body:data,
            })
        }),

        getUsers : builder.query({
            query: () => ({
                url:USERS_URL,
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5,
        }),

        deleteUser:builder.mutation({
           query: userId => ({
            url: `${USERS_URL}/${userId}`,
            method: "DELETE",
           }), 
        }),

        getUserDetails: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
            }),
            keepUnusedDataFor:5,
        }),

         getTeachersNameId : builder.query({
                    query: () => ({
                        url:`${USERS_URL}/teacheridname`,
                    }),
                    providesTags: ['User'],
                    keepUnusedDataFor: 60,
                }),

        updateUser: builder.mutation({
            query: data => ({
                url: `${USERS_URL}/${data.userId}`,
                method: "PUT",
                body: data,

            }),
            invalidatesTags: ["User"],
        }),

        getEnrolledClassesByUserId : builder.query({
            query: (id) => ({
                url:`${USERS_URL}/getenrolledclassesbyuserid/${id}`,
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 60,
        }),

          updateUserVerificationStatus: builder.mutation({
            query: ({ userId, isAccountVerified }) => ({
                url: `/api/users/${userId}/verification`,
                method: 'PATCH',
                body: { isAccountVerified }
            }),
            invalidatesTags: ['User']
        }),

        // ✅ New: Verify Email Mutation
         verifyEmail: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/verifyEmail`,
                method: "POST",
                body: data,
            }),
        }),

        // ✅ New: Resend OTP Mutation
        resendOtp: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/resendOtp`,
                method: "POST",
                body: data,
            }),
    })
    }),
});

export const { 
    useCreateUserMutation,
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
    useLazyGetTeachersNameIdQuery,
    useLazyGetUserDetailsQuery,
    useAddStudentToClassMutation,
    useLazyGetEnrolledClassesByUserIdQuery,
     useUpdateUserVerificationStatusMutation,
    useVerifyEmailMutation,    // ✅ Exported
    useResendOtpMutation
 } = userApiSlice;