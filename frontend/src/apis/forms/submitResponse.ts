import { apiConnector } from "../axiosInstance";
import { form_response_submit } from "../api"; 

export type ApiResponse = {
    success: boolean;
    message: string;
    responseId?: number;
};

export type FormData = { [key: string]: string | boolean | number| Date}
export type FieldValue = {fieldId:number; value:string|boolean|number|Date|undefined|null}


export const SubmitResponse = async ( token:string, values: FormData): Promise<ApiResponse> => {
    try {
        let fieldValues:FieldValue[] = [];
        for (let [key,value] of Object.entries(values)){
            fieldValues.push({
                fieldId:Number(key),
                value
            })
        }
        let body = {
            token,
            fieldValues
        } 
        const response = await apiConnector<ApiResponse>(
            "POST", 
            form_response_submit,
            body
        );
        return response.data;
    } catch (error: any) {
        console.error("Error in access URL form:", error);
        throw error.response?.data || { success: false, message: "Unknown error occurred" };
    }
};
