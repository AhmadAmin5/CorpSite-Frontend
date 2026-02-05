import apiSlice from '../../api/apiSlice';

const pagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPages: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '' } = {}) => {
        const params = new URLSearchParams({
          page,
          limit,
        });

        if (search) params.append('search', search);
        if (status && status !== 'all') params.append('status', status);

        return {
          url: `/page?${params.toString()}`,
          method: 'get',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.pages.map(({ _id }) => ({
                type: 'Pages',
                id: _id,
              })),
              { type: 'Pages', id: 'LIST' },
            ]
          : [{ type: 'Pages', id: 'LIST' }],
    }),

    getPage: builder.query({
      query: (id) => ({ url: `/page/${id}`, method: 'get' }),
      providesTags: (result, error, id) => [{ type: 'Pages', id }],
    }),

    createPage: builder.mutation({
      query: (pageData) => ({
        url: `/page`,
        method: 'post',
        data: pageData,
      }),
      invalidatesTags: [{ type: 'Pages', id: 'LIST' }],
    }),

    updatePage: builder.mutation({
      query: ({ id, ...patchData }) => ({
        url: `/page/${id}`,
        method: 'patch',
        data: patchData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Pages', id },
        { type: 'Pages', id: 'LIST' },
      ],
    }),

    deletePage: builder.mutation({
      query: (id) => ({
        url: `/page/${id}`,
        method: 'delete',
      }),
      invalidatesTags: [{ type: 'Pages', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pagesApi;

export default pagesApi;