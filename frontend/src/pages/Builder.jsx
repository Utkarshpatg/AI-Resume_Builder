import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import api from '../services/api';
import { Save, Download, ArrowLeft } from 'lucide-react';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState({
    title: 'My Resume',
    personalInfo: { firstName: '', lastName: '', email: '', phone: '', address: '', linkedIn: '', github: '', portfolio: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) { setLoading(false); return; }
      try {
        const response = await api.get(`/resumes/${id}`);
        setResume(response.data);
      } catch (error) {
        console.error('Failed to fetch resume:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id) {
        await api.put(`/resumes/${id}`, resume);
      } else {
        const res = await api.post('/resumes', resume);
        navigate(`/builder/${res.data._id}`);
      }
      // Show success toast or notification here
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      setSaving(true);
      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      
      const element = document.getElementById('resume-preview-content');
      
      // Temporarily set a fixed width for perfect rendering
      const originalStyle = element.style.cssText;
      element.style.width = '816px'; 
      element.style.minHeight = '1056px';

      const dataUrl = await toPng(element, { 
        quality: 1.0, 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      element.style.cssText = originalStyle;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.title || 'Resume'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex-none bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <input 
            type="text" 
            value={resume.title} 
            onChange={(e) => setResume({...resume, title: e.target.value})}
            className="text-xl font-bold text-gray-800 border-none outline-none bg-transparent hover:bg-gray-50 px-2 py-1 rounded w-64"
            placeholder="Resume Title"
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-medium"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={handleDownload} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Form Section - Scrollable */}
        <div className="w-full md:w-1/2 flex-1 overflow-y-auto p-6 bg-white border-r">
          <ResumeForm resume={resume} setResume={setResume} />
        </div>

        {/* Preview Section - Scrollable */}
        <div className="w-full md:w-1/2 flex-1 overflow-y-auto p-8 bg-gray-100 flex justify-center items-start border-l border-gray-200 shadow-inner">
          <div className="resume-preview-container max-w-full w-full mx-auto pb-10" style={{ maxWidth: '800px' }}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
