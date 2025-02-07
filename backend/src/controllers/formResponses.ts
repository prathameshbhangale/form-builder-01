import { Request, Response } from "express";
import { AppDataSource } from "../database/dataSource";
import { Response as ResponseEntity } from "../database/models/Response";
import { FieldValue } from "../database/models/FieldValue";

export const getFormResponses = async (req: Request, res: Response) => {
    try {
        const { formId } = req.body;
        const responseRepository = AppDataSource.getRepository(ResponseEntity);

        // Fetch all responses for the given formId, including field values
        const responses = await responseRepository.find({
            where: { form: { formId: parseInt(formId) } },
            relations: ["fieldValues", "fieldValues.field"],
            order: { submittedAt: "ASC" }, // Order by latest submitted responses
        });

        if (!responses.length) {
            res.status(404).json({ success:true, message: "No responses found for this form." });
            return 
        }

        // Extract unique field names dynamically
        const fieldNames = [
            "responseID",
            ...new Set(responses.flatMap(response => response.fieldValues.map(fv => fv.field.label))),
            "submittedAt"
        ];

        // Format the values array
        const values = responses.map(response => {
            const row: any[] = [];
            row.push(response.responseId); // responseID

            // Add field values in the correct order
            fieldNames.slice(1, -1).forEach(field => {
                const fieldValue = response.fieldValues.find(fv => fv.field.label === field);
                row.push(fieldValue ? fieldValue.value : null);
            });

            row.push(response.submittedAt); // submittedAt
            return row;
        });

        // Construct final response
        const result = {
            fields: fieldNames,
            values: values,
            count: values.length,
            success: true,
            message: "form responses are avaliable",
        };
        // const data = {
        //     success: true,
        //     message: "form responses are avaliable",
        //     data: result
        // }

         res.json(result);
         return
    } catch (error) {
        console.error("Error fetching form responses:", error);
        res.status(500).json({ success:false, message: "Internal server error" });
        return;
    }
};
