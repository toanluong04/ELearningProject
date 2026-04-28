// src/components/Footer.jsx
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Logo and Socials */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">GrowCourse</h3>
            <p className="mb-4">
              Your partner in lifelong learning. Start your journey with us today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-white"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-white"><FaLinkedin size={20} /></a>
              <a href="#" className="hover:text-white"><FaInstagram size={20} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <p>600 Ngo Quyen St, Da Nang City</p>
            <p>luongtrungtoan04@gmail.com</p>
            <p>+84 357736714</p>
          </div>
        </div>
        
        {/* Copyright */}
        <hr className="border-gray-700" />
        <p className="text-center text-gray-500 mt-8">
          © 2026 GrowCourse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;