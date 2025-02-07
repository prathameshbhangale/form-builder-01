import { apiConnector } from "../axiosInstance";
import { form_responses } from "../api";
import { FormField } from "../../types";

export type ApiResponse = {
    fields?: string[];
    values?: any[][];
    count?: number;
    success: boolean;
    message: string;
};


export const fetchFormResponses = async (formId: number, token: string): Promise<ApiResponse> => {
    try {
        const body = { formId };
        const response = await apiConnector<ApiResponse>(
            "POST",
            form_responses,
            body,
            { Authorization: `Bearer ${token}` }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error fetching form responses:", error);
        throw error.response?.data || { success: false, message: "Unknown error occurred" };
    }
};
