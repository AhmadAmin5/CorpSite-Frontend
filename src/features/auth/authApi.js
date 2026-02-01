import apiSlice from '../../api/apiSlice';

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;

export default authApi;
