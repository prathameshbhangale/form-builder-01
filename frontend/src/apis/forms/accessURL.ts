import { apiConnector } from "../axiosInstance";
import { form_response_url } from "../api";
import { FormField } from "../../types";

export type ApiResponse = {
    success: boolean;
    message: string;
    token?: string;
};


export const FormResponseURL = async (formId:number, token:string): Promise<ApiResponse> => {
    try {
        let body = {
            formId
        }
        const response = await apiConnector<ApiResponse>(
            "POST", 
            form_response_url,
            body,
            { Authorization: `Bearer ${token}` }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error in access URL form:", error);
        throw error.response?.data || { success: false, message: "Unknown error occurred" };
    }
};
