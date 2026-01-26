import apiSlice from './apiSlice';

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: '/users/register',
        method: 'post',
        data: body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/users/login',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Me', 'Auth'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'post',
      }),
      invalidatesTags: ['Me', 'Auth'],
    }),

    me: builder.query({
      query: () => ({
        url: '/users/profile',
        method: 'get',
      }),
      providesTags: ['Me'],
    }),
  }),
});

export default authApi;

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;
