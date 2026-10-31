import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEFAULT_CATEGORIES } from '../../data/storage';

export function PostProjectSection({ onProjectCreated, categories = [], settings = {} }) {
  const { currentUser, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const availableCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(availableCategories[0] || 'Web Development');
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

    const isAutoApprove = settings?.autoApproveProjects !== false;

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
      status: isAutoApprove ? 'approved' : 'pending',
      proposalsCount: 0,
      isFeatured: false
    };

    onProjectCreated(newProject);
    if (isAutoApprove) {
      showToast(`Project "${newProject.title}" successfully published!`, 'success');
    } else {
      showToast(`Project submitted! It is currently pending Administrator review.`, 'info');
    }

    // Reset form
    setTitle('');
    setCategory(availableCategories[0] || 'Web Development');
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
        <h2>Post a New Project</h2>
        <p>Define your requirements and connect with pre-vetted domain specialists within hours.</p>
      </div>

      <div className="post-project-layout">
        {/* Form Container */}
        <form id="postProjectForm" className="post-form" onSubmit={handleSubmit}>
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
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
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
              rows="4"
              placeholder="Describe your project goals, scope of work, deliverables, and any specific architectural constraints..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Publish Project to Marketplace
          </button>
        </form>

        {/* Live Interactive Card Preview */}
        <div className="preview-container">
          <div className="preview-badge">Live Card Preview</div>
          <div className="project-card preview-box">
            <div className="card-top">
              <span className="category-pill">{category || 'Category'}</span>
              <span className="posted-time">Just now</span>
            </div>

            <h3 className="project-title">
              {title.trim() || 'Your Project Title Appears Here'}
            </h3>

            <p className="project-desc">
              {description.trim() ||
                'As you type your project details, this live interactive card will update in real-time, giving you an exact preview of how your listing appears to talent.'}
            </p>

            <div className="tag-list">
              {previewSkills.map((skill, index) => (
                <span key={index} className="tag">{skill}</span>
              ))}
            </div>

            <div className="card-client">
              <div className="client-avatar">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="client-meta">
                <span className="client-name">{currentUser?.name || 'Your Client Name'}</span>
                <span className="client-rating">⭐ 5.0 • India</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="budget-info">
                <span className="budget-label">Fixed Budget</span>
                <span className="budget-val">₹{budget ? Number(budget).toLocaleString() : '25,000'}</span>
              </div>
              <button type="button" className="btn btn-primary btn-sm" disabled style={{ opacity: 0.65, cursor: 'default' }}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default PostProjectSection;
