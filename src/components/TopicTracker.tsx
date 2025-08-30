import React, { useState } from 'react';
import { Check, Clock, Brain, FileText, Trash2, Edit3, Star, TrendingUp } from 'lucide-react';
import { SyllabusTopic } from '../types';
import { Button } from './ui/Button';

interface TopicTrackerProps {
  topics: SyllabusTopic[];
  onTopicsChange: (topics: SyllabusTopic[]) => void;
  chapterId: string;
}

export const TopicTracker: React.FC<TopicTrackerProps> = ({
  topics,
  onTopicsChange,
  chapterId
}) => {
  const [newTopicName, setNewTopicName] = useState('');
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const addTopic = () => {
    if (!newTopicName.trim()) return;

    const newTopic: SyllabusTopic = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      completed: false,
      chapterId,
      timeSpent: 0,
      difficulty: 'medium',
      lastStudied: new Date(),
    };

    onTopicsChange([...topics, newTopic]);
    setNewTopicName('');
  };

  const toggleTopic = (topicId: string) => {
    const updatedTopics = topics.map(topic =>
      topic.id === topicId 
        ? { 
            ...topic, 
            completed: !topic.completed,
            lastStudied: new Date()
          }
        : topic
    );
    onTopicsChange(updatedTopics);
  };

  const deleteTopic = (topicId: string) => {
    const updatedTopics = topics.filter(topic => topic.id !== topicId);
    onTopicsChange(updatedTopics);
  };

  const startEditing = (topic: SyllabusTopic) => {
    setEditingTopic(topic.id);
    setEditingName(topic.name);
  };

  const saveEdit = (topicId: string) => {
    if (!editingName.trim()) return;
    
    const updatedTopics = topics.map(topic =>
      topic.id === topicId ? { ...topic, name: editingName.trim() } : topic
    );
    onTopicsChange(updatedTopics);
    setEditingTopic(null);
    setEditingName('');
  };

  const updateTopicDifficulty = (topicId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const updatedTopics = topics.map(topic =>
      topic.id === topicId ? { ...topic, difficulty } : topic
    );
    onTopicsChange(updatedTopics);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const completedCount = topics.filter(topic => topic.completed).length;
  const progressPercentage = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Topic Summary */}
      {topics.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Topic Progress
              </h4>
            </div>
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
              {completedCount}/{topics.length} completed
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${Math.max(progressPercentage, 0)}%` }}
            >
              {progressPercentage > 15 && (
                <span className="text-xs font-bold text-white">
                  {Math.round(progressPercentage)}%
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Topic */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a new topic..."
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTopic()}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
        <Button
          onClick={addTopic}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add
        </Button>
      </div>

      {/* Topics List */}
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className={`
              group p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md
              ${topic.completed 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600 hover:border-blue-300'
              }
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleTopic(topic.id)}
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0
                  ${topic.completed
                    ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-400'
                  }
                `}
              >
                {topic.completed && <Check className="w-4 h-4" />}
              </button>

              <div className="flex-1">
                {editingTopic === topic.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(topic.id)}
                      onBlur={() => saveEdit(topic.id)}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium transition-all duration-200 ${
                        topic.completed
                          ? 'text-green-700 dark:text-green-300 line-through'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {topic.name}
                    </span>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Difficulty Selector */}
                      <select
                        value={topic.difficulty || 'medium'}
                        onChange={(e) => updateTopicDifficulty(topic.id, e.target.value as any)}
                        className={`px-2 py-1 text-xs border rounded-md ${getDifficultyColor(topic.difficulty)} transition-all duration-200`}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit3}
                        onClick={() => startEditing(topic)}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => deleteTopic(topic.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Topic Details */}
            {topic.completed && (
              <div className="mt-2 flex items-center gap-4 text-xs text-green-600 dark:text-green-400">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>Completed</span>
                </div>
                {topic.lastStudied && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(topic.lastStudied).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No topics added yet. Start by adding your first topic!</p>
        </div>
      )}
    </div>
  );
};
