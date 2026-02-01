import apiSlice from '../../api/apiSlice';

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    getUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user?page=${page}&limit=${limit}`,
        method: 'get',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ _id }) => ({
                type: 'Users',
                id: _id,
              })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    inviteUser: builder.mutation({
      query: (userData) => ({
        url: `/user`,
        method: 'post',
        data: userData,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...patchData }) => ({
        url: `/user/${id}`,
        method: 'patch',
        data: patchData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'delete',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useInviteUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;

export default usersApi;
