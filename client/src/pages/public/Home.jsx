// client/src/pages/public/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  FaBuilding, 
  FaTasks, 
  FaHeadset, 
  FaShieldAlt, 
  FaChartLine,
  FaMobileAlt,
  FaClock,
  FaUserCheck,
  FaArrowRight,
  FaStar,
  FaQuoteLeft,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaGithub
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: FaBuilding, title: 'Building Management', description: 'Efficiently manage multiple buildings, floors, and units with real-time monitoring.', color: 'from-blue-500 to-cyan-500' },
    { icon: FaTasks, title: 'Smart Task Assignment', description: 'AI-powered task allocation and tracking with SLA compliance.', color: 'from-purple-500 to-pink-500' },
    { icon: FaHeadset, title: '24/7 Customer Support', description: 'Round-the-clock support for all your facility management needs.', color: 'from-green-500 to-emerald-500' },
    { icon: FaShieldAlt, title: 'Security & Compliance', description: 'Enterprise-grade security with complete audit trails.', color: 'from-orange-500 to-red-500' },
    { icon: FaChartLine, title: 'Advanced Analytics', description: 'Real-time dashboards and comprehensive reports.', color: 'from-indigo-500 to-purple-500' },
    { icon: FaMobileAlt, title: 'Mobile Ready', description: 'Access your dashboard from any device, anywhere.', color: 'from-teal-500 to-cyan-500' }
  ];

  const stats = [
    { value: '500+', label: 'Buildings Managed', icon: FaBuilding },
    { value: '10K+', label: 'Tasks Completed', icon: FaTasks },
    { value: '98%', label: 'Customer Satisfaction', icon: FaUserCheck },
    { value: '24/7', label: 'Support Available', icon: FaClock }
  ];

  const testimonials = [
    {
      name: 'Ahmed Al Mansouri',
      role: 'Facility Manager',
      company: 'Dubai Properties',
      content: 'The FMS platform has transformed how we manage our properties. The automation and real-time tracking are game-changers.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'Sarah Johnson',
      role: 'Operations Director',
      company: 'Tech Hub LLC',
      content: 'Excellent platform with outstanding support. The reporting features give us complete visibility into our operations.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      name: 'Mohammed Rashid',
      role: 'CEO',
      company: 'Smart Facilities',
      content: 'Best investment we made for our facility management. The ROI has been incredible.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ==================== HEADER ==================== */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  FMS Enterprise
                </span>
                <span className="text-xs text-gray-500 block">Facility Management System</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
              {!user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <button className="px-5 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard">
                  <button className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all">
                    Go to Dashboard
                  </button>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HERO BANNER ==================== */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        
        {/* Animated Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-blue-800">Trusted by 500+ Companies</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Facility
                </span>
                <br />
                Management System
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Streamline your facility operations with our all-in-one platform. 
                Manage buildings, tasks, employees, and get real-time insights—all from a single dashboard.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {!user ? (
                  <>
                    <Link to="/register">
                      <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        Get Started Free
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all">
                        Watch Demo
                      </button>
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard">
                    <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      Go to Dashboard
                    </button>
                  </Link>
                )}
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-200">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i}.jpg`} alt={`User ${i}`} />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">1,000+</span> active users
                </div>
              </div>
            </motion.div>
            
            {/* Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs text-gray-400">dashboard.fms.com</div>
                </div>
                <img 
                  src="https://placehold.co/600x400/1e3a8a/ffffff?text=FMS+Dashboard+Preview" 
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-5 -right-5 bg-white rounded-xl shadow-lg p-3 animate-bounce">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">98% Uptime</span>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg p-3 animate-bounce delay-700">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span className="text-sm font-medium">4.9 Rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center text-white"
              >
                <div className="flex justify-center mb-3">
                  <stat.icon className="text-3xl opacity-80" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Facility Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your facilities efficiently and effectively
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by industry leaders worldwide
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-50 rounded-2xl p-6 relative hover:shadow-xl transition-shadow"
              >
                <FaQuoteLeft className="text-blue-200 text-3xl absolute top-6 right-6" />
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-xs text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Facility Management?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and start managing your facilities smarter today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link to="/register">
                    <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all">
                      Start Free Trial
                    </button>
                  </Link>
                  <Link to="/contact">
                    <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                      Contact Sales
                    </button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <button className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all">
                    Go to Dashboard
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <div>
                  <span className="text-xl font-bold">FMS Enterprise</span>
                  <span className="text-xs text-gray-400 block">Facility Management System</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Smart facility management solution for modern enterprises. Streamline operations, reduce costs, and improve efficiency.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaFacebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaLinkedin size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaInstagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaGithub size={20} /></a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API Reference</Link></li>
                <li><Link to="/status" className="text-gray-400 hover:text-white transition-colors">System Status</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                  <span className="text-sm">Dubai Silicon Oasis, Dubai, UAE</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <FaEnvelope />
                  <a href="mailto:info@fms.com" className="text-sm hover:text-white transition-colors">info@fms.com</a>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <FaPhone />
                  <a href="tel:+97142123456" className="text-sm hover:text-white transition-colors">+971 4 212 3456</a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 FMS Enterprise. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/cookies" className="text-gray-400 text-sm hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;