import { useState } from 'react';
import axios from 'axios';

const Login = () => {

   const [formData, setFormData] = useState({
      email: '',
      password: ''
   })

   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   }


   const handleSubmit =  async (e) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      try {
         const res = await axios.post('/api/auth/login', formData);
         setSuccess(res.data.message);
         console.log("succesfully logged");
      } catch (error) {
         console.error('Error registering user:', error);
         setError(error.response?.data?.message || 'Login failed');
      }
   }


   return (
      
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center mb-8">
            <i className="fas fa-cube text-2xl mr-2"></i>
            <span className="text-2xl font-semibold">LOGO</span>
          </div>
          <h2 className="text-3xl font-semibold mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-8">Please enter your login details below</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
               <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
               />
            </div>
            <div className="mb-4">
               <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
               />
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-gray-600">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded-lg font-semibold">
              SIGN IN
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Not registered yet?{" "}
              <a href="#" className="text-blue-600">
                Create account
              </a>
            </p>
          </div>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-20 h-10 border rounded-lg">
              <i className="fas fa-cube mr-2"></i> LOGO
            </button>
            <button className="flex items-center justify-center w-20 h-10 border rounded-lg">
              <i className="fas fa-cube mr-2"></i> LOGO
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-gray-200 flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-gray-300 flex items-center justify-center">
               <span className="text-gray-500">Image Placeholder</span>
            </div>
        </div>
      </div>
    </div>

   )
}

export default Login;