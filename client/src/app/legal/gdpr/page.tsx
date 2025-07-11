import React from 'react';

const GDPRCompliance = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">GDPR Compliance</h1>
      <p className="text-gray-600 mb-4">Last Updated: July 11, 2025</p>
      
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p>
          This GDPR Compliance statement explains how the Personal Finance Dashboard (the &quot;Application&quot;) complies with the General Data Protection Regulation (GDPR) for users in the European Economic Area (EEA). As this is a personal project, this document provides a simplified overview of GDPR compliance measures.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Controller</h2>
        <p>
          For the purposes of the GDPR, the developer of this Application acts as the data controller for any personal data collected through the Application.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Legal Basis for Processing</h2>
        <p>
          We process your personal data on the following legal bases:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li><strong>Consent</strong> - You have given consent for us to process your personal data for specific purposes.</li>
          <li><strong>Contract</strong> - Processing is necessary for the performance of a contract with you.</li>
          <li><strong>Legitimate Interests</strong> - Processing is necessary for our legitimate interests, such as improving the Application and ensuring its security.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your GDPR Rights</h2>
        <p>
          Under the GDPR, you have the following rights:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li><strong>Right to Access</strong> - You have the right to request copies of your personal data.</li>
          <li><strong>Right to Rectification</strong> - You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
          <li><strong>Right to Erasure</strong> - You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>Right to Restrict Processing</strong> - You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li><strong>Right to Object to Processing</strong> - You have the right to object to our processing of your personal data, under certain conditions.</li>
          <li><strong>Right to Data Portability</strong> - You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How to Exercise Your Rights</h2>
        <p>
          You can exercise your GDPR rights by contacting us at ahmadmustaffa8@gmail.com. We will respond to all requests within 30 days.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention</h2>
        <p>
          We will retain your personal data only for as long as is necessary for the purposes set out in this GDPR Compliance statement. We will retain and use your personal data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. These measures include:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Password hashing using bcrypt</li>
          <li>Secure HTTPS connections</li>
          <li>Access controls to the database</li>
        </ul>
        <p>
          As this is a personal project, the security measures may not be as robust as those implemented by commercial applications.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">International Data Transfers</h2>
        <p>
          As this is a personal project, your data is stored locally and is not transferred internationally. If this changes in the future, we will update this statement and ensure appropriate safeguards are in place.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This GDPR Compliance Statement</h2>
        <p>
          We may update this GDPR Compliance statement from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this GDPR Compliance statement or our data practices, please contact us at ahmadmustaffa8@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default GDPRCompliance;
