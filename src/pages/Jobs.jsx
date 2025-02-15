import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card3D } from '../components/animations/Card3D';

function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    location: [],
    experience: [],
    salary: []
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');

  const filters = {
    type: ['Full-time', 'Part-time', 'Contract', 'Remote'],
    location: ['Remote', 'Hybrid', 'On-site'],
    experience: ['Entry Level', 'Mid Level', 'Senior Level'],
    salary: ['$0-$50k', '$50k-$100k', '$100k+']
  };

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      logo: "https://replicate.delivery/pbxt/QWErtYUiOpAs123ZxCvB456NmLkJ789/logo.png",
      location: "Remote",
      type: "Full-time",
      salary: "$120k-$150k",
      posted: "2 days ago",
      applicants: 45,
      description: "We're looking for an experienced frontend developer with strong accessibility knowledge...",
      requirements: [
        "5+ years of React experience",
        "Strong understanding of WCAG guidelines",
        "Experience with assistive technologies",
        "TypeScript proficiency"
      ],
      benefits: [
        "Flexible work hours",
        "Health insurance",
        "Remote work options",
        "Professional development budget"
      ],
      tags: ["React", "TypeScript", "Accessibility", "WCAG"]
    },
    // Add more job listings...
  ];

  // Add filteredJobs state
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  // Create searchableFields array
  const searchableFields = ['title', 'company', 'description', 'tags'];

  // Implement search and filter logic using useMemo
  const searchedAndFilteredJobs = useMemo(() => {
    let results = [...jobs];

    // Search functionality
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      
      results = results.filter(job => {
        return searchTerms.every(term => {
          return searchableFields.some(field => {
            if (field === 'tags') {
              return job.tags.some(tag => tag.toLowerCase().includes(term));
            }
            return job[field].toLowerCase().includes(term);
          });
        });
      });
    }

    // Filter functionality
    Object.entries(selectedFilters).forEach(([category, selectedOptions]) => {
      if (selectedOptions.length > 0) {
        results = results.filter(job => {
          switch (category) {
            case 'type':
              return selectedOptions.includes(job.type);
            case 'location':
              return selectedOptions.includes(job.location);
            case 'experience':
              // Assuming job has an experience field
              return selectedOptions.includes(job.experience);
            case 'salary':
              // Implement salary range filtering
              return selectedOptions.some(range => {
                const [min, max] = range.replace('$', '').split('-').map(val => 
                  val.includes('k') ? parseInt(val) * 1000 : parseInt(val)
                );
                const jobSalary = parseInt(job.salary.replace(/[^0-9]/g, ''));
                return jobSalary >= min && (!max || jobSalary <= max);
              });
            default:
              return true;
          }
        });
      }
    });

    // Sorting functionality
    switch (sortBy) {
      case 'recent':
        results.sort((a, b) => new Date(b.posted) - new Date(a.posted));
        break;
      case 'salary':
        results.sort((a, b) => {
          const salaryA = parseInt(a.salary.replace(/[^0-9]/g, ''));
          const salaryB = parseInt(b.salary.replace(/[^0-9]/g, ''));
          return salaryB - salaryA;
        });
        break;
      case 'relevance':
      default:
        // If searching, sort by relevance score
        if (searchQuery.trim()) {
          const terms = searchQuery.toLowerCase().split(' ');
          results.sort((a, b) => {
            const scoreA = calculateRelevanceScore(a, terms);
            const scoreB = calculateRelevanceScore(b, terms);
            return scoreB - scoreA;
          });
        }
        break;
    }

    return results;
  }, [searchQuery, selectedFilters, sortBy, jobs]);

  // Helper function to calculate relevance score
  const calculateRelevanceScore = (job, searchTerms) => {
    let score = 0;
    searchTerms.forEach(term => {
      // Title matches are worth more
      if (job.title.toLowerCase().includes(term)) score += 3;
      // Tag matches are worth more than description
      if (job.tags.some(tag => tag.toLowerCase().includes(term))) score += 2;
      if (job.description.toLowerCase().includes(term)) score += 1;
    });
    return score;
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredJobs(searchedAndFilteredJobs);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchedAndFilteredJobs]);

  // Update the search input handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900 to-purple-800">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h1 className="text-5xl font-bold mb-4">Find Your Perfect Role</h1>
            <p className="text-xl text-purple-100">
              Discover opportunities that match your skills and accessibility needs
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <Card3D>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <motion.div
                    className={`absolute inset-0 bg-purple-500/5 rounded-lg transition-all duration-300 ${
                      isSearchFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search jobs, skills, or companies..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                      bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                    transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Jobs
                </motion.button>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card3D>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Filters</h2>
                {Object.entries(filters).map(([category, options]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 capitalize">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {options.map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedFilters[category].includes(option)}
                            onChange={(e) => {
                              setSelectedFilters(prev => ({
                                ...prev,
                                [category]: e.target.checked
                                  ? [...prev[category], option]
                                  : prev[category].filter(item => item !== option)
                              }));
                            }}
                            className="rounded border-gray-300 text-purple-600 
                              focus:ring-purple-500 dark:border-gray-600"
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card3D>
          </div>

          {/* Jobs List */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="recent">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                </select>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'grid' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' 
                        : 'text-gray-400'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'list' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' 
                        : 'text-gray-400'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredJobs.length} jobs found
              </p>
            </div>

            {/* Jobs Grid/List */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Card3D key={job.id}>
                    <motion.div
                      className="group bg-white dark:bg-gray-800 p-6 rounded-xl relative overflow-hidden"
                      whileHover={{ y: -5 }}
                    >
                      {/* Job Card Content */}
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 
                              flex items-center justify-center"
                            >
                              <img src={job.logo} alt="" className="w-8 h-8" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold dark:text-white">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                {job.company}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </motion.button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-sm rounded-full bg-purple-50 
                                dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.type}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 
                          border-t border-gray-100 dark:border-gray-700"
                        >
                          <div className="text-purple-600 dark:text-purple-400 font-semibold">
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {job.applicants} applicants
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {job.posted}
                            </span>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <motion.button
                          className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg 
                            hover:bg-purple-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveJob(job)}
                        >
                          Apply Now
                        </motion.button>
                      </div>
                    </motion.div>
                  </Card3D>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <div className="text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {activeJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
              flex items-center justify-center p-4"
            onClick={() => setActiveJob(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] 
                overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal content */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/30 
                      flex items-center justify-center"
                    >
                      <img src={activeJob.logo} alt="" className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold dark:text-white">
                        {activeJob.title}
                      </h2>
                      <p className="text-purple-600 dark:text-purple-400">
                        {activeJob.company}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveJob(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {activeJob.requirements.map((req) => (
                        <li key={req} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M5 13l4 4L19 7" />
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">
                      Benefits
                    </h3>
                    <ul className="space-y-2">
                      {activeJob.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 
                      dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setActiveJob(null)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Jobs; 