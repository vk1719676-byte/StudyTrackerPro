import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Plus, Search, Filter, BookOpen, Calendar, Tag, Menu, X, Eye, Star, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { getUserStudyMaterials, addStudyMaterial, deleteStudyMaterial, getUserExams } from '../services/firestore';
import { StudyMaterial, Exam } from '../types';

export const StudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    examId: '',
    subject: '',
    tags: '',
    file: null as File | null
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribeMaterials = getUserStudyMaterials(user.uid, (materialData) => {
      setMaterials(materialData);
      setLoading(false);
    });

    const unsubscribeExams = getUserExams(user.uid, (examData) => {
      setExams(examData);
    });

    return () => {
      unsubscribeMaterials();
      unsubscribeExams();
    };
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setFormData({ ...formData, file });
      
      // Auto-fill name if empty
      if (!formData.name) {
        setFormData(prev => ({ ...prev, name: file.name.split('.')[0] }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.file) return;

    setUploading(true);

    try {
      // In a real app, you would upload the file to Firebase Storage
      // For this demo, we'll create a mock URL
      const mockFileUrl = `https://firebasestorage.googleapis.com/mock/${formData.file.name}`;

      const materialData: Omit<StudyMaterial, 'id'> = {
        name: formData.name,
        description: formData.description,
        fileUrl: mockFileUrl,
        fileName: formData.file.name,
        fileSize: formData.file.size,
        fileType: formData.file.type,
        examId: formData.examId,
        subject: formData.subject,
        uploadedAt: new Date(),
        userId: user.uid,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await addStudyMaterial(materialData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        examId: '',
        subject: '',
        tags: '',
        file: null
      });
      setShowUploadForm(false);
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Failed to upload material. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (window.confirm('Are you sure you want to delete this study material?')) {
      try {
        await deleteStudyMaterial(materialId);
      } catch (error) {
        console.error('Error deleting material:', error);
        alert('Failed to delete material. Please try again.');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('text')) return '📝';
    return '📁';
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesExam = !filterExam || material.examId === filterExam;
    const matchesSubject = !filterSubject || material.subject.toLowerCase().includes(filterSubject.toLowerCase());
    
    return matchesSearch && matchesExam && matchesSubject;
  });

  const uniqueSubjects = [...new Set(materials.map(m => m.subject))];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="text-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-300">Please log in to access your study materials and continue your learning journey.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="text-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Study Materials</h3>
          <p className="text-gray-600 dark:text-gray-300">Preparing your personalized learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Action Button - Enhanced */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse opacity-75"></div>
          <Button 
            onClick={() => setShowUploadForm(true)} 
            size="lg"
            className="relative rounded-full p-4 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-110 transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4 leading-tight">
                Study Materials Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-lg max-w-2xl leading-relaxed">
                Your intelligent study companion. Upload, organize, and access your materials with our premium management system designed for academic excellence.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30"></div>
                <Button 
                  onClick={() => setShowUploadForm(true)} 
                  icon={Plus} 
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Upload Material
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Premium Badge */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 px-6 md:px-8 py-4 rounded-full border border-white/50 dark:border-white/10 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm md:text-base font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                    Powered by Advanced TRMS Technology
                  </span>
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            <Card className="relative p-6 md:p-8 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-xl" hover>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl shadow-lg">
                    <FileText className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                </div>
                <div>
                  <p className="text-sm md:text-base text-blue-700 dark:text-blue-300 font-semibold mb-1">Total Materials</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-cyan-800 dark:from-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">
                    {materials.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            <Card className="relative p-6 md:p-8 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-xl" hover>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg">
                    <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                </div>
                <div>
                  <p className="text-sm md:text-base text-green-700 dark:text-green-300 font-semibold mb-1">Subjects</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 dark:from-green-200 dark:to-emerald-200 bg-clip-text text-transparent">
                    {uniqueSubjects.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="relative group sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            <Card className="relative p-6 md:p-8 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-xl" hover>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg">
                    <Upload className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                </div>
                <div>
                  <p className="text-sm md:text-base text-purple-700 dark:text-purple-300 font-semibold mb-1">Total Size</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 dark:from-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                    {formatFileSize(materials.reduce((total, m) => total + m.fileSize, 0))}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Enhanced Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
              <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          Upload Study Material
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add new material to your collection</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowUploadForm(false)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Input
                          label="Material Name"
                          placeholder="e.g., Chapter 5 Notes"
                          value={formData.name}
                          onChange={(value) => setFormData({ ...formData, name: value })}
                          required
                          className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Related Exam
                        </label>
                        <select
                          value={formData.examId}
                          onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                          className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value="">Select an exam</option>
                          {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.name}</option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="Subject"
                        placeholder="e.g., Mathematics"
                        value={formData.subject}
                        onChange={(value) => setFormData({ ...formData, subject: value })}
                        required
                        className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                      />

                      <Input
                        label="Tags (comma-separated)"
                        placeholder="e.g., notes, important, formulas"
                        value={formData.tags}
                        onChange={(value) => setFormData({ ...formData, tags: value })}
                        className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Brief description of the material..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        File (Max 10MB)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
                          required
                          className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white hover:file:from-blue-600 hover:file:to-purple-700 file:transition-all file:duration-200"
                        />
                      </div>
                      {formData.file && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getFileIcon(formData.file.type)}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                {formData.file.name}
                              </p>
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                {formatFileSize(formData.file.size)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-600/50">
                      <Button 
                        type="submit" 
                        disabled={uploading} 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        {uploading ? (
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Uploading...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Material
                          </div>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => setShowUploadForm(false)} 
                        className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filters */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
          <Card className="relative p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Enhanced Search */}
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search materials, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="relative w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex gap-4">
                <select
                  value={filterExam}
                  onChange={(e) => setFilterExam(e.target.value)}
                  className="px-4 py-4 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 min-w-[150px]"
                >
                  <option value="">All Exams</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>

                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-4 py-4 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 min-w-[150px]"
                >
                  <option value="">All Subjects</option>
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Button */}
              <div className="lg:hidden flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  icon={Filter}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  Filters
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  icon={viewMode === 'grid' ? Menu : Eye}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                />
              </div>

              {/* Clear Filters */}
              {(searchQuery || filterExam || filterSubject) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterExam('');
                    setFilterSubject('');
                  }}
                  className="whitespace-nowrap bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="lg:hidden mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-600/50 space-y-4 animate-in slide-in-from-top duration-300">
                <select
                  value={filterExam}
                  onChange={(e) => setFilterExam(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Exams</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>

                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Subjects</option>
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            )}
          </Card>
        </div>

        {/* Results Count */}
        {filteredMaterials.length > 0 && (
          <div className="mb-6 px-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Showing {filteredMaterials.length} of {materials.length} materials</span>
              {(searchQuery || filterExam || filterSubject) && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                  Filtered
                </span>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Materials List/Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
            <Card className="relative p-8 md:p-16 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 shadow-xl">
              <div className="max-w-md mx-auto">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse"></div>
                  <div className="absolute inset-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                  {materials.length === 0 ? 'Start Your Learning Journey' : 'No materials match your search'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm md:text-base leading-relaxed">
                  {materials.length === 0 
                    ? 'Upload your first study material and transform the way you organize and access your academic resources'
                    : 'Try adjusting your search criteria or filters to find the materials you\'re looking for'
                  }
                </p>
                {materials.length === 0 && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30"></div>
                    <Button 
                      onClick={() => setShowUploadForm(true)} 
                      icon={Plus} 
                      size="lg"
                      className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      Upload Your First Material
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredMaterials.map((material, index) => {
              const exam = exams.find(e => e.id === material.examId);
              
              return (
                <div
                  key={material.id}
                  className="group animate-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Card 
                      className={`relative p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${
                        viewMode === 'list' ? 'flex flex-col sm:flex-row gap-6' : ''
                      }`} 
                      hover
                    >
                      <div className={`flex items-start gap-4 ${viewMode === 'list' ? 'flex-1' : 'mb-6'}`}>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-50"></div>
                          <div className="relative text-3xl md:text-4xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                            {getFileIcon(material.fileType)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-base md:text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {material.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3 truncate">
                            {material.fileName}
                          </p>
                          {material.description && viewMode === 'list' && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {material.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(material.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 hover:scale-110 rounded-xl"
                        />
                      </div>

                      <div className={`space-y-4 ${viewMode === 'list' ? 'sm:w-72 flex-shrink-0' : ''}`}>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{material.subject}</span>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                              {exam?.name || 'Unknown Exam'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <span className="font-medium">{formatFileSize(material.fileSize)}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500 text-xs">
                                {material.uploadedAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {material.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {material.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform duration-200"
                              >
                                {tag}
                              </span>
                            ))}
                            {material.tags.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs border border-gray-200 dark:border-gray-600">
                                +{material.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={Download}
                              onClick={() => {
                                alert('Download functionality would be implemented with Firebase Storage');
                              }}
                              className="relative w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 hover:scale-105 transition-all duration-300 text-sm font-semibold"
                            >
                              Download Material
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
