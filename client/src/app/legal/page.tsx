import React from 'react';
import Link from 'next/link';

const LegalIndex = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
      <p className="text-gray-600 mb-8">
        This section contains important legal information about the Personal Finance Dashboard. 
        Please review these documents to understand how we handle your data and the terms governing your use of the application.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Privacy Policy</h2>
          <p className="text-gray-600 mb-4">
            Learn about how we collect, use, and protect your personal information when you use our application.
          </p>
          <Link href="/legal/privacy-policy" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Read Privacy Policy
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Terms of Service</h2>
          <p className="text-gray-600 mb-4">
            Understand the rules and guidelines for using the Personal Finance Dashboard application.
          </p>
          <Link href="/legal/terms-of-service" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Read Terms of Service
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Cookie Policy</h2>
          <p className="text-gray-600 mb-4">
            Information about how we use cookies and similar technologies in our application.
          </p>
          <Link href="/legal/cookie-policy" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Read Cookie Policy
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">GDPR Compliance</h2>
          <p className="text-gray-600 mb-4">
            Details about how we comply with the General Data Protection Regulation for users in the European Economic Area.
          </p>
          <Link href="/legal/gdpr" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Read GDPR Information
          </Link>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Important Note</h2>
        <p className="text-gray-700">
          The Personal Finance Dashboard is a personal, non-commercial project. These legal documents are provided for transparency 
          and to establish good practices for handling user data. If you have any questions or concerns about these policies, 
          please contact the developer.
        </p>
      </div>
    </div>
  );
};

export default LegalIndex;
