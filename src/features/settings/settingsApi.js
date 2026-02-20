import apiSlice from '../../api/apiSlice';

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => ({
        url: '/setting',
        method: 'get',
      }),
      providesTags: ['Settings'],
    }),

    updateSetting: builder.mutation({
      query: (data) => ({
        url: '/setting',
        method: 'patch',
        data,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingMutation } = settingsApi;

export default settingsApi;
