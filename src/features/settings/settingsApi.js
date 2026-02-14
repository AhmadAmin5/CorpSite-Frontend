import apiSlice from '../../api/apiSlice';

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all settings (returns mapped object { key: value })
    getSettings: builder.query({
      query: () => ({
        url: '/setting',
        method: 'get',
      }),
      providesTags: ['Settings'],
    }),

    // Update or Create a setting
    updateSetting: builder.mutation({
      query: (data) => ({
        url: '/setting',
        method: 'patch', // Using PATCH to match the "update" nature
        data, // Expects { key, value, group? }
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingMutation } = settingsApi;

export default settingsApi;
