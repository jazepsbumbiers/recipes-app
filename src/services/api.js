import axios from "axios";

export const localAPI = axios.create({
    baseURL: 'http://localhost:3000',
});

export const externalAPI = axios.create({
    baseURL: 'https://www.themealdb.com/api/json/v1/1',
});