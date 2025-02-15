import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

function Hire() {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    requirements: '',
    type: 'full-time',
    location: 'remote',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement job posting logic
    console.log('Job Data:', jobData);
    toast.success('Job posted successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Post a Job</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <Input
          label="Job Title"
          value={jobData.title}
          onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
          placeholder="e.g., Web Developer Needed for Accessible Website"
          required
        />

        <div>
          <label className="label">Job Description</label>
          <textarea
            className="input min-h-[150px]"
            value={jobData.description}
            onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            placeholder="Describe the job requirements, responsibilities, and any accessibility considerations..."
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Budget"
            type="text"
            value={jobData.budget}
            onChange={(e) => setJobData({ ...jobData, budget: e.target.value })}
            placeholder="e.g., $500-1000"
            required
          />

          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={jobData.category}
              onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              <option value="web-development">Web Development</option>
              <option value="content-writing">Content Writing</option>
              <option value="graphic-design">Graphic Design</option>
              <option value="virtual-assistance">Virtual Assistance</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Job Type</label>
            <div className="grid grid-cols-2 gap-4">
              {['full-time', 'part-time', 'contract', 'project'].map((type) => (
                <label
                  key={type}
                  className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer
                    ${jobData.type === type
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-600 dark:hover:border-purple-500'
                    }`}
                >
                  <input
                    type="radio"
                    name="jobType"
                    value={type}
                    checked={jobData.type === type}
                    onChange={(e) => setJobData({ ...jobData, type: e.target.value })}
                    className="sr-only"
                  />
                  <span className="capitalize">{type.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Location</label>
            <div className="grid grid-cols-2 gap-4">
              {['remote', 'on-site', 'hybrid'].map((loc) => (
                <label
                  key={loc}
                  className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer
                    ${jobData.location === loc
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-600 dark:hover:border-purple-500'
                    }`}
                >
                  <input
                    type="radio"
                    name="location"
                    value={loc}
                    checked={jobData.location === loc}
                    onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                    className="sr-only"
                  />
                  <span className="capitalize">{loc.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="label">Requirements</label>
          <textarea
            className="input min-h-[100px]"
            value={jobData.requirements}
            onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
            placeholder="List any specific requirements, skills, or qualifications needed..."
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="w-full md:w-auto">
            Post Job
          </Button>
        </div>
      </form>

      <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Tips for Inclusive Job Posting</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Be clear about workplace accommodations available</li>
          <li>Use inclusive and accessible language</li>
          <li>Focus on essential job functions</li>
          <li>Mention remote work possibilities</li>
          <li>Describe your commitment to accessibility</li>
        </ul>
      </div>
    </div>
  );
}

export default Hire; 