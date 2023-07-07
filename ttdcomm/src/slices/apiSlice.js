
// its like parent slice

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '../constants';
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });


// creating our api slice 
export const apiSlice = createApi({
    baseQuery: baseQuery,
    tagTypes:['Product','Order','User'],
    // we dont have to manually fetch data -- try catch fetch api etc
    endpoints:(builder)=>({})
})