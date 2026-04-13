import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-extrabold mb-4 text-blue-600">AI Resume Builder</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-lg text-center">
        Create professional resumes in minutes with AI-assisted content generation.
        Land your dream job faster.
      </p>
      <div className="flex gap-4">
        <Link to="/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow font-medium hover:bg-blue-700">
          Get Started
        </Link>
        <Link to="/login" className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow font-medium hover:bg-blue-50">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
