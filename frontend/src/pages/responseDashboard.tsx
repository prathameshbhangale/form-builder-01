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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Forms</h2>

      {/* Main Layout Container */}
      <div className="flex gap-6">
        {/* Left Side - Forms List */}
        <div className="w-1/3 bg-white shadow-md rounded-lg border border-gray-200 p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Forms</h3>
          {loading ? (
            <p className="text-gray-600 text-center">Loading forms...</p>
          ) : forms.length === 0 ? (
            <p className="text-gray-500 text-center">No forms found.</p>
          ) : (
            <ul className="space-y-4">
              {forms.map((form) => (
                <li
                  key={form.formId}
                  className={`flex justify-between items-center p-3 rounded-md cursor-pointer ${
                    selectedForm === form.formId
                      ? "bg-blue-100 border border-blue-600"
                      : "bg-gray-100 border border-gray-300"
                  }`}
                  onClick={() => handleViewResponses(form.formId)}
                >
                  <span className="text-lg font-medium text-gray-700">{form.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Side - Responses Table */}
        <div className="w-2/3 bg-white shadow-md rounded-lg border border-gray-200 p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedForm ? `Responses for Form ID: ${selectedForm}` : "Select a form to view responses"}
          </h3>

          {selectedForm && responses && responses.count && responses.count > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    {responses.fields &&
                      responses.fields.map((field, index) => (
                        <th
                          key={index}
                          className="border border-gray-300 px-4 py-2 text-left text-gray-700"
                        >
                          {field}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.values &&
                    responses.values.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {row.map((value, colIndex) => (
                          <td
                            key={colIndex}
                            className="border border-gray-300 px-4 py-2 text-gray-600"
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
            <p className="text-gray-500">{selectedForm ? "No responses available." : "Select a form to see responses."}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormResponsePage;
