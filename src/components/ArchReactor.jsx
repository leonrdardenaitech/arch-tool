import React from 'react';

const ArchReactor = () => {
  const projects = [
    { 
      id: 1, 
      title: "Hydro Scan (Aqua Flow)", 
      desc: "AI-driven hydration monitor with voice integration.",
      status: "Ready for Launch"
    },
    { 
      id: 2, 
      title: "Engineer El's Arch", 
      desc: "Solutions Architecture dashboard with Slime-UI.",
      status: "In Development"
    }
  ];

  return (
    <div className="mt-8 p-6 bg-black bg-opacity-50 rounded-xl border border-blue-500 shadow-2xl">
      <h2 className="text-3xl font-black text-blue-400 mb-6 uppercase tracking-tastic">Arch Reactor: Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="p-4 border border-blue-900 bg-blue-900 bg-opacity-10 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
            <h3 className="text-xl font-bold text-blue-200">{project.title}</h3>
            <p className="text-gray-400 text-sm mt-2">{project.desc}</p>
            <span className="inline-block mt-4 text-xs font-mono text-blue-500 uppercase tracking-widest">{project.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchReactor;