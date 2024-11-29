import React from 'react';
import { Link } from 'react-router-dom';
import groupPetImage from './biggrouppets.jpg';
import recordsFeatureImage from './recordsFeature.png';
import weightFeature from './weightFeature.png';
import servicesFeature from './servicesFeature.png';



const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md fixed z-50 top-0 z-10 w-full">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-500">PawPrint</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#features" className="text-gray-600 hover:text-orange-500 transition duration-300">Features</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-orange-500 transition duration-300">About</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-orange-500 transition duration-300">Contact</a></li>
              <li>
                <Link
                  to="/signin"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
      <section className="relative bg-orange-50 overflow-hidden">
  <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,237,213,0.8),transparent_70%)]" />
  
  <div className="container mx-auto px-4 py-20 relative z-10">
    <div className="flex flex-col lg:flex-row items-center">
      <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          Manage Your Pet's Health with Ease
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-lg">
          Your all-in-one solution for tracking your pet's weight, medical records, and more.
        </p>
        <Link
          to="/register"
          className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300 inline-block"
        >
          Get Started
        </Link>
      </div>
      <div className="w-full lg:w-1/2">
        <img 
          src={groupPetImage}
          alt="Various pets including dogs, cats, and birds" 
          className="w-full h-auto rounded-lg shadow-2xl"
        />
      </div>
    </div>
  </div>
</section>


        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-orange-50 rounded-xl overflow-hidden shadow-lg transition duration-300 hover:shadow-xl">
  <div className="aspect-[4/3] relative overflow-hidden">
    <img
      src={weightFeature}
      alt="Weight Tracking"
      className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-500"
    />
  </div>
  <div className="p-6">
    <h4 className="text-2xl font-semibold text-gray-800 mb-3">Weight Tracking</h4>
    <p className="text-gray-600">
      Monitor your pet's weight over time with easy-to-read charts. Your pet's weight over time can be an indicator of their health, which is why we made sure to include easy weight tracking methods so you as an owner can easily know if your companion's weight is fluctuating.
    </p>
  </div>
</div>

<div className="bg-orange-50 rounded-xl overflow-hidden shadow-lg transition duration-300 hover:shadow-xl">
  <div className="aspect-[4/3] relative overflow-hidden">
    <img
      src={recordsFeatureImage}
      alt="Medical Records"
      className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-500"
    />
  </div>
  <div className="p-6">
    <h4 className="text-2xl font-semibold text-gray-800 mb-3">Medical Records</h4>
    <p className="text-gray-600">
      Our goal is to make sure you have access to your pet's medical records at all times. Whether you switch vets or need to use emergency services, you will never have to worry about your medical professional not having all the information they need to treat your companion.
    </p>
  </div>
</div>

<div className="bg-orange-50 rounded-xl overflow-hidden shadow-lg transition duration-300 hover:shadow-xl">
  <div className="aspect-[4/3] relative overflow-hidden">
    <img
      src={servicesFeature}
      alt="Appointment Reminders"
      className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-500"
    />
  </div>
  <div className="p-6">
    <h4 className="text-2xl font-semibold text-gray-800 mb-3">Appointment Reminders</h4>
    <p className="text-gray-600">
     Set appointment reminder's for all your furry friend needs and easily organize past appointment records all in one place
    </p>
  </div>
</div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">About PawPrint</h3>
            <p className="text-gray-600 text-center max-w-3xl mx-auto">
              PawPrint was founded by pet lovers who understand the challenges of pet ownership. 
              Our mission is to simplify pet care by providing intuitive tools for tracking your 
              pet's health and well-being. With PawPrint, you can ensure your furry friends 
              live their happiest, healthiest lives.
            </p>
          </div>
        </section>

        <section id="contact" className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Contact Us</h3>
            <div className="max-w-2xl mx-auto bg-orange-50 p-6 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-4 text-lg text-center">
                Our team is committed to making sure all our users have a seamless experience, if you encounter any issues using our software or have any suggestions for features please feel free to reach out!
              </p>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" name="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"></textarea>
                </div>
                <button type="submit" className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition duration-300">Send Message</button>
              </form>
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>support@pawprint.care</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>(813) 391-6447</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p>2024 PawPrint</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;