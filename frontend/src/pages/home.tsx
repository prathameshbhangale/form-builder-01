import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("form/initilize"); // Navigates to the specified route
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-yellow-500 mb-4">
          📝 Build Forms Effortlessly
        </h1>
        <p className="text-lg text-gray-300">
          Create, share, and collect responses with ease.  
          Our intuitive form builder lets you design custom forms  
          and gather valuable insights from your users.
        </p>

        <div className="mt-6">
          <p className="text-gray-400">
            Start creating your own forms and manage responses effortlessly.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-4 px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition"
          >
            Get Started
          </button>
        </div>

        {/* Image Section */}
        <div className="mt-10">
          <img
            src="https://source.unsplash.com/800x400/?forms,technology"
            alt="Form Builder Illustration"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
