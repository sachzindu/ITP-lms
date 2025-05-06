import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Hero from "./Hero";
import Section2 from "./Section2";
const AllInOne = () => {
  const features = [
    { title: 'Notifications', description: 'Stay updated with real-time alerts and messages.' },
    { title: 'Analytics', description: 'Gain insights with detailed reports and metrics.' },
    { title: 'Collaboration', description: 'Work seamlessly with your team in one place.' },
    { title: 'Automation', description: 'Save time with smart task automation tools.' },
    { title: 'Integrations', description: 'Connect with your favorite apps effortlessly.' },
    { title: 'Security', description: 'Keep your data safe with top-tier protection.' },
    { title: 'Customization', description: 'Tailor the platform to fit your needs.' },
    { title: 'Support', description: 'Get help anytime with 24/7 customer service.' },
  ];

  return (
    
    <div name="platforms" className="w-full my-32 bg-gray-50">
      
      <div className="max-w-[1240px] mx-auto px-4 py-16">
      <Hero/>
        <h2 className="text-5xl font-bold text-center text-gray-800">All-In-One Platform</h2>
        <p className="text-xl py-6 text-gray-600 text-center max-w-2xl mx-auto">
          Discover a unified solution designed to streamline your workflow, boost productivity, and simplify your life.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <CheckIcon className="w-7 h-7 mr-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{feature.title}</h3>
                <p className="text-base text-gray-500 pt-2">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Section2/>
      </div>
    </div>
  );
};

export default AllInOne;