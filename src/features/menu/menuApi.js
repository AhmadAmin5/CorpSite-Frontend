import apiSlice from '../../api/apiSlice';

export const menuApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenus: builder.query({
      query: () => ({
        url: '/menu',
        method: 'get',
      }),
      providesTags: ['Menus'],
    }),

    getMenuBySlug: builder.query({
      query: (slug) => ({
        url: `/menu/public/${slug}`,
        method: 'get',
      }),
      providesTags: (result, error, slug) => [{ type: 'Menus', id: slug }],
    }),

    createMenu: builder.mutation({
      query: (data) => ({
        url: '/menu',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Menus'],
    }),

    updateMenu: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/menu/${id}`,
        method: 'patch',
        data,
      }),
      invalidatesTags: ['Menus'],
    }),

    deleteMenu: builder.mutation({
      query: (id) => ({
        url: `/menu/${id}`,
        method: 'delete',
      }),
      invalidatesTags: ['Menus'],
    }),
  }),
});

export const {
  useGetMenusQuery,
  useGetMenuBySlugQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = menuApi;
