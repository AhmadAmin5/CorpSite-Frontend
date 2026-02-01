import apiSlice from '../../api/apiSlice';

const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = '',
        status = '',
        category = '',
      }) => {
        let queryString = `/post?page=${page}&limit=${limit}`;
        if (search) queryString += `&search=${search}`;
        if (status && status !== 'all') queryString += `&status=${status}`;
        if (category && category !== 'all')
          queryString += `&category=${category}`;
        return {
          url: queryString,
          method: 'get',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.posts.map(({ _id }) => ({
                type: 'Posts',
                id: _id,
              })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),

    getPost: builder.query({
      query: (id) => ({
        url: `/post/${id}`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),

    createPost: builder.mutation({
      query: (postData) => ({
        url: `/post`,
        method: 'post',
        data: postData,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),

    updatePost: builder.mutation({
      query: ({ id, ...patchData }) => ({
        url: `/post/${id}`,
        method: 'patch',
        data: patchData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Posts', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/${id}`,
        method: 'delete',
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;

export default postsApi;
