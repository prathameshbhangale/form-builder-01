import { Request, Response } from "express";
import { AppDataSource } from "../database/dataSource";
import { Response as FormResponse } from  "../database/models/Response";
import { Form } from "../database/models/Form";
import { FieldValue } from "../database/models/FieldValue";
import jwt from "jsonwebtoken";
import { Field } from "../database/models/Field";

export interface FieldValuesType{
    fieldId:number;
    value: any
}

export interface FormField {
    id: number;
    type: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
  }

export const submitResponse = async (req: Request, res: Response) : Promise<void> => {
    try {
        const token = req.body.token as string;
        const secretKey = process.env.JWT_SECRET as string;

        if (!token) {
            res.status(400).json({
                success: false,
                message: "JWT token is required in query parameters.",
            });
            return
        }

        // Decode the token to extract formId and userId
        const decodedToken = jwt.verify(token, secretKey) as { formId: number; userId: number };
        const { formId, userId } = decodedToken;

        if (!formId || !userId) {
            res.status(400).json({
                success: false,
                message: "Invalid token: formId and userId are required.",
            });
            return
        }

        // Fetch the Form and verify ownership
        const formRepository = AppDataSource.getRepository(Form);
        const form = await formRepository.findOne({
            where: { formId },
            relations: ["user"],
        });

        if (!form) {
            res.status(404).json({
                success: false,
                message: "Form not found.",
            });
            return
        }

        // Extract fieldValues from request body
        let fieldValues:FieldValuesType[];
        fieldValues = req.body.fieldValues;
        if (!fieldValues || !Array.isArray(fieldValues)) {
            res.status(400).json({
                success: false,
                message: "Invalid field values. Provide an array of field values.",
            });
            return
        }

        // Create the Response
        const responseRepository = AppDataSource.getRepository(FormResponse);
        const fieldValueRepository = AppDataSource.getRepository(FieldValue);
        const fieldRepository = AppDataSource.getRepository(Field)

        const formResponse = responseRepository.create({
            form,
            submittedAt: new Date(),
        });

        await responseRepository.save(formResponse);

        // Save FieldValues
        for (const value of fieldValues) {

            const field = await fieldRepository.findOne({
                where: { fieldId : value.fieldId },
            });

            if (!field) {
                res.status(404).json({
                  success: false,
                  message: `Field with ID ${value.fieldId} not found.`,
                });
                return
              }

            let FieldValueDB = new FieldValue()
            FieldValueDB.response = formResponse,
            FieldValueDB.field = field,
            FieldValueDB.value = value.value

            await fieldValueRepository.save(FieldValueDB);
        }

        res.status(201).json({
            success: true,
            message: "Response submitted successfully.",
            responseId: formResponse.responseId,
        });
    } catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while submitting the response.",
        });
    }
};

export const initilizeResponse = async (req: Request, res: Response) : Promise<void> => {
    try {
        const token = req.body.token as string;
        const secretKey = process.env.JWT_SECRET as string;

        if (!token) {
            res.status(400).json({
                success: false,
                message: "JWT token is required in body parameters.",
            });
            return
        }

        // Decode the token to extract formId and userId
        const decodedToken = jwt.verify(token, secretKey) as { formId: number; userId: number };
        const { formId, userId } = decodedToken;

        if (!formId || !userId) {
            res.status(400).json({
                success: false,
                message: "Invalid token: formId and userId are required.",
            });
            return
        }

        // Fetch the Form and verify ownership
        const formRepository = AppDataSource.getRepository(Form);
        const form = await formRepository.findOne({
            where: { formId },
            relations: ["user"],
        });

        if (!form) {
            res.status(404).json({
                success: false,
                message: "Form not found.",
            });
            return
        }

        if (form.user.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "invalid token ",
            });
            return
        }
        const fieldRepository = AppDataSource.getRepository(Field);
        const rawFields = await fieldRepository.find({
            where: { form: { formId } },
            order: { order: "ASC" },
            select: ["fieldId", "type", "label", "isRequired", "placeholder", "options"]
        });
        
        const fields: FormField[] = rawFields.map(field => ({
            id: field.fieldId,
            type: field.type,
            label: field.label,
            required: field.isRequired,
            placeholder: field.placeholder || undefined,
            options: field.options ?? undefined
        }));
        res.status(201).json({
            success: true,
            message: "Response initilize successfully.",
            fields: fields
        });
    } catch (error) {
        
    }
}

