import React, { useEffect, useState } from "react";
import { FormField } from "../types";
import { InitResponse } from "../apis/forms/initResponse";
import { useParams } from "react-router-dom";
import { SubmitResponse } from "../apis/forms/submitResponse";
import { useNavigate } from "react-router-dom";


const StyledForm: React.FC = () => {
  const navigate = useNavigate();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      navigate("/success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-pink-100 flex justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 shadow-lg rounded-lg">
        {formFields.map((field) => (
          <div key={field.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
            { (field.type !=="title" && field.type!=="description") && (<label className="block text-gray-700 font-medium mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>)}

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
                      // checked={false}
                      onChange={handleChange}
                      required={field.required}
                    />
                  );
                case "title":
                  return <h3 className="text-lg font-semibold text-gray-700">{field.label}</h3>;
                case "description":
                  return <p className="text-gray-600">{field.label || "Description text here..."}</p>;
                case "large-text":
                  return (
                    <textarea
                      name={`${field.id}`}
                      placeholder={field.placeholder || "Enter text here..."}
                      className="w-full p-3 border rounded-md bg-gray-200 focus:ring-2 focus:ring-pink-400"
                      rows={3}
                      onChange={handleChange}
                      required={field.required}
                    />
                  );
                case "number":
                  return (
                    <input
                      type="number"
                      name={`${field.id}`}
                      placeholder={field.placeholder || "Enter number"}
                      className="w-full p-3 border rounded-md bg-gray-200 focus:ring-2 focus:ring-pink-400"
                      onChange={handleChange}
                      required={field.required}
                    />
                  );
                case "date":
                  return (
                    <input
                      type="date"
                      name={`${field.id}`}
                      className="w-full p-3 border rounded-md bg-gray-200 focus:ring-2 focus:ring-pink-400"
                      onChange={handleChange}
                      required={field.required}
                    />
                  );
                case "email":
                  return (
                    <input
                      type="email"
                      name={`${field.id}`}
                      placeholder={field.placeholder || "email@example.com"}
                      className="w-full p-3 border rounded-md bg-gray-200 focus:ring-2 focus:ring-pink-400"
                      onChange={handleChange}
                      required={field.required}
                    />
                  );
                case "phone":
                  return (
                    <input
                      type="tel"
                      name={`${field.id}`}
                      placeholder={field.placeholder || "+1 (555) 000-0000"}
                      className="w-full p-3 border rounded-md bg-gray-200 focus:ring-2 focus:ring-pink-400"
                      onChange={handleChange}
                      required={field.required}
                    />
                  );
                default:
                  return (
                    <input
                      type="text"
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
