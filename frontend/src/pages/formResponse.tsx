import React, { useEffect, useState } from "react";
import { FormField } from "../types";
import { InitResponse } from "../apis/forms/initResponse";
import { useParams } from "react-router-dom";
import { SubmitResponse } from "../apis/forms/submitResponse";

const StyledForm: React.FC = () => {
  let [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string | boolean | number | Date }>({});
  const { FormResponseToken } = useParams<{ FormResponseToken: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (FormResponseToken) {
          const responsev = await InitResponse(FormResponseToken);
          if (responsev.fields) {
            setFormFields(responsev.fields);
          }
        }
      } catch (error) {
        console.error("Error fetching response:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!FormResponseToken) {
        throw Error("Internal rendering error");
      }
      const response = await SubmitResponse(FormResponseToken, formData);
      if (response && response.success) {
        console.log("Form submitted successfully");
      } else {
        console.log("Error submitting form");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-pink-100 flex justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 shadow-lg rounded-lg">
        {formFields.map((field) => (
          <div key={field.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <label className="block text-gray-700 font-medium mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {(() => {
              switch (field.type) {
                case "select":
                  return (
                    <select
                      name={`${field.id}`}
                      className="w-full p-3 border rounded-md bg-gray-200 focus:ring-2 focus:ring-pink-400"
                      onChange={handleChange}
                      required={field.required}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  );
                case "radio":
                  return (
                    <div className="flex gap-4">
                      {field.options?.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`${field.id}`}
                            value={option}
                            className="w-4 h-4"
                            onChange={handleChange}
                            required={field.required}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  );
                case "checkbox":
                  return (
                    <input
                      type="checkbox"
                      name={`${field.id}`}
                      className="w-4 h-4"
                      onChange={handleChange}
                      required={field.required}
                    />
                  );
                default:
                  return (
                    <input
                      type={field.type}
                      name={`${field.id}`}
                      placeholder={field.placeholder || "Enter value"}
                      className="w-full p-3 border rounded-md bg-gray-200 focus:ring-2 focus:ring-pink-400"
                      onChange={handleChange}
                      required={field.required}
                    />
                  );
              }
            })()}
          </div>
        ))}

        <button type="submit" className="w-full p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default StyledForm;
