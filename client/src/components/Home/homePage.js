import React from 'react';
import { Link } from "react-router-dom";
//import logo from "../../assets/logo3.png";

const HomePageComponent = () => {
   const [isOpen, setIsOpen] = React.useState(false);

   const JobCard = ({ title, company, rating, description, logoUrl }) => (
         <div className="border rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-4">
               <img src={logoUrl} alt="Company logo" className="w-16 h-16 mr-4" style={{ borderRadius: '2px' }}/>
               <div>
                  <h2 className="text-xl font-semibold">{title}</h2>
                  <p className="text-gray-600">{company} {rating} Ratings</p>
               </div>
            </div>
            <p className="text-gray-700 text-sm">
               {description}
            </p>
         </div>
   );



   return (
      <div className="min-h-screen bg-white">
         <header className="flex justify-between items-center p-6">
            <div className="flex items-center space-x-4">
               <div className="flex items-center">
                     {/* <img src={logo} alt="logo" className="w-10 h-10 mr-1 ml-2" /> */}
                     <span className="ml-2 text-xl font-semibold">EmpowerPWD</span>
               </div>
               <div className="border-r border-black h-6 mr-4 hidden md:block"></div>
               <nav className="hidden md:flex space-x-8 ml-8">
                     <Link to="/" className="text-gray-600 hover:text-black">Home</Link>
                     <a href="#" className="text-gray-600 hover:text-black">Explore Jobs</a>
                     <a href="#" className="text-gray-600 hover:text-black">Explore Companies</a>
                     <a href="#" className="text-gray-600 hover:text-black">Resources</a>
               </nav>
            </div>
            <div className="hidden md:block">
               <Link to="/login" className="text-gray-600 hover:text-black">Login</Link>
            </div>
            <div className="md:hidden">
               <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-black focus:outline-none">
                     <i className="fas fa-bars text-2xl"></i>
               </button>
            </div>
         </header>
         {isOpen && (
            <div className="md:hidden">
               <nav className="flex flex-col space-y-4 p-4">
                     <Link to="/" className="text-gray-600 hover:text-black">Home</Link>
                     <a href="#" className="text-gray-600 hover:text-black">Explore Jobs</a>
                     <a href="#" className="text-gray-600 hover:text-black">Explore Companies</a>
                     <a href="#" className="text-gray-600 hover:text-black">Resources</a>
                     <Link to="/login" className="text-gray-600 hover:text-black">Login</Link>
               </nav>
            </div>
         )}
         <main className="flex flex-col items-center text-center mt-10">
            <h1 className="text-2xl md:text-5xl font-bold mb-4">Empowering Abilities,<br />Creating Opportunities.</h1>
            <p className="text-sm md:text-base text-gray-600">Connecting Persons with Disabilities to Inclusive Employers for Meaningful Career Opportunities.</p>
            <div className="flex flex-col items-center justify-center bg-white mt-4">
               <div className="flex flex-row space-x-2 md:space-x-4 mb-11">
                     <Link to="/login" className="px-3 py-1 md:px-4 md:py-2 bg-black text-white rounded-full text-sm md:text-base">FIND WORK</Link>
                     <Link to="/login" className="px-3 py-1 md:px-4 md:py-2 border border-black text-black rounded-full text-sm md:text-base">POST JOB</Link>
               </div>
               <div className="relative flex justify-center items-center">
                     <div className="w-[550px] h-[320px] bg-gray-300 rounded-lg flex items-center justify-center z-10">
                        <div className="w-full h-full border border-black">
                           <img className="w-full h-full object-cover " src="" alt="Main placeholder image" /></div>
                     </div>

                     {/* Left Image (400x350) */}
                     <div className="absolute left-0 transform -translate-x-3/4 -translate-y-1/4 w-[400px] h-[320px] bg-gray-300 rounded-lg flex items-center justify-center z-20">
                        <div className="w-full h-full border border-black">
                           <img className="w-full h-full object-cover " src="" alt="Main placeholder image" />
                           </div>
                     </div>

                     {/* Right Image (400x350) */}
                     <div className="absolute right-0 transform translate-x-3/4 -translate-y-1/4 w-[400px] h-[320px] bg-gray-300 rounded-lg flex items-center justify-center z-20">
                        <div className="w-full h-full border border-black ">
                           <img className="w-full h-full object-cover " src="" alt="Main placeholder image" /></div>
                     </div>
               </div>
            </div>
         
            <section className="flex flex-col items-center md:flex-row md:justify-between bg-white p-14 min-h-screen">
               <div className="w-full md:w-1/3">
                     <img src="https://placehold.co/200x200" alt="About Us Image" className="w-full h-auto rounded-lg" />
               </div>
               <div className="w-full md:w-2/3 mt-8 md:mt-0 md:ml-8 text-center md:text-left">
                     <h2 className="text-4xl font-bold mb-6">About Us</h2>
                     <p className="text-gray-700 mb-4 text-justify">
                        EmpowerPWD is dedicated to bridging the gap between persons with disabilities and companies that embrace diversity and inclusion. Our platform provides job seekers with opportunities tailored to their skills while supporting employers in building inclusive workforces. By partnering with progressive organizations, we work to eliminate barriers that have limited the potential of persons with disabilities in the workplace.
                     </p>
                     <p className="text-gray-700 mb-4 text-justify">
                        Beyond job placement, we offer resources aimed at career development and mentorship. Our programs include workshops on resume writing and interview techniques to help job seekers become competitive in the job market. We advocate for inclusive policies and accessible workplaces, ensuring that individuals with disabilities have the support they need to succeed in their careers.
                     </p>
                     <p className="text-gray-700 mb-4 text-justify">
                        At EmpowerPWD, we understand the importance of community. Our platform encourages interaction and networking, fostering a culture that values diversity and inclusion. Together, we can create a future where everyone has the opportunity to thrive and contribute their unique talents to the workforce, empowering individuals and organizations to reach their full potential.
                     </p>
                     <button className="bg-black text-white py-2 px-4 rounded">Learn More</button>
               </div>
            </section>

            <section className="mt-10 text-center bg-gray-100 p-8 min-h-screen">
               <h2 className="text-3xl font-bold mb-10 mt-12">How it Works?</h2>
               <div className="text-center mb-8">
                     <h3 className="text-xl font-semibold">Job Seekers</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div>
                        <div className="flex flex-col items-center">
                           <i className="fas fa-user-plus fa-3x mb-4"></i>
                           <h4 className="font-semibold">Create profile</h4>
                           <p className="text-gray-600">Sign up and showcase your skills and experience.</p>
                        </div>
                     </div>
                     <div>
                        <div className="flex flex-col items-center">
                           <i className="fas fa-briefcase fa-3x mb-4"></i>
                           <h4 className="font-semibold">Find Jobs</h4>
                           <p className="text-gray-600">Browse a wide range of accessible job listings tailored to your needs.</p>
                        </div>
                     </div>
                     <div>
                        <div className="flex flex-col items-center">
                           <i className="fas fa-paper-plane fa-3x mb-4"></i>
                           <h4 className="font-semibold">Apply</h4>
                           <p className="text-gray-600">Submit your application directly to employers who value diversity.</p>
                        </div>
                     </div>
               </div>

               <div className="text-center mt-16 mb-8">
                     <h3 className="text-xl font-semibold">Employers</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div>
                        <div className="flex flex-col items-center">
                           <i className="fas fa-user-check fa-3x mb-4"></i>
                           <h4 className="font-semibold">Register</h4>
                           <p className="text-gray-600">Join our platform as an inclusive employer.</p>
                        </div>
                     </div>
                     <div>
                        <div className="flex flex-col items-center">
                           <i className="fas fa-bullhorn fa-3x mb-4"></i>
                           <h4 className="font-semibold">Post Jobs</h4>
                           <p className="text-gray-600">Advertise your job openings with accessibility details.</p>
                        </div>
                     </div>
                     <div>
                        <div className="flex flex-col items-center">
                           <i className="fas fa-users fa-3x mb-4"></i>
                           <h4 className="font-semibold">Hire Talent</h4>
                           <p className="text-gray-600">Connect with skilled candidates committed to making a difference.</p>
                        </div>
                     </div>
               </div>
            </section>

            <section className="mt-10 text-center bg-white p-20  min-h-screen">
               <h2 className="text-4xl font-bold mb-12 ">Featured Jobs</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-justify">
                     <JobCard 
                        title="Driver" 
                        company="Netflix" 
                        rating="4.6" 
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        logoUrl="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
                     />


                     <JobCard 
                        title="Software Engineer" 
                        company="Google LLC" 
                        rating="4.8" 
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        logoUrl="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
                     />
                     <JobCard 
                        title="Product Manager" 
                        company="Apple Inc." 
                        rating="4.7" 
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        logoUrl="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" 
                     />
                     <JobCard 
                        title="Marketing Specialist" 
                        company="Amazon Inc." 
                        rating="4.5" 
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        logoUrl="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                     />
                     <JobCard 
                        title="Data Scientist" 
                        company="Facebook Inc." 
                        rating="4.6" 
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        logoUrl="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
                     />
                     <JobCard 
                        title="UX Designer" 
                        company="Microsoft Corp." 
                        rating="4.4" 
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        logoUrl="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
                     />
               </div>
               <div className="flex justify-center mt-8">
                     <button className="px-6 py-2 border border-black rounded-full text-gray-700 hover:bg-black hover:text-white">Show More</button>
               </div>

            </section>
            <section class="bg-gray-100 flex flex-col justify-center items-center w-full min-h-screen">
               <h1 class="text-4xl font-bold mb-20 mt-12">Feedbacks</h1>
               <div class="flex flex-wrap justify-center gap-10 w-full px-10">
                     <div class="bg-white border border-black rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col items-center pt-10 relative mb-10 h-80">
                        <img alt="Picture of Mhark Pentino" class="w-20 h-20 rounded-full absolute top-[-40px] object-cover" src="https://storage.googleapis.com/a1aa/image/LiFzXzqN9bonGdP1kELZ121J9CxB8amPahGFVD2VHPeJnn0JA.jpg" />
                        <h2 class="text-lg font-bold mt-12 mb-1">Mhark Pentino</h2>
                        <p class="text-sm text-gray-600 mb-4">Employer</p>
                        <div class="flex justify-center mt-2 mb-2">
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star-half-alt text-yellow-500"></i>
                        </div>
                        <p class="text-sm text-gray-700 text-center px-4 mb-4">"Great work! Very professional and timely. Highly recommended."</p>
                     </div>

                     <div class="bg-white border border-black rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col items-center pt-10 relative mb-10 h-80">
                        <img alt="Picture of Roberto Jr. Velasco" class="w-20 h-20 rounded-full absolute top-[-40px] object-cover" src="https://storage.googleapis.com/a1aa/image/yGUHyAyWmvrSGZVISgDxQJ5XxolYgCMKKpLpR3pXxqCkzT6E.jpg" />
                        <h2 class="text-lg font-bold mt-12 mb-1">Roberto Jr. Velasco</h2>
                        <p class="text-sm text-gray-600 mb-4">Employer</p>
                        <div class="flex justify-center mt-2 mb-2">
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                        </div>
                        <p class="text-sm text-gray-700 text-center px-4 mb-4">"Excellent service and communication. Will hire again."</p>
                     </div>

                     <div class="bg-white border border-black rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col items-center pt-10 relative mb-10 h-80">
                        <img alt="Picture of Adrian Perce" class="w-20 h-20 rounded-full absolute top-[-40px] object-cover" src="https://storage.googleapis.com/a1aa/image/AtxmVi1HiwoHPBmKv12umtV3cqZzjENVvcKVVL5VdTUkzT6E.jpg" />
                        <h2 class="text-lg font-bold mt-12 mb-1">Adrian Perce</h2>
                        <p class="text-sm text-gray-600 mb-4">Employer</p>
                        <div class="flex justify-center mt-2 mb-2">
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star text-yellow-500"></i>
                           <i class="fas fa-star-half-alt text-yellow-500"></i>
                        </div>
                        <p class="text-sm text-gray-700 text-center px-4 mb-4">"Very satisfied with the results. Great attention to detail."</p>
                     </div>
               </div>
               </section>
               <section  class="min-h-screen bg-white justify-between mt-20 w-full">
                     <div class="block ">
                     <div class="flex flex-col lg:flex-row items-center justify-between ">
                        <div class="mb-10 lg:mb-0 text-left ml-20 mt-20 justify-start w-full mr-6">
                        <h1 class="text-4xl text-Left text-black mb-5 mt-20">
                        Join us today and start your journey toward a more inclusive workforce!
                        </h1>
                        <Link to="/RegisterjobSeeker" class="px-4 py-2 border border-black rounded-full text-black hover:bg-black hover:text-white">
                        SIGN UP AS JOB SEEKER
                        </Link>
                        </div>
                        <div class=" flex justify-center w-full ">
                           <img 
                                 alt="Placeholder image for job seekers" 
                                 class="w-[600px] max-h-[500px] h-[500px] bg-slate-300" 
                                 src="" 
                           />
                        </div>

                     </div>
                  
                     <div class="flex flex-col lg:flex-row items-center justify-between mb-20 ">
                        <div class="lg:w-2/5 flex justify-center order-2 lg:order-1 mb-10 lg:mb-0">
                           <img alt="Placeholder image for employers" class="w-[400px] max-h-[500px] h-[400px] ml-20 bg-slate-400" height="300" src="" width="600"/>
                        </div>
                        <div class="lg:w-3/5 text-right order-1 lg:order-2 mr-20 ">
                        <h1 class="text-4xl text-black mb-5 mt-20">
                        Looking to hire diverse talent?  
                        </h1>
                        <h1 class="text-4xl text-black mb-5">
                           Become an inclusive employer with EmpowerPWD!
                        </h1>
                        
                        <p class="text-xl text-black mb-5">
   
                        </p>
                        <Link to="/create-employer" class="px-5 py-2 border border-black rounded-full text-black mb-10 hover:bg-black hover:text-white">
                        SIGN UP AS EMPLOYER
                        </Link>
                        </div>
                     </div>
                     </div>
               </section>
               <footer class="bg-[#9C9C9C] text-white w-full">
                     <div class="container mx-auto mt-6 px-4">
                        <div class="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-16 w-full md:w-auto text-left ml-8">
                           <div class="flex items-center mb-8 md:mb-0 flex-1  space-x-2 mt-12  text-5xl">
                                 <i className="fas fa-cube "></i>
                                    <span className="text-xl font-semibold ">EmpowerPWD</span>
                           </div>
                           <div class="flex-1 ">
                                 <h3 class="font-bold mb-2">Sign Up</h3>
                                 <ul>
                                    <li class="mb-1">Home</li>
                                    <li class="mb-1">About</li>
                                    <li class="mb-1">How it Works</li>
                                    <li class="mb-1">FAQ</li>
                                 </ul>
                           </div>
                           <div class="flex-1">
                                 <h3 class="font-bold mb-2">Social Media</h3>
                                 <ul>
                                    <li class="mb-1">Facebook</li>
                                    <li class="mb-1">Twitter</li>
                                    <li class="mb-1">LinkedIn</li>
                                    <li class="mb-1">Instagram</li>
                                 </ul>
                           </div>
                           <div class="flex-1">
                                 <h3 class="font-bold mb-2">Connect With Us</h3>
                                 <ul>
                                    <li class="mb-1"><i class="fas fa-map-marker-alt mr-2"></i>1234 Kunwari St. Brgy. Marawoy, Lipa City, Batangas</li>
                                    <li class="mb-1"><i class="fas fa-phone mr-2"></i>09123456789</li>
                                    <li class="mb-1"><i class="fas fa-envelope mr-2"></i>empowerpwd@gmail.com</li>
                                 </ul>
                           </div>
                        </div>             
                     <div class="w-full">
                        <hr class="border-white my-8 w-full"></hr>
                           </div>
                                 <div class="text-center mt-8  mb-8">
                           <p>© 2024 All Rights Reserved.</p>
                        </div>
                     </div>
               </footer>        
         </main>
      </div>
   )

}

export default HomePageComponent;