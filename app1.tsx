import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Define the Event interface
interface Event {
  id: string;
  name: string;
  date: string;
}

// Define the formData type
interface FormData {
  name: string;
  date: string;
  message: string;
  image: File | null;  // image can either be a File or null
}

// LoginPage Component
const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Login</h1>
      <button
        onClick={() => navigate('/home')}
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Skip Login
      </button>
    </div>
  );
};

// HomePage Component
const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch events from the backend
    axios
      .get('/api/events')
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data as Event[]);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Events</h1>
      <div className="row">
        {events.length === 0 ? (
          <p>No events available. Please check back later.</p>
        ) : (
          events.map((event) => (
            <div className="col-md-4" key={event.id} style={{ marginBottom: '20px' }}>
              <div
                className="card"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <h5 className="card-title">{event.name || 'Unnamed Event'}</h5>
                <p className="card-text">{event.date || 'Date not specified'}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  Register
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// EventPage Component
const EventPage = () => {
  const { eventId } = useParams();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    date: '',
    message: '',
    image: null,  // Set the initial value as null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('date', formData.date);
    data.append('message', formData.message);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post(`/api/events/${eventId}/register`, data);
      alert('Registration successful');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration. Please try again.');
    }
  };

  return (
    <div className="event-page" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Register for Event</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Name"
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="date"
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <textarea
          placeholder="Message"
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          style={{ width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
      </Routes>
    </Router>
  );
};

export default App;
