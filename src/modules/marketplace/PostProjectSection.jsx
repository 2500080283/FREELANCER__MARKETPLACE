import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function PostProjectSection({ onProjectCreated }) {
  const { currentUser, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Please sign in or register to publish a project.', 'info');
      openAuthModal('signin');
      return;
    }

    if (!title.trim() || !budget || !description.trim()) {
      showToast('Please fill out all required project fields.', 'error');
      return;
    }

    const skillsArray = skills.trim()
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Web Development'];

    const newProject = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      category: category,
      budget: Number(budget),
      description: description.trim(),
      skills: skillsArray,
      postedTime: 'Just now',
      client: {
        name: currentUser.name,
        email: currentUser.email,
        verified: true,
        rating: 5.0,
        country: 'India'
      },
      status: 'approved', // Auto-approved or pending moderation
      proposalsCount: 0,
      isFeatured: false
    };

    onProjectCreated(newProject);
    showToast(`Project "${newProject.title}" successfully published!`, 'success');

    // Reset form
    setTitle('');
    setCategory('Web Development');
    setBudget('');
    setSkills('');
    setDescription('');
  };

  const previewSkills = skills.trim()
    ? skills.split(',').map(s => s.trim()).filter(Boolean)
    : ['React', 'Node.js', 'UI/UX'];

  return (
    <section id="post-project" className="section">
      <div className="section-header">
        <span className="section-badge">Client Portal</span>
        <h2>Post Your Project</h2>
        <p>Publish your job posting and receive proposals from qualified freelancers today.</p>
      </div>

      <div className="post-section-wrapper">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="postProjectTitle">Project Title</label>
            <input
              type="text"
              id="postProjectTitle"
              placeholder="e.g. Modern E-Commerce Platform with Next.js & Stripe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postProjectCategory">Category</label>
              <select
                id="postProjectCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Web Development">Web Development</option>
                <option value="UI/UX & Design">UI/UX & Design</option>
                <option value="Mobile Apps">Mobile Apps</option>
                <option value="AI & Data">AI & Data</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="postProjectBudget">Budget (INR ₹)</label>
              <input
                type="number"
                id="postProjectBudget"
                placeholder="e.g. 25000"
                min="1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="postProjectSkills">Required Skills (Comma separated)</label>
            <input
              type="text"
              id="postProjectSkills"
              placeholder="e.g. React, TailwindCSS, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postProjectDescription">Project Description & Requirements</label>
            <textarea
              id="postProjectDescription"
              placeholder="Provide details about the project goals, scope of work, and expectations..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '10px' }}>
            Publish Project Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>

        {/* Right: Real-time Live Card Preview */}
        <div className="preview-box">
          <div>
            <div className="preview-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
              Live Card Preview
            </div>

            <div className="project-card" style={{ boxShadow: 'none' }}>
              <div className="card-top">
                <span className="card-category-badge">{category}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Just now</span>
              </div>
              <h3>{title.trim() || 'Your Project Title Appears Here'}</h3>
              <p className="project-desc">
                {description.trim() || 'Describe your requirements to preview how candidates will view your job posting on the marketplace in real-time.'}
              </p>
              <div className="skills-wrapper">
                {previewSkills.map((sk, idx) => (
                  <span key={idx} className="skill-tag">{sk}</span>
                ))}
              </div>
              <div className="card-footer">
                <div className="budget-info">
                  <span className="budget-label">Fixed Budget</span>
                  <span className="budget-val">
                    ₹{budget ? Number(budget).toLocaleString() : '25,000'}
                  </span>
                </div>
                <span className="btn btn-primary btn-sm">Apply Now</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }}>
            ⚡ Your posting will be immediately visible to thousands of vetted specialists.
          </div>
        </div>
      </div>
    </section>
  );
}
