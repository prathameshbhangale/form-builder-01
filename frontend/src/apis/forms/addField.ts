import { apiConnector } from "../axiosInstance";
import { form_add_fields } from "../api";
import { FormField } from "../../types";

export type ApiResponse = {
    success: boolean;
    message: string;
};

interface ApiField {
    label:string,
    type: string,
    isRequired?: boolean,
    order:number,
    placeholder?:string,
    options?:string[],
    formId:number
}

// {
//     "label": "Country",
//     "type": "select",
//     "isRequired": false,
//     "order": 4,
//     "formId": 19,
//     "placeholder": "Select your country",
//     "options": ["USA", "Canada", "UK", "India"]
// }

export const AddFieldApi = async (fields: FormField[],token: string|null, formid:number): Promise<ApiResponse> => {
    try {
        let body:ApiField[] = []; 
        console.log(fields)
        fields.forEach((value:FormField,index:number)=>{
            body.push({
                label: value.label,
                type: value.type,
                isRequired: value.required,
                order: index+1,
                placeholder: value.placeholder,
                options: value.options,
                formId: formid
            })
        })
        const response = await apiConnector<ApiResponse>(
            "POST", 
            form_add_fields,
            body,
            { Authorization: `Bearer ${token}` }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error creating form:", error);
        throw error.response?.data || { success: false, message: "Unknown error occurred" };
    }
};
