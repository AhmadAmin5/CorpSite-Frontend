import apiSlice from '../../api/apiSlice';

const mediaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMedia: builder.query({
      query: ({ page = 1, limit = 12 } = {}) => ({
        url: `/media?page=${page}&limit=${limit}`,
        method: 'get',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.media.map(({ _id }) => ({
                type: 'Media',
                id: _id,
              })),
              { type: 'Media', id: 'LIST' },
            ]
          : [{ type: 'Media', id: 'LIST' }],
    }),

    uploadMedia: builder.mutation({
      query: (formData) => ({
        url: '/media',
        method: 'post',
        data: formData,
      }),
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),

    deleteMedia: builder.mutation({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'delete',
      }),
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMediaQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;

export default mediaApi;
