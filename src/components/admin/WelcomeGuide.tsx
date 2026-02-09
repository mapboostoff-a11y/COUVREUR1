import React from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface WelcomeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Welcome to the Builder",
    description: "Create stunning landing pages in minutes without any code. This quick tour will show you how to get started.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Edit Content Directly",
    description: "Simply click on any text or image in the preview area to edit it instantly. What you see is what you get.",
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Manage Sections",
    description: "Use the sidebar on the left to add new sections, or drag and drop existing ones to rearrange your page flow.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Customize Styles",
    description: "Select any section to open the Properties Panel on the right. Change colors, spacing, and visibility settings effortlessly.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000"
  }
];

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        <div className="w-full md:w-1/2 bg-gray-100 relative h-48 md:h-auto">
          <img 
            src={STEPS[currentStep].image} 
            alt={STEPS[currentStep].title} 
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:hidden">
             <h2 className="text-white text-xl font-bold">{STEPS[currentStep].title}</h2>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="hidden md:block">
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">Step {currentStep + 1} of {STEPS.length}</span>
                <h2 className="text-2xl font-bold text-gray-900">{STEPS[currentStep].title}</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              {STEPS[currentStep].description}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-blue-600 w-6' : 'bg-gray-200'}`}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handlePrev} 
                disabled={currentStep === 0}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-600"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < STEPS.length - 1 && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
