import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import ProjectForm from '../components/ProjectForm';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch projects');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentProject(null);
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token'),
        },
      };

      if (currentProject) {
        await axios.put(`/api/projects/${currentProject._id}`, formData, config);
        toast.success('Project updated successfully');
      } else {
        await axios.post('/api/projects', formData, config);
        toast.success('Project added successfully');
      }

      setShowForm(false);
      fetchProjects();
    } catch (err) {
      toast.error('Failed to save project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={handleAdd} className="btn btn-primary flex items-center gap-2">
          <FaPlus /> Add Project
        </button>
      </div>

      {showForm ? (
        <ProjectForm
          project={currentProject}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="card overflow-hidden">
          {projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Tech Stack</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td className="font-medium">{project.title}</td>
                      <td className="max-w-xs truncate">{project.description}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech, index) => (
                            <span key={index} className="badge badge-primary">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="badge badge-primary">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="btn btn-outline p-2"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="btn btn-outline p-2 text-red-500 hover:bg-red-500 hover:text-white"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline p-2"
                              title="GitHub"
                            >
                              <FaGithub />
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline p-2"
                              title="Live Demo"
                            >
                              <FaExternalLinkAlt />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">No projects found</p>
              <button onClick={handleAdd} className="btn btn-primary">
                Add Your First Project
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;