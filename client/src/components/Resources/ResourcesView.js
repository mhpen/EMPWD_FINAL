import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, ExternalLink, Loader } from 'lucide-react';

const ResourcesView = () => {
   const [resources, setResources] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedVideo, setSelectedVideo] = useState(null);

   useEffect(() => {
      fetchResources();
   }, []);

   const fetchResources = async () => {
      try {
         const token = localStorage.getItem('token');
         const response = await axios.get('/api/resources', {
            headers: { Authorization: `Bearer ${token}` }
         });
         setResources(response.data.data || []);
         setError(null);
      } catch (err) {
         setError('Failed to load resources. Please try again later.');
         console.error('Error fetching resources:', err);
      } finally {
         setLoading(false);
      }
   };

   const openVideo = (videoId) => {
      setSelectedVideo(videoId);
   };

   const closeVideo = () => {
      setSelectedVideo(null);
   };

   if (loading) {
      return React.createElement('div', { 
         className: "flex items-center justify-center min-h-screen" 
      }, React.createElement(Loader, { 
         className: "w-8 h-8 animate-spin" 
      }));
   }

   if (error) {
      return React.createElement('div', { 
         className: "flex items-center justify-center min-h-screen" 
      }, React.createElement('div', { 
         className: "text-red-500" 
      }, error));
   }

   const renderResourceCard = (resource) => {
      return React.createElement('div', {
         key: resource._id,
         className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      }, [
         // Thumbnail Container
         React.createElement('div', {
            key: 'thumbnail',
            className: "relative aspect-video bg-gray-100"
         }, [
            resource.thumbnail && React.createElement('img', {
               key: 'thumb-img',
               src: resource.thumbnail,
               alt: resource.title,
               className: "w-full h-full object-cover"
            }),
            React.createElement('button', {
               key: 'play-button',
               onClick: () => openVideo(resource.vimeoId),
               className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity duration-300"
            }, React.createElement(Play, {
               className: "w-12 h-12 text-white"
            }))
         ]),
         // Content Container
         React.createElement('div', {
            key: 'content',
            className: "p-4"
         }, [
            React.createElement('h3', {
               key: 'title',
               className: "font-semibold text-lg mb-2"
            }, resource.title),
            React.createElement('p', {
               key: 'description',
               className: "text-gray-600 text-sm mb-4"
            }, resource.description),
            // Categories
            React.createElement('div', {
               key: 'categories',
               className: "flex flex-wrap gap-2 mb-4"
            }, resource.categories?.map((category, index) => 
               React.createElement('span', {
                  key: index,
                  className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
               }, category)
            )),
            // Watch Button
            React.createElement('button', {
               key: 'watch-button',
               onClick: () => openVideo(resource.vimeoId),
               className: "w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
            }, [
               React.createElement(Play, {
                  key: 'play-icon',
                  className: "w-4 h-4"
               }),
               'Watch Video'
            ])
         ])
      ]);
   };

   const renderVideoModal = () => {
      if (!selectedVideo) return null;

      return React.createElement('div', {
         className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      }, React.createElement('div', {
         className: "relative w-full max-w-4xl aspect-video"
      }, [
         React.createElement('button', {
            key: 'close-button',
            onClick: closeVideo,
            className: "absolute -top-10 right-0 text-white hover:text-gray-300"
         }, 'Close'),
         React.createElement('iframe', {
            key: 'video-iframe',
            src: `https://player.vimeo.com/video/${selectedVideo}?autoplay=1`,
            className: "w-full h-full rounded-lg",
            allow: "autoplay; fullscreen",
            allowFullScreen: true
         })
      ]));
   };

   return React.createElement('div', {
      className: "container mx-auto px-4 py-8"
   }, [
      React.createElement('h1', {
         key: 'title',
         className: "text-2xl font-bold mb-6"
      }, 'Training Resources'),
      
      React.createElement('div', {
         key: 'resources-grid',
         className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }, resources.map(renderResourceCard)),
      
      renderVideoModal(),
      
      resources.length === 0 && !loading && !error && 
         React.createElement('div', {
            key: 'empty-state',
            className: "text-center text-gray-500 py-12"
         }, 'No resources available at the moment.')
   ]);
};

export default ResourcesView; 