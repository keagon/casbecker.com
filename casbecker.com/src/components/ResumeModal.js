export default function ResumeModal({ isOpen, onClose, isClosing }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className={`modal-backdrop ${isClosing ? 'modal-backdrop-exit-active' : 'modal-backdrop-enter-active'}`} />
      <div 
        className={`relative w-full max-w-md mx-4 ${isClosing ? 'animate-fade-out' : 'animate-scale-up'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-background-900/50 backdrop-blur-sm rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-rounded text-accent-500">description</span>
              <h3 className="text-2xl font-bold text-text-50">My Resume</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-text-200 hover:text-text-50 transition-all duration-300"
            >
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>
          <p className="text-text-200 mb-8">
            Download my resume to learn more about my experience, skills, and achievements.
          </p>
          <div className="grid gap-4">
            <a
              href="/CV-Cas-Becker-apr-2023-Development.pdf"
              download
              onClick={onClose}
              className="group relative flex items-center p-4 rounded-lg transform hover:-translate-x-1 hover:translate-y-0.5 
                       transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-background-800/20 backdrop-blur-sm" />
              <div className="relative flex items-center w-full">
                <span className="p-2 rounded-lg mr-4 transition-all duration-300 text-accent-500">
                  <span className="material-symbols-rounded">download</span>
                </span>
                <span className="font-medium text-text-50">Download Resume</span>
                <span className="material-symbols-rounded ml-auto transform transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 