import React, { useState } from 'react';
import PostServiceForm from './components/PostServiceForm';
import RequestServiceForm from './components/RequestServiceForm';
import NavBar from './components/NavBar';

type FormType = 'post' | 'request';

function App() {
  const [activeForm, setActiveForm] = useState<FormType>('post');

  const handlePostServiceSubmit = (data: any) => {
    console.log('Post Service Data:', data);
    alert('Service posted successfully!');
  };

  const handleRequestServiceSubmit = (data: any) => {
    console.log('Request Service Data:', data);
    alert('Service request posted successfully!');
  };

  return (
    <div className="min-h-screen bg-bg-cream font-cairo">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Form Toggle */}
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed bg-card-cream shadow-lg">
            <button
              className={`tab tab-lg font-semibold transition-all duration-200 ${
                activeForm === 'post' 
                  ? 'tab-active bg-primary text-white' 
                  : 'text-text-interactive hover:text-primary'
              }`}
              onClick={() => setActiveForm('post')}
            >
              Post a Service
            </button>
            <button
              className={`tab tab-lg font-semibold transition-all duration-200 ${
                activeForm === 'request' 
                  ? 'tab-active bg-primary text-white' 
                  : 'text-text-interactive hover:text-primary'
              }`}
              onClick={() => setActiveForm('request')}
            >
              Request a Service
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="transition-all duration-300 ease-in-out">
          {activeForm === 'post' ? (
            <PostServiceForm 
              onSubmit={handlePostServiceSubmit}
              className="animate-fadeIn"
            />
          ) : (
            <RequestServiceForm 
              onSubmit={handleRequestServiceSubmit}
              className="animate-fadeIn"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;