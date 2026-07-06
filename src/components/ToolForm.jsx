import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const ToolForm = ({ onToolAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState(''); // 1. Added description state
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    setIsLoading(true);
    setError(null);

    // 2. Include description in the payload object
    const tool = { name, category, quantity: Number(quantity), description };

    try {
      const response = await axios.post('/api/tools', tool, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // 3. Clear description field upon success
      setName('');
      setCategory('');
      setQuantity(1);
      setDescription('');

      onToolAdded(response.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Failed to add tool');
    }
  };

  return (
    <form className="create-tool-form" onSubmit={handleSubmit}>
      <h3>Add a New Tool</h3>

      <label>Tool Name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        required
        placeholder="e.g., Cordless Drill"
      />

      <label>Category:</label>
      <select
        onChange={(e) => setCategory(e.target.value)}
        value={category}
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        <option value="Power Tools">Power Tools</option>
        <option value="Hand Tools">Hand Tools</option>
        <option value="Gardening">Gardening</option>
        <option value="Measurement">Measurement</option>
        <option value="Other">Other</option>
      </select>

      <label>Quantity:</label>
      <input
        type="number"
        onChange={(e) => setQuantity(e.target.value)}
        value={quantity}
        min="1"
        required
      />

      {/* 4. Added Description Input Field */}
      <label>Description:</label>
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        placeholder="Describe the condition, notes, or usage instructions..."
        rows="3"
        required
      />

      <button disabled={isLoading} type="submit">
        {isLoading ? 'Adding Tool...' : 'Add Tool to Library'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default ToolForm;
