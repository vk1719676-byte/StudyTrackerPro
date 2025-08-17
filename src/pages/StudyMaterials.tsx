import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Plus, Search, Filter, BookOpen, Calendar, Tag, Menu, X, Eye } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Please log in to access your study materials.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Mobile Upload Button - Fixed Position */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button 
          onClick={() => setShowUploadForm(true)} 
          size="lg"
          className="rounded-full p-4 shadow-xl"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4 leading-tight">
                Study Materials 📚
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl">
                Upload, organize, and access your study materials anytime, anywhere with our advanced management system
              </p>
            </div>
            <div className="hidden md:block">
              <Button onClick={() => setShowUploadForm(true)} icon={Plus} size="lg">
                Upload Material
              </Button>
            </div>
          </div>

          {/* Powered by TRMS Badge */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 px-4 md:px-6 py-3 rounded-full border border-blue-200 dark:border-blue-700 shadow-sm">
              <span className="text-xs md:text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <span className="animate-pulse">⚡</span>
                Powered by TRMS - Advanced Study Management System
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700" hover>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg">
                <FileText className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">Total Materials</p>
                <p className="text-xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {materials.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700" hover>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">Subjects</p>
                <p className="text-xl md:text-3xl font-bold text-green-900 dark:text-green-100">
                  {uniqueSubjects.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 sm:col-span-2 lg:col-span-1" hover>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-purple-500 text-white rounded-xl shadow-lg">
                <Upload className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-purple-600 dark:text-purple-400 font-medium">Total Size</p>
                <p className="text-xl md:text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {formatFileSize(materials.reduce((total, m) => total + m.fileSize, 0))}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Upload Study Material
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowUploadForm(false)}
                    className="p-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Material Name"
                      placeholder="e.g., Chapter 5 Notes"
                      value={formData.name}
                      onChange={(value) => setFormData({ ...formData, name: value })}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Related Exam
                      </label>
                      <select
                        value={formData.examId}
                        onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
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
                    />

                    <Input
                      label="Tags (comma-separated)"
                      placeholder="e.g., notes, important, formulas"
                      value={formData.tags}
                      onChange={(value) => setFormData({ ...formData, tags: value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Brief description of the material..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File (Max 10MB)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.file && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Selected: {formData.file.name} ({formatFileSize(formData.file.size)})
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button type="submit" disabled={uploading} className="flex-1">
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        'Upload Material'
                      )}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setShowUploadForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <select
                value={filterExam}
                onChange={(e) => setFilterExam(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 min-w-[150px]"
              >
                <option value="">All Exams</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>

              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 min-w-[150px]"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                icon={Filter}
                className="flex-1"
              >
                Filters
              </Button>
              <Button
                variant="ghost"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                icon={viewMode === 'grid' ? Menu : Eye}
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
                className="whitespace-nowrap"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3">
              <select
                value={filterExam}
                onChange={(e) => setFilterExam(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Exams</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>

              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          )}
        </Card>

        {/* Results Count */}
        {filteredMaterials.length > 0 && (
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredMaterials.length} of {materials.length} materials
          </div>
        )}

        {/* Materials List/Grid */}
        {filteredMaterials.length === 0 ? (
          <Card className="p-8 md:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {materials.length === 0 ? 'No study materials yet' : 'No materials match your search'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm md:text-base">
                {materials.length === 0 
                  ? 'Upload your first study material to get started on your learning journey'
                  : 'Try adjusting your search criteria or filters'
                }
              </p>
              {materials.length === 0 && (
                <Button onClick={() => setShowUploadForm(true)} icon={Plus} size="lg">
                  Upload Your First Material
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredMaterials.map((material) => {
              const exam = exams.find(e => e.id === material.examId);
              
              return (
                <Card 
                  key={material.id} 
                  className={`p-4 md:p-6 group ${viewMode === 'list' ? 'flex flex-col sm:flex-row gap-4' : ''}`} 
                  hover
                >
                  <div className={`flex items-start gap-3 ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                    <div className="text-2xl md:text-3xl flex-shrink-0">
                      {getFileIcon(material.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm md:text-base line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {material.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mb-2 truncate">
                        {material.fileName}
                      </p>
                      {material.description && viewMode === 'list' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {material.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(material.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
                    />
                  </div>

                  <div className={`space-y-3 ${viewMode === 'list' ? 'sm:w-64 flex-shrink-0' : ''}`}>
                    <div className="flex items-center gap-2 text-xs md:text-sm">
                      <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">{material.subject}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs md:text-sm">
                      <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {exam?.name || 'Unknown Exam'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs md:text-sm">
                      <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatFileSize(material.fileSize)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-xs">
                        {material.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>

                    {material.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {material.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {material.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                            +{material.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Download}
                        onClick={() => {
                          alert('Download functionality would be implemented with Firebase Storage');
                        }}
                        className="w-full text-xs md:text-sm"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return <StudyMaterials />;
}

export default App;