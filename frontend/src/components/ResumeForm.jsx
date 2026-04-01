import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ResumeForm = ({ resume, setResume }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const [targetRole, setTargetRole] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleAutoFill = async () => {
    if (!targetRole) return alert('Please enter a target role first!');
    if (!window.confirm('This will overwrite your existing resume content. Continue?')) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/generate-full', { role: targetRole });
      if (res.data?.resumeData) {
        setResume({ ...resume, ...res.data.resumeData });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to auto-generate resume.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!targetRole) return alert('Please enter a target role first!');
    setAiLoading(true);
    try {
      const res = await api.post('/ai/recommendations', { role: targetRole, resumeData: resume });
      if (res.data?.recommendations) {
        setRecommendations(res.data.recommendations);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to get recommendations.');
    } finally {
      setAiLoading(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };

  const handleArrayUpdate = (field, index, subField, value) => {
    const updatedArray = [...resume[field]];
    updatedArray[index][subField] = value;
    setResume({ ...resume, [field]: updatedArray });
  };

  const addItem = (field, defaultItem) => {
    setResume({ ...resume, [field]: [...resume[field], defaultItem] });
  };

  const removeItem = (field, index) => {
    const updatedArray = [...resume[field]];
    updatedArray.splice(index, 1);
    setResume({ ...resume, [field]: updatedArray });
  };

  const generateSummaryWithAI = async () => {
    setAiLoading(true);
    try {
      const currentRole = targetRole || resume.experience?.[0]?.title || 'Professional';
      const currentDraft = resume.personalInfo?.summary || '';
      
      const response = await api.post('/ai/generate-summary', { 
        title: currentRole,
        experience: resume.experience?.map(e => `${e.title} at ${e.company} doing ${e.description}`).join('. '),
        currentSummary: currentDraft
      });
      if (response.data?.summary) {
        updatePersonalInfo('summary', response.data.summary);
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const improveBulletsWithAI = async (index) => {
    setAiLoading(true);
    try {
      const text = resume.experience[index].description;
      const role = resume.experience[index].title || 'Professional';
      if (!text) return;

      const response = await api.post('/ai/improve-bullets', { text, role });
      if (response.data?.improvedText) {
        handleArrayUpdate('experience', index, 'description', response.data.improvedText);
      }
    } catch (error) {
      console.error('Failed to improve bullets:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const suggestSkillsWithAI = async () => {
    setAiLoading(true);
    try {
      const currentRole = resume.experience?.[0]?.title || 'Professional';
      const response = await api.post('/ai/suggest-skills', { role: currentRole });
      if (response.data?.skills) {
        // Assume skills is a comma-separated string from AI endpoint
        const newSkills = response.data.skills.split(',').map(s => s.trim());
        setResume({ ...resume, skills: [...new Set([...resume.skills, ...newSkills])] });
      }
    } catch (error) {
      console.error('Failed to suggest skills:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const AccordionHeader = ({ title, tabKey }) => (
    <div 
      className={`flex justify-between items-center p-4 cursor-pointer border-b ${activeTab === tabKey ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
      onClick={() => setActiveTab(activeTab === tabKey ? null : tabKey)}
    >
      <h3 className="font-semibold">{title}</h3>
      {activeTab === tabKey ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm text-blue-300  border-blue-100 overflow-hidden">
        <AccordionHeader title="AI Automations & Recommendations ✨" tabKey="ai" />
        {activeTab === 'ai' && (
          <div className="p-4 bg-white/50 border-t border-blue-100">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Target Job Role</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Frontend Engineer" 
                className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button 
                onClick={handleAutoFill}
                disabled={aiLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-md transition-all flex justify-center items-center gap-2 shadow-sm"
              >
                <Sparkles size={16} /> Auto-Fill Entire Resume
              </button>
              <button 
                onClick={handleGetRecommendations}
                disabled={aiLoading}
                className="flex-1 bg-white hover:bg-indigo-50 border border-indigo-200 disabled:opacity-50 text-indigo-700 font-medium py-2.5 px-4 rounded-md transition-all flex justify-center items-center gap-2 shadow-sm"
              >
                <Sparkles size={16} /> Get AI Recommendations
              </button>
            </div>
            
            {recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded border border-indigo-100 shadow-sm">
                <h4 className="font-bold text-indigo-800 mb-2">💡 AI Suggestions for this role:</h4>
                <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="leading-relaxed">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden text-black bg-white shadow-sm">
        <AccordionHeader title="Theme Settings" tabKey="theme" />
        {activeTab === 'theme' && (
          <div className="p-4 bg-gray-50 flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => setResume({...resume, theme: 'modern'})}
              className={`flex-1 py-3 border-2 rounded text-center font-bold transition-colors ${resume.theme === 'modern' || !resume.theme ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-600 bg-white'}`}
            >Modern</button>
            <button 
              onClick={() => setResume({...resume, theme: 'elegant'})}
              className={`flex-1 py-3 border-2 rounded text-center font-bold transition-colors ${resume.theme === 'elegant' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300 text-gray-600 bg-white'}`}
            >Elegant</button>
            <button 
              onClick={() => setResume({...resume, theme: 'professional'})}
              className={`flex-1 py-3 border-2 rounded text-center font-bold transition-colors ${resume.theme === 'professional' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-300 text-gray-600 bg-white'}`}
            >Professional</button>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden bg-white text-black shadow-sm">
        <AccordionHeader title="Personal Information" tabKey="personal" />
        {activeTab === 'personal' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500" value={resume.personalInfo?.firstName || ''} onChange={(e) => updatePersonalInfo('firstName', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500" value={resume.personalInfo?.lastName || ''} onChange={(e) => updatePersonalInfo('lastName', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500" value={resume.personalInfo?.email || ''} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                <input type="text" className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500" value={resume.personalInfo?.phone || ''} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Address Location (City, State/Country)</label>
                <input type="text" className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500" value={resume.personalInfo?.address || ''} onChange={(e) => updatePersonalInfo('address', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">LinkedIn URL</label>
                <input type="text" className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500" value={resume.personalInfo?.linkedIn || ''} onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">GitHub / Portfolio URL</label>
                <input type="text" className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500" value={resume.personalInfo?.github || ''} onChange={(e) => updatePersonalInfo('github', e.target.value)} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-black mb-1">
                <label className="block text-sm text-gray-600">Professional Summary</label>
                <button 
                  onClick={generateSummaryWithAI} 
                  disabled={aiLoading}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-2 py-1 rounded"
                >
                  <Sparkles size={14} /> Generate with AI
                </button>
              </div>
              <textarea 
                className="w-full px-3 py-2 border rounded h-24 focus:ring-1 focus:ring-blue-500" 
                value={resume.personalInfo?.summary || ''} 
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                placeholder="Briefly describe your professional background and key strengths..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm text-black">
        <AccordionHeader title="Experience" tabKey="experience" />
        {activeTab === 'experience' && (
          <div className="p-4 space-y-6">
            {resume.experience?.map((exp, index) => (
              <div key={index} className="border p-4 rounded bg-gray-50 relative">
                <button 
                  onClick={() => removeItem('experience', index)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Job Title</label>
                    <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={exp.title || ''} onChange={(e) => handleArrayUpdate('experience', index, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Company</label>
                    <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={exp.company || ''} onChange={(e) => handleArrayUpdate('experience', index, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date (e.g. Jan 2020)</label>
                    <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={exp.startDate || ''} onChange={(e) => handleArrayUpdate('experience', index, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={exp.endDate || ''} onChange={(e) => handleArrayUpdate('experience', index, 'endDate', e.target.value)} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1 text-black">
                    <label className="block text-xs text-gray-500">Description / Responsibilities (Use bullet points)</label>
                    <button 
                      onClick={() => improveBulletsWithAI(index)} 
                      disabled={aiLoading}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-2 py-1 rounded"
                    >
                      <Sparkles size={14} /> Polish Bullets with AI
                    </button>
                  </div>
                  <textarea 
                    className="w-full px-3 py-2 border rounded h-24 text-sm" 
                    value={exp.description || ''} 
                    onChange={(e) => handleArrayUpdate('experience', index, 'description', e.target.value)}
                    placeholder="- Developed a new feature...&#10;- Improved performance by..."
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={() => addItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 px-4 border border-dashed border-blue-300 rounded-lg w-full justify-center"
            >
              <Plus size={18} /> Add Experience
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden bg-white text-black shadow-sm">
        <AccordionHeader title="Education" tabKey="education" />
        {activeTab === 'education' && (
          <div className="p-4 space-y-6">
            {resume.education?.map((edu, index) => (
              <div key={index} className="border p-4 rounded bg-gray-50 relative">
                <button 
                  onClick={() => removeItem('education', index)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">School / University</label>
                    <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={edu.school || ''} onChange={(e) => handleArrayUpdate('education', index, 'school', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Degree</label>
                    <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={edu.degree || ''} onChange={(e) => handleArrayUpdate('education', index, 'degree', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Field of Study</label>
                    <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={edu.fieldOfStudy || ''} onChange={(e) => handleArrayUpdate('education', index, 'fieldOfStudy', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={edu.startDate || ''} onChange={(e) => handleArrayUpdate('education', index, 'startDate', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input type="text" className="w-full px-3 py-1.5 border rounded text-sm" value={edu.endDate || ''} onChange={(e) => handleArrayUpdate('education', index, 'endDate', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => addItem('education', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 px-4 border border-dashed border-blue-300 rounded-lg w-full justify-center"
            >
              <Plus size={18} /> Add Education
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden text-black bg-white shadow-sm">
        <AccordionHeader title="Skills" tabKey="skills" />
        {activeTab === 'skills' && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-600">Comma separated list of skills</label>
              <button 
                onClick={suggestSkillsWithAI} 
                disabled={aiLoading}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-2 py-1 rounded"
              >
                <Sparkles size={14} /> AI Suggestions based on Experience
              </button>
            </div>
            <textarea 
              className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 h-24" 
              value={(resume.skills || []).join(', ')} 
              onChange={(e) => setResume({...resume, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
              placeholder="React, Node.js, Project Management, Graphic Design..."
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {(resume.skills || []).filter(s => s).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
