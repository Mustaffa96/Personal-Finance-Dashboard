import React from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "This dashboard has completely transformed how I manage my finances. I can now easily track my expenses and stay within my budget.",
      name: "Sarah Johnson",
      title: "Small Business Owner",
      avatar: "/avatars/avatar-1.png"
    },
    {
      quote: "The visual analytics make it so easy to understand where my money is going. I've saved over $300 in the first month alone!",
      name: "Michael Chen",
      title: "Software Developer",
      avatar: "/avatars/avatar-2.png"
    },
    {
      quote: "I've tried many finance apps, but this one stands out with its intuitive interface and comprehensive features. Highly recommended!",
      name: "Emily Rodriguez",
      title: "Marketing Specialist",
      avatar: "/avatars/avatar-3.png"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who have improved their financial health with our dashboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-4">
                  {/* Fallback for avatar */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
