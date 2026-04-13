import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Edit2, Trash2, FileText, LayoutTemplate } from 'lucide-react';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/resumes');
        setResumes(response.data);
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await api.delete(`/resumes/${id}`);
        setResumes(resumes.filter(resume => resume._id !== id));
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    }
  };

  const handleCreateNew = async (theme = 'modern') => {
    try {
      const response = await api.post('/resumes', { title: `Untitled Resume (${theme})`, theme });
      navigate(`/builder/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern Theme', desc: 'Clean, bold, and contemporary design.', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400' },
    { id: 'elegant', name: 'Elegant Theme', desc: 'Sophisticated serif fonts and classic borders.', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400' },
    { id: 'professional', name: 'Professional Theme', desc: 'Compact and traditional format for corporate roles.', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Templates Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <LayoutTemplate size={24} className="text-blue-600" /> Start from a Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(tpl => (
              <div 
                key={tpl.id}
                onClick={() => handleCreateNew(tpl.id)}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-6 transition-all shadow-sm hover:shadow-md ${tpl.color}`}
              >
                <h3 className="text-xl font-bold mb-2">{tpl.name}</h3>
                <p className="text-sm opacity-90 mb-4">{tpl.desc}</p>
                <button className="flex items-center gap-2 font-semibold text-sm">
                  <Plus size={16} /> Create Resume
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 border-t border-gray-200 pt-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Resumes</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">No resumes yet</h2>
            <p className="text-gray-500">Pick a template above to create your first resume!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <div key={resume._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-50 border-b border-gray-100 relative opacity-90 overflow-hidden">
                  <div className="absolute inset-0 flex flex-col p-4 bg-gradient-to-b from-white/80 to-transparent">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{resume.theme || 'modern'} theme</span>
                    <div className="h-2 w-1/3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-1.5 w-full bg-gray-200 rounded mb-1.5"></div>
                    <div className="h-1.5 w-5/6 bg-gray-200 rounded mb-1.5"></div>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 truncate max-w-[180px]" title={resume.title}>{resume.title || 'Untitled Resume'}</h3>
                    <p className="text-xs text-gray-500">
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      to={`/builder/${resume._id}`}
                      className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(resume._id)}
                      className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
