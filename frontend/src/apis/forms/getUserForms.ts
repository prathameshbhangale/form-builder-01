import { apiConnector } from "../axiosInstance";
import { form_get_all_of_user } from "../api";

export interface Form {
    formId: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
  
interface SuccessResponse {
    success: true;
    forms: Form[];
}

interface ErrorResponse {
    success: false;
    message: string;
}

export type ApiResponse = SuccessResponse | ErrorResponse;

export const getUserForms = async (token: string|null): Promise<ApiResponse> => {
    try {
        console.log(token)
        const response = await apiConnector<ApiResponse>(
            "GET", 
            form_get_all_of_user,
            {},
            { Authorization: `Bearer ${token}` }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching form:", error);
        throw error.response?.data || { success: false, message: "Unknown error occurred" };
    }
};
