import React from 'react';

export default function NotesDisplay({ content }) {
  const renderContent = () => {
    if (typeof content === 'string') {
      return (
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {content}
          </p>
        </div>
      );
    }
    
    // Attempt to extract meaningful text if it's an object
    const textContent = content?.summary || content?.text || content?.content || JSON.stringify(content, null, 2);

    return (
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          {textContent}
        </pre>
      </div>
    );
  };

  return (
    <div className="mt-6 animate-fadeup">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-blue-600">✨</span> Generated Output
      </h3>
      {renderContent()}
    </div>
  );
}
