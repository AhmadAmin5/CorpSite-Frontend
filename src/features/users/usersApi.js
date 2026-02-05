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
      query: ({
        page = 1,
        limit = 10,
        search = '',
        role = '',
        status = '',
      }) => {
        const params = new URLSearchParams({
          page,
          limit,
        });

        if (search) params.append('search', search);
        if (role && role !== 'all') params.append('role', role);
        if (status && status !== 'all') params.append('status', status);

        return {
          url: `/user?${params.toString()}`,
          method: 'get',
        };
      },
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
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: 'patch',
        data: data, 
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
