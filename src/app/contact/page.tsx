'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Example API call - replace with your actual endpoint
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding-lg">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
        <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-12">Get In Touch</h1>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-2">Address</p>
                <p className="text-white">Jersey, Channel Islands</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Email</p>
                <a href="mailto:hello@harrys.je" className="text-lime hover:text-lime-dark">
                  hello@harrys.je
                </a>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Phone</p>
                <a href="tel:+447700900000" className="text-lime hover:text-lime-dark">
                  07700 900000
                </a>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Opening Hours</p>
                <p className="text-white">Monday-Friday: 06:00 - 21:00</p>
                <p className="text-white">Saturday: 08:00 - 18:00</p>
                <p className="text-white">Sunday: 09:00 - 16:00</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-400 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-lime focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-lime w-full text-sm font-semibold tracking-widest uppercase disabled:opacity-50">
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>

              {submitted && <p className="text-lime text-center">Message sent successfully!</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
