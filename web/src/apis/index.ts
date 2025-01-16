import api from "../lib/axios.ts";
import axios, { AxiosResponse } from "axios";
import { LoginDTO, OnboardingData } from "../types";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: 'https://api.easyentryusa.com/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
        'content-type': 'application/json',
    },
});

export const uploadToS3 = async (file: any) => {
    console.log("FILE: ", file);
    // eslint-disable-next-line no-useless-catch
    try {
        const { data } = await api.post('/jobs/s3-presigned/?filename=' + file.name, {
            filename: file.name
        })
        console.log("DATA: ", data)
        // return data.url
        //     const response = await client.mutate({
        //         mutation: gql`
        //   mutation MyMutation($name: String!, $type: String!) {
        //     generatePresignedUrl(arg1: { name: $name, type: $type }) {
        //       presignedUrl
        //     }
        //   }
        // `,
        //         variables: {
        //             name: file.name,
        //             type: file.type,
        //         },
        //     });

        // const presignedUrl = response.data.generatePresignedUrl.presignedUrl;

        await axios.put(data.url, file, {
            headers: {
                'Content-Type': 'application/octet-stream'
                // 'x-amz-acl': 'public-read',
            },
        });
        return `https://aiscreening.s3.eu-north-1.amazonaws.com/${file.name}`;
    } catch (error) {
        throw error;
    }
};

export const getAllBrands = async (email: string): Promise<OnboardingData[]> => {
    return (await api.get(`/brands/${email}`)).data;
}

export const signupRecruiter = async (data: any) => {
    return (await api.post(`/authentication/sign-up`, data)).data;
}

export const confirmEmail = async (token: string) => {
    return (await api.get(`/authentication/confirm-email/${token}`)).data;
}

export const login = async (data: any): Promise<LoginDTO> => {
    return (await api.post('/authentication/sign-in', data)).data;
}

export const signupWithFirebase = async (data: any): Promise<LoginDTO> => {
    return (await api.post('/firebase/firebase-authenticate', data)).data;
}

export const forgotPassword = async (data: any): Promise<AxiosResponse> => {
    return await api.post('/authentication/forgot-password', data);
}

export const resetPassword = async (data: any): Promise<AxiosResponse> => {
    return await api.post('/authentication/reset-password', data);
}

export const changeApplicationStatus = async (applicationId: string, data: any): Promise<AxiosResponse> => {
    return await api.patch(`/applications/${applicationId}/status`, data);
}