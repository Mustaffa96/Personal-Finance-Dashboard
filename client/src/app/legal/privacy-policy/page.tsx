import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">Last Updated: July 11, 2025</p>
      
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p>
          This Privacy Policy describes how your personal information is collected, used, and shared when you use the Personal Finance Dashboard (the &quot;Application&quot;).
          As this is a personal project, this policy is simplified but still aims to provide transparency about data handling practices.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Personal Information We Collect</h2>
        <p>
          When you use the Application, we may collect the following types of information:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Account information: email address, password (encrypted), and profile details</li>
          <li>Financial information: transaction data, budget information, and spending categories</li>
          <li>Usage information: how you interact with the Application</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Personal Information</h2>
        <p>
          We use the personal information we collect to:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Provide, maintain, and improve the Application</li>
          <li>Process and display your financial data</li>
          <li>Generate insights about your spending habits</li>
          <li>Protect against fraudulent or unauthorized activity</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Storage and Security</h2>
        <p>
          Your data is stored in a MongoDB database. We implement reasonable security measures to protect your personal information:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Passwords are hashed using bcrypt</li>
          <li>Data is transmitted using secure HTTPS connections</li>
          <li>Access to the database is restricted</li>
        </ul>
        <p>
          As this is a personal project, the Application may not have the same level of security as commercial applications. Please be aware of this limitation.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Sharing</h2>
        <p>
          We do not share your personal information with third parties. Your data is used solely within the Application for the purposes described above.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p>
          You have the right to:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Access the personal information we have about you</li>
          <li>Request that we correct or update your personal information</li>
          <li>Request that we delete your personal information</li>
          <li>Export your data in a common format</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at ahmadmustaffa8@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
