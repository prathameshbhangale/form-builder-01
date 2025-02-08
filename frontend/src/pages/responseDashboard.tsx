import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserForms, Form } from "../apis/forms/getUserForms";
import { fetchFormResponses, ApiResponse as ResponseData } from "../apis/forms/formResponse";
import { RootState } from "../store";

const FormResponsePage = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState<number | null>(null);
  const [responses, setResponses] = useState<ResponseData | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await getUserForms(token);
        if (response.success) {
          setForms(response.forms);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [token]);

  const handleViewResponses = async (formId: number) => {
    try {
      setSelectedForm(formId);
      const response = await fetchFormResponses(formId, token);
      if (response.success) {
        setResponses(response);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error fetching form responses:", error);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl text-center font-semibold mb-4 text-yellow-500">User Forms</h2>

      {/* Main Layout Container */}
      <div className="flex gap-6">
        {/* Left Side - Forms List */}
        <div className="w-1/3 bg-gray-800 shadow-md rounded-lg border border-gold-500 p-4">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">Forms</h3>
          {loading ? (
            <p className="text-gray-400 text-center">Loading forms...</p>
          ) : forms.length === 0 ? (
            <p className="text-gray-400 text-center">No forms found.</p>
          ) : (
            <ul className="space-y-4">
              {forms.map((form) => (
                <li
                  key={form.formId}
                  className={`flex justify-between items-center p-3 rounded-md cursor-pointer transition-colors duration-300 hover:bg-gray-700 border border-gray-600 ${
                    selectedForm === form.formId ? "bg-gold-500 text-black" : "bg-gray-700 text-white"
                  }`}
                  onClick={() => handleViewResponses(form.formId)}
                >
                  <span className="text-lg font-medium">{form.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Side - Responses Table */}
        <div className="w-2/3 bg-gray-800 shadow-md rounded-lg border border-gold-500 p-4">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">
            {selectedForm ? `Responses for Form ID: ${selectedForm}` : "Select a form to view responses"}
          </h3>

          {selectedForm && responses && responses.count && responses.count > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-600 text-white">
                <thead>
                  <tr className="bg-gray-700 text-gold-500">
                    {responses.fields &&
                      responses.fields.map((field, index) => (
                        <th
                          key={index}
                          className="border border-gray-600 px-4 py-2 text-left"
                        >
                          {field}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.values &&
                    responses.values.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-700">
                        {row.map((value, colIndex) => (
                          <td
                            key={colIndex}
                            className="border border-gray-600 px-4 py-2 text-gray-300"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">
              {selectedForm ? "No responses available." : "Select a form to see responses."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormResponsePage;
