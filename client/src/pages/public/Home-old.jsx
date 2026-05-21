// client/src/pages/public/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PublicHeader scrolled={scrolled} />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

// ============ HEADER COMPONENT ============
const PublicHeader = ({ scrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FMS Enterprise</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-gray-600 hover:text-blue-600 py-2">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 py-2">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 py-2">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 py-2">Contact</a>
              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/login" className="text-center px-4 py-2 text-gray-600 hover:text-blue-600">Sign In</Link>
                <Link to="/register" className="text-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Get Started</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// ============ HERO SECTION ============
const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Complete Facility Management
              <span className="text-blue-600"> Solution</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Manage complaints, tasks, workforce, attendance, payroll, and more - all in one powerful platform. 
              Streamline your facility operations with our enterprise-grade solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/demo" 
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center font-semibold"
              >
                Request Demo
              </Link>
            </div>
            <div className="flex items-center space-x-6 mt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">U{i}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">10,000+</span> users trust us
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://via.placeholder.com/600x400?text=FMS+Dashboard+Preview" 
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ FEATURES SECTION ============
const FeaturesSection = () => {
  const features = [
    {
      icon: "🏢",
      title: "Multi-Building Management",
      description: "Manage multiple properties, buildings, floors, and units from a single dashboard."
    },
    {
      icon: "📋",
      title: "Complaint Management",
      description: "Track and resolve complaints with SLA monitoring and auto-escalation."
    },
    {
      icon: "✅",
      title: "Task Assignment",
      description: "Assign tasks to technicians, track progress, and verify completion."
    },
    {
      icon: "📍",
      title: "Live GPS Tracking",
      description: "Real-time tracking of field staff with geofence alerts."
    },
    {
      icon: "👥",
      title: "Attendance Management",
      description: "GPS, QR, and face recognition based attendance tracking."
    },
    {
      icon: "💰",
      title: "Payroll & Billing",
      description: "Automated payroll processing and invoice generation."
    },
    {
      icon: "📊",
      title: "Analytics & Reports",
      description: "Comprehensive reports and real-time analytics dashboard."
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description: "Email, SMS, and push notifications for important updates."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Facilities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features to streamline your facility management operations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ STATS SECTION ============
const StatsSection = () => {
  const stats = [
    { value: "98%", label: "Customer Satisfaction", icon: "⭐" },
    { value: "50K+", label: "Complaints Resolved", icon: "✅" },
    { value: "24/7", label: "Support Available", icon: "🕐" },
    { value: "99.9%", label: "Uptime Guarantee", icon: "📈" }
  ];

  return (
    <section className="py-20 px-4 bg-blue-600">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ HOW IT WORKS SECTION ============
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your account and set up your organization",
      icon: "📝"
    },
    {
      number: "02",
      title: "Configure",
      description: "Add buildings, units, staff, and customize settings",
      icon: "⚙️"
    },
    {
      number: "03",
      title: "Start Managing",
      description: "Begin managing complaints, tasks, and operations",
      icon: "🚀"
    },
    {
      number: "04",
      title: "Track & Optimize",
      description: "Monitor performance and optimize operations",
      icon: "📊"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple setup process
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/3 left-full w-full h-0.5 bg-blue-200 -translate-y-1/2"></div>
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <span className="text-2xl">{step.icon}</span>
              </div>
              <div className="text-4xl font-bold text-blue-200 mb-2">{step.number}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ TESTIMONIALS SECTION ============
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Facility Manager",
      company: "Downtown Properties",
      content: "FMS has transformed how we manage our facilities. The complaint management system alone has reduced response time by 60%.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Operations Director",
      company: "Tech Hub",
      content: "The real-time tracking and task assignment features are game-changers. Our team productivity has increased significantly.",
      rating: 5
    },
    {
      name: "Lisa Wong",
      role: "HR Manager",
      company: "City Towers",
      content: "Payroll and attendance management is now seamless. The integration with GPS tracking ensures accurate attendance recording.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by leading organizations worldwide
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-xl">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ PRICING SECTION ============
const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "per month",
      features: [
        "Up to 500 units",
        "Basic complaint management",
        "Task assignment",
        "Email support",
        "Basic reports"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "per month",
      features: [
        "Up to 5,000 units",
        "Advanced complaint management",
        "Task tracking with SLA",
        "GPS tracking",
        "Attendance management",
        "Priority support",
        "Advanced analytics"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Unlimited units",
        "All features included",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "On-premise deployment",
        "Custom development"
      ],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for your organization
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-xl shadow-lg overflow-hidden ${plan.recommended ? 'ring-2 ring-blue-600 transform scale-105' : ''}`}>
              {plan.recommended && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`block text-center py-3 rounded-lg transition-colors ${
                    plan.recommended 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ CTA SECTION ============
const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Facility Management?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of organizations using FMS to streamline their operations
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/register" 
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
          <Link 
            to="/contact" 
            className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};

// ============ FOOTER COMPONENT ============
const PublicFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">F</span>
              </div>
              <span className="text-xl font-bold text-white">FMS Enterprise</span>
            </div>
            <p className="text-gray-400 mb-4">
              Complete facility management solution for modern organizations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.083-11.856c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.98 0 1.778-.773 1.778-1.729V1.729C24 .774 23.203 0 22.225 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@fmsenterprise.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Business Ave, Suite 100<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FMS Enterprise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Home;