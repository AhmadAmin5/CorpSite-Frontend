import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../api/axiosBaseQuery';

const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});

export default apiSlice;
