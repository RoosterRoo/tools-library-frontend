import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import ToolForm from '../components/ToolForm';

const API_URL = 'https://tools-library-backend.onrender.com';

const Home = () => {
  const [tools, setTools] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/tools/dashboard`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setTools(response.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.response?.data?.error || 'Failed to fetch tools');
      }
    };

    if (user) {
      fetchTools();
    }
  }, [user]);

  const handleToolAdded = (newTool) => {
    setTools((prevTools) => [newTool, ...prevTools]);
  };

  // 🗑️ Handle Delete Request
  const handleDelete = async (toolId) => {
    if (!user) return;

    try {
      // Send DELETE request to your backend with the tool's unique ID
      await axios.delete(`${API_URL}/api/tools/${toolId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Instantly remove the deleted tool from local state so the UI updates
      setTools((prevTools) => prevTools.filter((tool) => tool._id !== toolId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete the tool');
    }
  };

  const handleBorrow = async (toolId) => {
    if (!user) return;

    try {
      const response = await axios.patch(
        `${API_URL}/api/tools/${toolId}/borrow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      // Update the local state array with the updated tool document
      setTools((prevTools) =>
        prevTools.map((t) => (t._id === toolId ? response.data : t)),
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update borrow status');
    }
  };

  return (
    <div className="home-container">
      <div className="home-layout">
        <div className="tools-section">
          <h2>Your Tool Inventory</h2>
          <p className="section-subtitle">
            Manage and track the tools you've added to the library
          </p>

          {isLoading && <div className="loading">Loading your tools...</div>}
          {error && <div className="error-message">{error}</div>}

          {tools && tools.length > 0 && (
            <div className="tools-grid">
              {tools.map((tool) => {
                return (
                  <div
                    className={`tool-card ${tool.status.toLowerCase()}`}
                    key={tool._id}
                  >
                    <div className="tool-card-header">
                      <h4>{tool.name}</h4>
                      {/* Only show delete button if current user is the owner */}
                      {user && tool.owner === user._id && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(tool._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p>
                      <strong>Category:</strong> {tool.category}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {tool.quantity}
                    </p>
                    <p>
                      <strong>Description:</strong> {tool.description}
                    </p>

                    {/* 🏷️ Status Badge */}
                    <p>
                      <strong>Status:</strong>{' '}
                      <span
                        className={`status-badge ${tool.status.toLowerCase()}`}
                      >
                        {tool.status}
                      </span>
                    </p>

                    {/* 🛠️ Borrow / Return Action Button */}
                    <div className="card-actions">
                      {user && tool.owner !== user.id ? (
                        /* Condition A: The logged-in user is NOT the owner -> Show Borrow/Return button */
                        <button
                          className={`borrow-btn ${tool.status === 'Borrowed' ? 'return' : ''}`}
                          onClick={() => handleBorrow(tool._id)}
                        >
                          {tool.status === 'Available'
                            ? 'Borrow Tool'
                            : 'Return Tool'}
                        </button>
                      ) : (
                        /* Condition B: The logged-in user IS the owner -> Show a friendly ownership label instead */
                        <p className="owner-label">
                          ✨ You are lending this tool
                        </p>
                      )}
                    </div>

                    <p className="tool-date">
                      Added: {new Date(tool.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {tools && tools.length === 0 && (
            <div className="empty-state">
              <p>You haven't added any tools to your inventory yet!</p>
            </div>
          )}
        </div>

        <ToolForm onToolAdded={handleToolAdded} />
      </div>
    </div>
  );
};

export default Home;
