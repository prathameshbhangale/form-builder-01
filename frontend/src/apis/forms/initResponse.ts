import { apiConnector } from "../axiosInstance";
import { form_response_init } from "../api";
import { FormField } from "../../types";

export type ApiResponse = {
    success: boolean;
    message: string;
    fields?: FormField[];
};


export const InitResponse = async ( token:string): Promise<ApiResponse> => {
    try {
        let body = {
            token
        } 
        const response = await apiConnector<ApiResponse>(
            "POST", 
            form_response_init,
            body
        );
        return response.data;
    } catch (error: any) {
        console.error("Error in access URL form:", error);
        throw error.response?.data || { success: false, message: "Unknown error occurred" };
    }
};
