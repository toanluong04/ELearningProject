// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Icons
const IconDashboard = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const IconBook = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const IconUsers = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconChat = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const IconSettings = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>;
const IconTrash = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, revenue: 0, chartData: [] });
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  
  // Chat States
  const [activeUsersList, setActiveUsersList] = useState([]); 
  const [adminChat, setAdminChat] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null); 
  const [adminReply, setAdminReply] = useState('');

  const [homeSettings, setHomeSettings] = useState({ heroTitle: '', heroSubtitle: '' });
  const [isEditing, setIsEditing] = useState(null); 
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({ 
    title: '', category: '', description: '', price: '', imageUrl: '', lessons: [] 
  });

  useEffect(() => {
    fetchData();
    
    if (activeTab === 'support') {
      socket.emit('join_admin_room');
      socket.emit('get_active_users');
      
      socket.on('active_users_list', (list) => {
        setActiveUsersList(list);
      });

      if (activeChatUser) {
        socket.emit('fetch_messages', activeChatUser);
      }

      socket.on('load_history', (history) => {
        const formatted = history.map(m => ({
          ...m,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setAdminChat(formatted);
      });

      socket.on('receive_message', (data) => {
        if (data.senderId === activeChatUser || data.receiverId === activeChatUser) {
          setAdminChat((prev) => [...prev, data]);
        }
      });
    }
    
    return () => {
      socket.off('active_users_list');
      socket.off('receive_message');
      socket.off('load_history');
    };
  }, [activeTab, activeChatUser]);

  const fetchData = async () => {
    try {
      if (activeTab === 'overview') {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } else if (activeTab === 'courses') {
        const res = await api.get('/courses/featured');
        setCourses(res.data || []);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data || []);
      } else if (activeTab === 'settings') {
        const res = await api.get('/settings/home');
        setHomeSettings(res.data || { heroTitle: '', heroSubtitle: '' });
      }
    } catch (err) { console.error("Fetch failed", err); }
  };

  const handleAdminReply = (e) => {
    e.preventDefault();
    if (!adminReply || !activeChatUser) return;
    const msgData = {
      senderId: 'admin',
      senderName: 'Admin Support',
      receiverId: activeChatUser,
      text: adminReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socket.emit('send_message', msgData);
    setAdminChat((prev) => [...prev, msgData]);
    setAdminReply('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = async () => {
      if (img.width !== 600 || img.height !== 400) {
        alert(`WARNING: Image must be EXACTLY 600x400 pixels.\n\nYour image is ${img.width}x${img.height} pixels. Please resize it before uploading.`);
        e.target.value = ""; 
        return;
      }

      setIsUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append('image', file); 

      try {
        const res = await api.post('/courses/upload-image', uploadData, { headers: { 'Content-Type': 'multipart/form-data' }});
        setFormData({ ...formData, imageUrl: res.data.imageUrl }); 
      } catch (err) {
        alert("Image upload failed. Please try again.");
      } finally {
        setIsUploadingImage(false);
      }
    };
  };

  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    // Safely turn on the loading spinner for THIS specific lesson
    setFormData(prev => {
      const newLessons = [...prev.lessons];
      newLessons[index].isUploading = true;
      return { ...prev, lessons: newLessons };
    });

    const uploadData = new FormData();
    uploadData.append('video', file);

    try {
      const res = await api.post('/courses/upload-video', uploadData, { headers: { 'Content-Type': 'multipart/form-data' }});
      
      // Safely save the URL when it finishes
      setFormData(prev => {
        const finalLessons = [...prev.lessons];
        finalLessons[index].videoUrl = res.data.videoUrl;
        finalLessons[index].isUploading = false;
        return { ...prev, lessons: finalLessons };
      });
    } catch (err) {
      alert("Video upload failed! The file might be too large.");
      setFormData(prev => {
        const revertLessons = [...prev.lessons];
        revertLessons[index].isUploading = false;
        return { ...prev, lessons: revertLessons };
      });
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert("Please upload a course thumbnail first!");
        return;
    }
    try {
      if (isEditing) await api.put(`/courses/${isEditing}`, formData);
      else await api.post('/courses', formData);
      setIsEditing(null);
      resetForm();
      fetchData();
    } catch (err) { alert("Error saving course"); }
  };

  const deleteCourse = async (id) => { if (window.confirm("Delete course?")) { await api.delete(`/courses/${id}`); fetchData(); } };
  const resetForm = () => setFormData({ title: '', category: '', description: '', price: '', imageUrl: '', lessons: [] });
  const addLesson = () => setFormData({ ...formData, lessons: [...(formData.lessons || []), { title: '', videoUrl: '', duration: '', isUploading: false }] });
  const updateLesson = (index, field, value) => {
    const updatedLessons = [...formData.lessons];
    updatedLessons[index][field] = value;
    setFormData({ ...formData, lessons: updatedLessons });
  };
  const removeLesson = (index) => setFormData({ ...formData, lessons: formData.lessons.filter((_, i) => i !== index) });

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to completely delete this student?")) {
      try {
        await api.delete(`/admin/users/${id}`); 
        fetchData(); 
      } catch (err) {
        alert("Failed to delete user.");
        console.error(err);
      }
    }
  };
  
  const filteredUsers = (users || []).filter(u => u.username?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10 sticky top-0 h-screen">
        <div className="p-6 text-2xl font-bold tracking-tight border-b border-slate-800">Admin<span className="text-blue-500">Panel</span></div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><IconDashboard /> Overview</button>
          <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><IconBook /> Manage Courses</button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><IconUsers /> Manage Users</button>
          <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'support' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><IconChat /> Support Center</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><IconSettings /> Site Settings</button>
        </nav>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{ t: 'Students', v: stats.users, c: 'bg-indigo-500' }, { t: 'Courses', v: stats.courses, c: 'bg-emerald-500' }, { t: 'Enrollments', v: stats.enrollments, c: 'bg-amber-500' }, { t: 'Revenue', v: `$${stats.revenue}`, c: 'bg-rose-500' }].map((s, i) => (
                <div key={i} className={`${s.c} rounded-2xl p-6 text-white shadow-lg`}><p className="text-sm opacity-80 uppercase font-black">{s.t}</p><p className="text-4xl font-black mt-2">{s.v || 0}</p></div>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-2xl border shadow-sm mt-8 h-[400px]">
              <h3 className="font-bold text-gray-700 mb-4">Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="Revenue" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2. COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <h3 className="text-2xl font-black mb-8">{isEditing ? 'Update Course' : 'Create New Course'}</h3>
              <form onSubmit={handleCourseSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Course Title" className="border p-4 rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  <input type="text" placeholder="Category" className="border p-4 rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
                <textarea placeholder="Description" className="border p-4 rounded-xl w-full h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Price ($)" className="border p-4 rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl bg-gray-50 flex flex-col justify-center relative overflow-hidden">
                       <label className="text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Course Thumbnail (600x400 Only)</label>
                       
                       <input 
                         type="file" 
                         accept="image/*" 
                         onChange={handleImageUpload} 
                         disabled={isUploadingImage}
                         className="text-sm z-10 relative cursor-pointer" 
                       />
                       
                       {isUploadingImage && <p className="text-xs text-blue-500 mt-2 font-bold animate-pulse">Uploading to server...</p>}
                       {!isUploadingImage && formData.imageUrl && <p className="text-xs text-emerald-500 mt-2 font-bold flex items-center gap-1">✓ Local Image Saved Successfully!</p>}
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border">
                  <div className="flex justify-between mb-4"><h4 className="font-bold">Lessons</h4><button type="button" onClick={addLesson} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs">+ Add Lesson</button></div>
                  <div className="space-y-4">
                    {(formData.lessons || []).map((lesson, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border flex flex-col gap-3">
                        <div className="flex justify-between">
                          <input type="text" placeholder="Lesson Title" className="font-bold flex-1 border-b pb-1 outline-none" value={lesson.title} onChange={e => updateLesson(idx, 'title', e.target.value)} />
                          <button type="button" onClick={() => removeLesson(idx)} className="text-red-400"><IconTrash /></button>
                        </div>
                        
                        {/* THE FIX: Disabling input and showing feedback */}
                        <input type="file" accept="video/*" className="text-xs" onChange={e => handleVideoUpload(idx, e.target.files[0])} disabled={lesson.isUploading} />
                        
                        {lesson.isUploading && <p className="text-xs text-blue-500 font-bold animate-pulse">Uploading video to cloud (this might take a minute)...</p>}
                        {!lesson.isUploading && lesson.videoUrl && <p className="text-xs text-emerald-500 font-bold truncate">✓ Video Saved to Cloud!</p>}
                        
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* THE FIX: Submit button check */}
                <button 
                  disabled={isUploadingImage || (formData.lessons || []).some(l => l.isUploading)} 
                  className={`w-full py-4 rounded-2xl font-black text-white ${isUploadingImage || (formData.lessons || []).some(l => l.isUploading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isUploadingImage || (formData.lessons || []).some(l => l.isUploading) ? 'Uploading Files...' : 'Save Course'}
                </button>
              </form>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(courses || []).map(c => (
                    <div key={c._id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col">
                        <img src={c.imageUrl} className="h-32 w-full object-cover rounded-xl mb-4" alt="" />
                        <h4 className="font-bold text-gray-900 flex-1">{c.title}</h4>
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={() => {setIsEditing(c._id); setFormData(c); window.scrollTo(0,0);}} className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1 rounded-lg">Edit</button>
                            <button onClick={() => deleteCourse(c._id)} className="text-red-400 bg-red-50 p-2 rounded-lg"><IconTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* 3. USERS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
             <h2 className="text-3xl font-black text-gray-800">Students</h2>
             <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b"><tr><th className="p-5 uppercase text-xs font-black text-gray-500">User</th><th className="p-5 text-right font-black uppercase text-xs text-gray-500">Action</th></tr></thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map(u => (
                            <tr key={u._id} className="border-b last:border-0 hover:bg-slate-50 transition">
                                <td className="p-5 font-bold">{u.username} <br/><span className="text-xs font-normal text-gray-400">{u.email}</span></td>
                                <td className="p-5 text-right"><button onClick={() => deleteUser(u._id)} className="text-red-400 bg-red-50 p-2 rounded-lg"><IconTrash /></button></td>
                            </tr>
                        )) : <tr><td colSpan="2" className="p-10 text-center text-gray-400">No students found.</td></tr>}
                    </tbody>
                </table>
             </div>
          </div>
        )}

        {/* 5. SUPPORT */}
        {activeTab === 'support' && (
          <div className="h-[calc(100vh-120px)] flex bg-white rounded-3xl shadow-xl border overflow-hidden">
            <div className="w-80 border-r bg-slate-50 flex flex-col">
              <div className="p-6 border-b font-black text-xs uppercase text-slate-400 tracking-wider">Active Chats</div>
              
              <div className="flex-1 overflow-y-auto">
                {activeUsersList.length > 0 ? activeUsersList.map((user) => (
                  <button 
                    key={user._id}
                    onClick={() => setActiveChatUser(user._id)}
                    className={`w-full p-6 text-left border-b font-bold transition-all ${activeChatUser === user._id ? 'bg-white border-l-4 border-l-rose-500 text-gray-900 shadow-sm' : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    {user.senderName}
                    <p className="text-[10px] opacity-60 font-normal mt-1">ID: {user._id.substring(0, 8)}</p>
                  </button>
                )) : (
                  <p className="p-6 text-sm text-gray-400 italic">No active conversations.</p>
                )}
              </div>

            </div>
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b font-black flex justify-between items-center bg-white">
                <span>{activeChatUser ? 'Chat History' : 'Select a student to reply'}</span>
                {activeChatUser && <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Online</span></div>}
              </div>
              <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50">
                {adminChat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-4 rounded-2xl max-w-md shadow-sm ${msg.senderId === 'admin' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 rounded-tl-none'}`}>
                        <p className="text-[9px] font-black uppercase opacity-60 mb-1 tracking-wider">{msg.senderName}</p>
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        <p className="text-[8px] mt-2 text-right opacity-40">{msg.time}</p>
                      </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAdminReply} className="p-6 border-t flex gap-4 bg-white">
                <input 
                  type="text" 
                  placeholder={activeChatUser ? "Type your reply..." : "Waiting for selection..."} 
                  className="flex-1 bg-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition" 
                  value={adminReply} 
                  onChange={e => setAdminReply(e.target.value)} 
                  disabled={!activeChatUser}
                />
                <button type="submit" disabled={!activeChatUser} className={`px-8 rounded-xl font-black text-white transition ${activeChatUser ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' : 'bg-gray-300'}`}>SEND</button>
              </form>
            </div>
          </div>
        )}

        {/* 6. SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-white p-10 rounded-3xl border shadow-sm">
            <h2 className="text-3xl font-black mb-8 text-gray-800">Site branding</h2>
            <form onSubmit={(e) => { e.preventDefault(); api.put('/settings/home', homeSettings).then(() => alert('Saved successfully!')); }} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Homepage Hero Title</label>
                <input type="text" className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-indigo-500 transition" value={homeSettings.heroTitle} onChange={e => setHomeSettings({...homeSettings, heroTitle: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Homepage Hero Subtitle</label>
                <textarea className="w-full border-2 border-gray-100 p-4 rounded-xl h-32 outline-none focus:border-indigo-500 transition resize-none" value={homeSettings.heroSubtitle} onChange={e => setHomeSettings({...homeSettings, heroSubtitle: e.target.value})} />
              </div>
              <button className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black shadow-md hover:bg-indigo-700 transition">Update Settings</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;