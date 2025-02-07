import { apiConnector } from "../axiosInstance";
import { form_delete } from "../api";

export type ApiResponse = {
    success: boolean;
    message: string;
};


export const FormDelete = async (formId:number, token:string): Promise<ApiResponse> => {
    try {
        const response = await apiConnector<ApiResponse>(
            "DELETE", 
            `${form_delete}${formId}`,
            {},
            { Authorization: `Bearer ${token}` }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error in delete form:", error);
        throw error.response?.data || { success: false, message: "Unknown error occurred" };
    }
};
