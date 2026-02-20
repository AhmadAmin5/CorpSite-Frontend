import apiSlice from '../../api/apiSlice';

const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitContactQuery: builder.mutation({
      query: (contactData) => ({
        url: `/contact/public`,
        method: 'post',
        data: contactData,
      }),

      invalidatesTags: [{ type: 'ContactQueries', id: 'LIST' }],
    }),

    getContactQueries: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '' } = {}) => {
        const params = new URLSearchParams({ page, limit });

        if (search) params.append('search', search);
        if (status && status !== 'all') params.append('status', status);

        return {
          url: `/contact?${params.toString()}`,
          method: 'get',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.queries.map(({ _id }) => ({
                type: 'ContactQueries',
                id: _id,
              })),
              { type: 'ContactQueries', id: 'LIST' },
            ]
          : [{ type: 'ContactQueries', id: 'LIST' }],
    }),

    getContactQueryById: builder.query({
      query: (id) => ({
        url: `/contact/${id}`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'ContactQueries', id }],
    }),

    updateContactQuery: builder.mutation({
      query: ({ id, ...patchData }) => ({
        url: `/contact/${id}`,
        method: 'patch',
        data: patchData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ContactQueries', id },
        { type: 'ContactQueries', id: 'LIST' },
      ],
    }),

    deleteContactQuery: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: 'delete',
      }),
      invalidatesTags: [{ type: 'ContactQueries', id: 'LIST' }],
    }),
  }),
});

export const {
  useSubmitContactQueryMutation,
  useGetContactQueriesQuery,
  useGetContactQueryByIdQuery,
  useUpdateContactQueryMutation,
  useDeleteContactQueryMutation,
} = contactApi;

export default contactApi;
