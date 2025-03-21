import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FieldTypes } from "../components/form-field/FieldTypes";
import { FormLayout } from "../components/form-field/FormLayout";
import { FieldEditor } from "../components/form-field/FieldEditor";
import { AddFieldApi } from "../apis/forms/addField";
import { RootState } from "../store";
import { useParams, useNavigate } from "react-router-dom";
import { FormResponseURL } from "../apis/forms/accessURL";
import PopupModal from "../components/PopupModal";

function FormFieldContainer() {
  const fields = useSelector((state: RootState) => state.form.fields);
  const token = useSelector((state: RootState) => state.user.token);
  const { formid } = useParams<{ formid: string }>();
  const navigate = useNavigate();
  const id = Number(formid);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUrl, setFormUrl] = useState("");

  const handleCreateForm = async () => {
    try {
      const response = await AddFieldApi(fields, token, id);
      const accessToken = await FormResponseURL(id,token);
      if (accessToken) {
        setFormUrl(`http://localhost:5173/resp/${accessToken.token}`);
        setIsModalOpen(true); // Open the modal
      } else {
        console.error("Failed to generate form URL.");
      }
    } catch (error) {
      console.error("Failed to create form");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Form Builder</h1>
          <div className="flex space-x-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600">
              Preview
            </button>
            <button
              onClick={handleCreateForm}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700"
            >
              Create
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <FieldTypes />
          </div>
          <div className="md:col-span-2">
            <FormLayout />
          </div>
        </div>
        <FieldEditor />
      </div>

      {/* Popup Modal */}
      <PopupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate("/"); // Navigate to home after closing modal
        }}
        formUrl={formUrl}
      />
    </DndProvider>
  );
}

export default FormFieldContainer;
