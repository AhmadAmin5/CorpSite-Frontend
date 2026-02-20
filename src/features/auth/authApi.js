import apiSlice from '../../api/apiSlice';

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Me', 'Auth'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'post',
      }),
      invalidatesTags: ['Me', 'Auth'],
    }),

    activateAccount: builder.mutation({
      query: (data) => ({
        url: '/auth/activate-account',
        method: 'post',
        data,
      }),
    }),

    me: builder.query({
      query: () => ({
        url: '/auth/me',
        method: 'get',
      }),
      providesTags: ['Me'],
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: '/auth/update',
        method: 'patch',
        data: formData,
      }),
      invalidatesTags: (result) => [
        'Me',
        { type: 'Users', id: result?.data?._id },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useActivateAccountMutation,
  useUpdateProfileMutation,
} = authApi;

export default authApi;
