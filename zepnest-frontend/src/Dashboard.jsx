import { useState, useEffect } from 'react';

export default function Dashboard({ token }) {
  const [requests, setRequests] = useState([]);
  const [newReq, setNewReq] = useState({ 
    title: '', 
    address: '', 
    description: '',
    category: 'General', // Added explicit default matching schema
    preferred_time: null,
    image_url: null
  });

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newReq)
      });
      
      const data = await res.json();

      if (!res.ok) {
        // This will intercept validation errors (like 422) or database errors (500)
        alert(`Backend Error (${res.status}): ${JSON.stringify(data.detail)}`);
        return;
      }

      // If successful, reset list and clear form fields
      fetchRequests();
      setNewReq({ title: '', address: '', description: '', category: 'General', preferred_time: null, image_url: null });
    } catch (err) {
      // This catches total connection dropouts
      alert(`Network Failure: Could not reach backend server. Context: ${err.message}`);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchRequests();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const deleteRequest = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchRequests();
    } catch (err) {
      alert(`Failed to delete request: ${err.message}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white p-4 rounded shadow h-fit">
        <h3 className="font-bold text-lg mb-4">New Request</h3>
        <form onSubmit={handleCreate} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Title" required value={newReq.title} onChange={e => setNewReq({...newReq, title: e.target.value})} />
          <input className="w-full border p-2 rounded" placeholder="Address" required value={newReq.address} onChange={e => setNewReq({...newReq, address: e.target.value})} />
          <textarea className="w-full border p-2 rounded" placeholder="Description" value={newReq.description} onChange={e => setNewReq({...newReq, description: e.target.value})} />
          <button className="w-full bg-green-600 text-white p-2 rounded font-medium hover:bg-green-700 transition">Create</button>
        </form>
      </div>

      <div className="md:col-span-2 space-y-4">
        <h3 className="font-bold text-lg">My Requests</h3>
        {requests.length === 0 ? (
          <p className="text-gray-500 italic">No service requests found. Create one on the left!</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h4 className="font-bold text-gray-800">{req.title}</h4>
                <p className="text-sm text-gray-600">{req.address}</p>
                {req.description && <p className="text-xs text-gray-500 mt-1">{req.description}</p>}
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded mt-2 bg-blue-100 text-blue-800">
                  {req.status}
                </span>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <select className="border rounded p-1 text-sm bg-gray-50" value={req.status} onChange={(e) => updateStatus(req.id, e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button onClick={() => deleteRequest(req.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}