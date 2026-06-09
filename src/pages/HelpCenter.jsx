import React, { useState } from 'react';

const Ic = ({ name, size = 20, fill = false, style = {} }) => (
    <span className={`material-symbols-outlined ${fill ? 'icon-fill' : ''}`} style={{ fontSize: size, ...style }}>
        {name}
    </span>
);

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'getting-started', icon: 'rocket_launch', label: 'Getting Started' },
    { id: 'features', icon: 'auto_awesome', label: 'Features & Tools' },
    { id: 'account', icon: 'manage_accounts', label: 'Account & Billing' },
    { id: 'troubleshooting', icon: 'build', label: 'Troubleshooting' },
  ];

  const helpData = {
    'getting-started': [
      {
        q: 'How do I upload a document?',
        a: 'Navigate to the AI Engine page, drag and drop your PDF or click to browse. Once uploaded, DocFlow AI will automatically process and extract the content for summaries and quizzes.'
      },
      {
        q: 'What is DocFlow AI?',
        a: 'DocFlow AI is an intelligent workspace that uses advanced language models to summarize documents, generate quizzes, and provide an interactive AI tutor to accelerate your learning and workflow.'
      },
      {
        q: 'How do I access the AI Tutor?',
        a: 'After processing a document in the DocFlow Learn or AI Engine tabs, you can chat with the AI Tutor by typing your questions in the chat panel on the right side of the screen.'
      }
    ],
    'features': [
      {
        q: 'How are quizzes generated?',
        a: 'Our AI analyzes the core concepts of your uploaded document and generates multiple-choice questions to test your comprehension. You can find these in the AI Engine or DocFlow Learn areas.'
      },
      {
        q: 'Can I save my summaries?',
        a: 'Yes! Summaries and extracted notes are automatically saved to your workspace. You can view them anytime in the Notes section.'
      },
      {
        q: 'What formats are supported?',
        a: 'Currently, DocFlow AI supports PDF documents. Support for Word documents (.docx) and plain text files (.txt) is coming soon.'
      }
    ],
    'account': [
      {
        q: 'How do I change my profile picture?',
        a: 'Go to Settings > Profile. If you are logged in via Google, your picture syncs automatically. Otherwise, you can upload a new picture directly from your device.'
      },
      {
        q: 'Is my data secure?',
        a: 'Yes, your documents and personal data are securely stored and never shared with third parties. We use industry-standard encryption for data at rest and in transit.'
      },
      {
        q: 'How can I delete my account?',
        a: 'You can delete your account from the Settings page under the Security tab. Please note that this action is irreversible and will delete all your documents and activity history.'
      }
    ],
    'troubleshooting': [
      {
        q: 'My document failed to upload',
        a: 'Ensure your document is a valid PDF and under the 20MB file size limit. If the problem persists, try refreshing the page or checking your internet connection.'
      },
      {
        q: 'The AI Tutor is not responding',
        a: 'Sometimes the AI models experience high traffic. Please wait a few moments and try again. If the issue continues, check our status page for any ongoing maintenance.'
      }
    ]
  };

  const currentQuestions = helpData[activeCategory] || [];
  const filteredQuestions = searchQuery 
    ? Object.values(helpData).flat().filter(item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentQuestions;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <style>{`
        .search-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 4px rgba(59,130,246,0.1) !important; }
        .cat-btn { transition: all 0.2s; border: 2px solid transparent; }
        .cat-btn:hover { background: #eff6ff; color: #2563eb; transform: translateY(-2px); }
        .cat-btn.active { background: #fff; border-color: #3b82f6; color: #1d4ed8; box-shadow: 0 4px 12px rgba(59,130,246,0.1); }
      `}</style>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-20 pb-24 px-8 relative overflow-hidden rounded-b-[40px]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-[60px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Search our knowledge base or browse categories below to find answers to your questions and get the most out of DocFlow AI.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Ic name="search" size={24} style={{ color: '#94a3b8' }} />
            </div>
            <input
              type="text"
              className="search-input w-full pl-12 pr-6 py-4 rounded-2xl border-none text-lg text-slate-800 bg-white shadow-xl outline-none"
              placeholder="Search for articles, guides, or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
        
        {/* Categories (only show if not searching) */}
        {!searchQuery && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`cat-btn flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-sm ${activeCategory === cat.id ? 'active' : ''}`}
              >
                <div className={`p-3 rounded-xl ${activeCategory === cat.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                  <Ic name={cat.icon} size={28} />
                </div>
                <span className="font-bold text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* FAQ List */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
            <Ic name={searchQuery ? 'search' : 'article'} size={28} style={{ color: '#3b82f6' }} />
            {searchQuery ? 'Search Results' : categories.find(c => c.id === activeCategory)?.label}
          </h2>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <Ic name="sentiment_dissatisfied" size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
              <h3 className="text-lg font-bold text-slate-600">No results found for "{searchQuery}"</h3>
              <p className="text-slate-400 mt-2">Try adjusting your search terms or browse the categories.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredQuestions.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                    <Ic name="help_center" size={22} style={{ color: '#3b82f6', marginTop: '2px' }} />
                    {faq.q}
                  </h3>
                  <p className="text-slate-600 leading-relaxed ml-8">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-200">
          <div>
            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
            <p className="text-blue-100">Our support team is always ready to assist you with any issues.</p>
          </div>
          <button className="whitespace-nowrap px-8 py-4 bg-white text-blue-600 font-extrabold rounded-xl hover:bg-slate-50 hover:scale-105 transition-all shadow-md">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}
