import React from 'react';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import WhyChooseUsSection from './components/sections/WhyChooseUsSection';
import FeaturedListings from './components/sections/FeaturedListings';
import HowItWorksSection from './components/sections/HowItWorksSection';
import CommitmentSection from './components/sections/CommitmentSection';
import CTASection from './components/sections/CTASection';
import Footer from './components/layout/Footer';
import './styles/global.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <HeroSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <CommitmentSection />
      <FeaturedListings />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;
