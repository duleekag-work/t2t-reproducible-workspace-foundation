import { useEffect, useState } from 'react';

// Supplied by the environment, not hardcoded. Changing it needs no code change.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  async function loadItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items`);
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      setItems(await response.json());
      setError(null);
    } catch (cause) {
      setError(cause.message);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function addItem(event) {
    event.preventDefault();
    if (name.trim() === '') return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      setName('');
      await loadItems();
    } catch (cause) {
      setError(cause.message);
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '40rem', margin: '3rem auto' }}>
      <h1>Dev Container Demo</h1>
      <p>
        This page is served from one container, calls an API in the same container, which reads a
        MongoDB running in a second container. Nothing was installed on your machine.
      </p>

      <form onSubmit={addItem}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Add an item"
          maxLength={80}
          aria-label="Item name"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p role="alert">Could not reach the API: {error}</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <p>
        API base URL: <code>{API_BASE_URL}</code>
      </p>
    </main>
  );
}
