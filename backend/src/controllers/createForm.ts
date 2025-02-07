import { Request, Response } from "express";
import { AppDataSource } from "../database/dataSource";
import { JwtPayload } from "jwt-decode";
import { Form } from "../database/models/Form";
import { User } from "../database/models/User";
import { CustomRequest } from "../types/CustomRequest";

export const createForm = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { title, message } = req.body;
        if (!title || !message) {
            res.status(400).json({ success:false, error: "All fields are required" });
            return;
        }
        const formRepository = AppDataSource.getRepository(Form);
        const userRepository = AppDataSource.getRepository(User);
        const userId = Number(req.tokenPayload?.sub); 
        // console.log("Token Payload:", req.tokenPayload?.sub)
        if (!userId) {
            throw new Error("Invalid userId in token payload");
        }
        const user = await userRepository.findOneBy({userId})
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        const form = formRepository.create({
            title: title,
            description: message,
            user,
        });
        await formRepository.save(form);

        res.status(201).json({  success:true ,message: "Form submitted successfully", form });
    } catch (error) {
      console.error("Error creating form:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};


export const getUserForms = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = Number(req.tokenPayload?.sub); 
    // console.log("Token Payload:", req.tokenPayload?.sub)
    if (!userId) {
        throw new Error("Invalid userId in token payload");
    }
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { userId },
            relations: ["forms"],
        });
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return
        }
        res.status(200).json({ success: true, forms: user.forms });
    } catch (error) {
        console.error("Error fetching user forms:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


export const getFormById = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { formId } = req.params;
        console.log(formId)
        const parsedFormId = Number(formId);
        if (isNaN(parsedFormId)) {
            res.status(400).json({ success: false, message: "Invalid form ID." });
            return;
        }
        const formRepository = AppDataSource.getRepository(Form);
        const form = await formRepository.findOne({
            where: { formId: parsedFormId },
            relations: ["user", "fields", "responses"], 
        });
        if (!form) {
            res.status(404).json({ success: false, message: "Form not found." });
            return;
        }

        res.status(200).json({ success: true, form });
    } catch (error) {
        console.error("Error fetching form by ID:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


export const deleteForm = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { formId } = req.params;
        const payload = req.tokenPayload;

        if (!payload) {
            res.status(401).json({ success: false, message: "Unauthorized request. Login required." });
            return;
        }

        const parsedFormId = Number(formId);
        if (isNaN(parsedFormId)) {
            res.status(400).json({ success: false, message: "Invalid form ID." });
            return;
        }

        const formRepository = AppDataSource.getRepository(Form);
        const form = await formRepository.findOne({
            where: { formId: parsedFormId },
            relations: ["user", "fields", "responses", "responses.fieldValues"], // Load related entities
        });

        if (!form) {
            res.status(404).json({ success: false, message: "Form not found." });
            return;
        }

        // Check if the logged-in user is the owner of the form
        if (form && form.user && form.user.userId !== Number(payload.sub)) {
            res.status(403).json({ success: false, message: "You are not authorized to delete this form." });
            return;
        }

        // Remove the form (Cascade deletes associated fields, fieldValues, and responses)
        await formRepository.remove(form);
        
        res.status(200).json({ success: true, message: "Form and related data deleted successfully." });
    } catch (error) {
        console.error("Error deleting form:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};