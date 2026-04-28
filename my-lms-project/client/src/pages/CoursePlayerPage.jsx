// src/pages/CoursePlayerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const IconBack = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const IconPlay = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;

function CoursePlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/courses/${id}/content`);
        setCourse(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load content.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseContent();
  }, [id]);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-400 bg-slate-900">Loading...</div>;
  if (error) return <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6"><h1 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h1><Link to="/dashboard" className="bg-blue-600 px-6 py-3 rounded-lg font-bold">Back to Dashboard</Link></div>;

  const activeLesson = course?.lessons?.[activeLessonIndex];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* LEFT: Video Player Section */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <IconBack /> Back to Dashboard
          </button>
          <h1 className="font-bold text-gray-200 hidden md:block">{course.title}</h1>
        </div>

        {/* VIDEO CONTAINER */}
        <div className="flex-1 bg-black w-full flex items-center justify-center aspect-video md:aspect-auto">
          {activeLesson ? (
            // Logic to check if the video is local, Cloudinary, or an mp4 file
            activeLesson.videoUrl?.includes('localhost:5000') || activeLesson.videoUrl?.includes('cloudinary.com') || activeLesson.videoUrl?.includes('.mp4') ? (
              <video 
                key={activeLesson.videoUrl} 
                src={activeLesson.videoUrl}
                controls 
                autoPlay
                className="w-full h-full max-h-screen outline-none bg-black"
                controlsList="nodownload" 
                preload="auto"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe 
                src={getEmbedUrl(activeLesson.videoUrl)} 
                title={activeLesson.title}
                className="w-full h-full max-h-screen"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            )
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <IconPlay />
              <p className="mt-2">No video selected</p>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-8 bg-slate-900">
          <h2 className="text-3xl font-black mb-2">{activeLesson?.title || 'Course Overview'}</h2>
          <p className="text-slate-400 text-sm mb-6">Lesson {activeLessonIndex + 1} of {course.lessons?.length || 0} • {activeLesson?.duration || '0:00'}</p>
          
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <h3 className="font-bold text-blue-400 mb-2">Instructor Notes</h3>
            <p className="text-slate-300 leading-relaxed">
              Take detailed notes during this lesson. Ensure you understand the core concepts before moving on to the next section.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Course Curriculum Sidebar */}
      <div className="w-full md:w-96 bg-slate-950 border-l border-slate-800 flex flex-col h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">Course Content</h2>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-4">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${((activeLessonIndex + 1) / (course.lessons?.length || 1)) * 100}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">{activeLessonIndex + 1} / {course.lessons?.length || 0} completed</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {course.lessons && course.lessons.map((lesson, index) => (
            <button
              key={lesson._id || index}
              onClick={() => setActiveLessonIndex(index)}
              className={`w-full text-left p-4 rounded-xl flex items-start gap-4 transition-all ${
                activeLessonIndex === index 
                  ? 'bg-blue-600/20 border border-blue-500/50 text-blue-400' 
                  : 'bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-transparent'
              }`}
            >
              <div className={`mt-0.5 ${activeLessonIndex === index ? 'text-blue-400' : 'text-slate-500'}`}>
                 <IconPlay />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm ${activeLessonIndex === index ? 'text-white' : ''}`}>{lesson.title}</h4>
                <p className="text-xs opacity-60 mt-1">{lesson.duration || 'Video'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursePlayerPage;