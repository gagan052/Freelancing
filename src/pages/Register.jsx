import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'freelancer',
    disability: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    register(formData);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <Input
          label="Full Name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div>
          <label className="label">I am a</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`p-4 rounded-lg border ${
                formData.userType === 'freelancer'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onClick={() => setFormData({ ...formData, userType: 'freelancer' })}
            >
              <h3 className="font-semibold dark:text-white">Freelancer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">I want to find work</p>
            </button>
            <button
              type="button"
              className={`p-4 rounded-lg border ${
                formData.userType === 'client'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onClick={() => setFormData({ ...formData, userType: 'client' })}
            >
              <h3 className="font-semibold dark:text-white">Client</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">I want to hire</p>
            </button>
          </div>
        </div>

        {formData.userType === 'freelancer' && (
          <Input
            label="Disability Type (Optional)"
            type="text"
            value={formData.disability}
            onChange={(e) => setFormData({ ...formData, disability: e.target.value })}
            placeholder="Share if you're comfortable"
          />
        )}

        <Input
          label="Password"
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <Input
          label="Confirm Password"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />

        <Button type="submit" className="w-full">
          Create Account
        </Button>

        <p className="text-center text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-500">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register; 