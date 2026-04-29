'use client';

import { useState } from 'react';
import { templates, categories, Template } from '@/data/templates';

interface TemplateBrowserProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export default function TemplateBrowser({ onSelectTemplate, onClose }: TemplateBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);

  const filteredTemplates = templates.filter(t => t.category === selectedCategory);

  return (
    <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-cyan-400">Templates Library</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-cyan-500 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{template.icon}</span>
              <div>
                <h4 className="font-medium text-gray-100">{template.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{template.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
