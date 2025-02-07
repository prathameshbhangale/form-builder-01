const SuccessPage = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 shadow-lg rounded-lg text-center border border-gray-700">
          <h2 className="text-3xl font-bold text-gold-500">🎉 Success!</h2>
          <p className="text-lg text-gray-300 mt-2">
            Thank you for submitting the form. <br />
            Your response has been recorded successfully.
          </p>
          <span className="text-5xl mt-4">✅</span>
        </div>
      </div>
    );
  };
  
  export default SuccessPage;
  