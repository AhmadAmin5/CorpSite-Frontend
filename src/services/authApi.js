import apiSlice from './apiSlice';

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: '/user/register',
        method: 'post',
        data: body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/user/login',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Me', 'Auth'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/user/logout',
        method: 'post',
      }),
      invalidatesTags: ['Me', 'Auth'],
    }),

    me: builder.query({
      query: () => ({
        url: '/user/profile',
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
