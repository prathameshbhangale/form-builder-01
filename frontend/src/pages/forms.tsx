import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserForms, Form } from "../apis/forms/getUserForms";
import { useSelector } from "react-redux";
import PopupModal from "../components/PopupModal";
import { FormResponseURL } from "../apis/forms/accessURL";
import { FormDelete } from "../apis/forms/deleteForm";
import { RootState } from "../store";

function Forms() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const token = useSelector((state: RootState) => state.user.token);
  const [formUrl, setFormUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateForm = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    navigate("/form/initilize");
  };

  const getAccessURL = async (id: number) => {
    try {
      const accessToken = await FormResponseURL(id, token);
      if (accessToken) {
        setFormUrl(`http://localhost:5174/resp/${accessToken.token}`);
        setIsModalOpen(true);
      } else {
        console.error("Failed to generate form URL.");
      }
    } catch (error) {
      console.error("Failed to create form");
    }
  };

  const handleDeleteForm = async (id: number) => {
    try {
      const response = await FormDelete(id, token);
      if (response.success) {
        setForms((prevForms) => prevForms.filter((form) => form.formId !== id));
      } else {
        console.error("Failed to delete form:", response.message);
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await getUserForms(token);
        if (response.success) {
          setForms(response.forms);
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, [token]);

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Forms Dashboard</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Create a New Form</h2>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          onClick={handleCreateForm}
        >
          Create Form
        </button>
      </div>

      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Your Forms</h2>
        <ul className="space-y-2">
          {forms.map((form) => (
            <li key={form.formId} className="p-4 bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <span className="block font-medium">{form.title}</span>
                <p className="text-gray-400 text-sm">{form.description}</p>
              </div>
              <div className="flex gap-3">
                <button className="text-blue-400 hover:underline" onClick={() => getAccessURL(form.formId)}>
                  Access URL
                </button>
                <button
                  className="text-red-400 hover:underline"
                  onClick={() => handleDeleteForm(form.formId)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <PopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formUrl={formUrl}
      />
    </div>
  );
}

export default Forms;
