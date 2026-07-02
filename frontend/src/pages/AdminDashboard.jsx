import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, LayoutDashboard, Database, DollarSign, ListFilter, Trash2, Plus, Search, Map as MapIcon } from 'lucide-react';
import ParkingMap from '../components/ParkingMap';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSlotNumber, setNewSlotNumber] = useState('');
    const [newSlotFloor, setNewSlotFloor] = useState('Ground Floor');
    const [newSlotPrice, setNewSlotPrice] = useState(200);
    const [filterFloor, setFilterFloor] = useState('All Floors');
    const [activeTab, setActiveTab] = useState('management');
    const [userSearch, setUserSearch] = useState('');
    const [bookingSearch, setBookingSearch] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const [statsRes, usersRes, bookingsRes, slotsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', config),
                axios.get('http://localhost:5000/api/admin/users', config),
                axios.get('http://localhost:5000/api/admin/bookings', config),
                axios.get('http://localhost:5000/api/slots', config)
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setBookings(bookingsRes.data);
            setSlots(slotsRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (!newSlotNumber) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('http://localhost:5000/api/admin/slots', {
                slotNumber: newSlotNumber,
                floor: newSlotFloor,
                price: newSlotPrice
            }, config);
            setNewSlotNumber('');
            setNewSlotFloor('Ground Floor');
            setNewSlotPrice(200);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add slot');
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slot?')) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`http://localhost:5000/api/admin/slots/${id}`, config);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete slot');
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`http://localhost:5000/api/admin/bookings/${id}/cancel`, {}, config);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredBookings = bookings.filter(b =>
        b.user?.name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.slot?.slotNumber?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.vehicleNumber?.toLowerCase().includes(bookingSearch.toLowerCase())
    );

    if (loading) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Database color="var(--primary)" />
                    System Administration
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Overarching system monitoring and statistics</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Users color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                    <h2 style={{ fontSize: '2rem' }}>{stats.userCount}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Total Users</p>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <LayoutDashboard color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                    <h2 style={{ fontSize: '2rem' }}>{stats.slotCount}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Parking Slots</p>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Database color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                    <h2 style={{ fontSize: '2rem' }}>{stats.activeBookings}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Active Bookings</p>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <DollarSign color="var(--success)" style={{ marginBottom: '0.5rem' }} />
                    <h2 style={{ fontSize: '2rem' }}>₹{stats.totalRevenue}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Total Revenue</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('management')}
                    className={`btn ${activeTab === 'management' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ display: 'flex', gap: '0.5rem', border: 'none' }}
                >
                    <LayoutDashboard size={18} /> Slot Management
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    className={`btn ${activeTab === 'map' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ display: 'flex', gap: '0.5rem', border: 'none' }}
                >
                    <MapIcon size={18} /> Interactive Map
                </button>
            </div>

            {activeTab === 'map' ? (
                <div className="glass" style={{ padding: '2rem', marginBottom: '4rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Full Layout Overview</h3>
                    <ParkingMap slots={slots} onBook={() => { }} />
                </div>
            ) : (
                <div className="glass" style={{ padding: '2rem', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LayoutDashboard size={20} />
                            Slot Management
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Filter Floor:</span>
                            <select
                                value={filterFloor}
                                onChange={(e) => setFilterFloor(e.target.value)}
                                className="glass"
                                style={{ padding: '0.4rem 0.8rem', border: '1px solid var(--glass-border)', color: 'white', backgroundColor: 'transparent', fontSize: '0.85rem' }}
                            >
                                <option value="All Floors" style={{ color: 'black' }}>All Floors</option>
                                <option value="Ground Floor" style={{ color: 'black' }}>Ground Floor</option>
                                <option value="First Floor" style={{ color: 'black' }}>First Floor</option>
                                <option value="Second Floor" style={{ color: 'black' }}>Level 2 (Second Floor)</option>
                            </select>
                        </div>
                    </div>
                    <form onSubmit={handleAddSlot} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <input
                            type="text"
                            placeholder="New Slot Number (e.g. A11)"
                            value={newSlotNumber}
                            onChange={(e) => setNewSlotNumber(e.target.value)}
                            className="glass"
                            style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--glass-border)', color: 'white' }}
                        />
                        <select
                            value={newSlotFloor}
                            onChange={(e) => setNewSlotFloor(e.target.value)}
                            className="glass"
                            style={{ padding: '0.75rem', border: '1px solid var(--glass-border)', color: 'white', backgroundColor: 'transparent' }}
                        >
                            <option value="Ground Floor" style={{ color: 'black' }}>Ground Floor</option>
                            <option value="First Floor" style={{ color: 'black' }}>First Floor</option>
                            <option value="Second Floor" style={{ color: 'black' }}>Level 2 (Second Floor)</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Price (₹)"
                            value={newSlotPrice}
                            onChange={(e) => setNewSlotPrice(e.target.value)}
                            className="glass"
                            style={{ width: '100px', padding: '0.75rem', border: '1px solid var(--glass-border)', color: 'white' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                            <Plus size={18} /> Add Slot
                        </button>
                    </form>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                        {slots
                            .filter(s => filterFloor === 'All Floors' || (s.floor || 'Ground Floor') === filterFloor)
                            .sort((a, b) => (a.slotNumber || '').localeCompare(b.slotNumber || '', undefined, { numeric: true }))
                            .map(s => (
                                <div key={s._id} className="glass" style={{ padding: '1rem', textAlign: 'center', position: 'relative' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{s.slotNumber}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.floor || 'Ground Floor'}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹{s.price || 200}</p>
                                    <p style={{ fontSize: '0.7rem', color: s.status === 'available' ? 'var(--success)' : 'var(--danger)' }}>
                                        {s.status}
                                    </p>
                                    <button
                                        onClick={() => handleDeleteSlot(s._id)}
                                        style={{
                                            position: 'absolute',
                                            top: '0.5rem',
                                            right: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--danger)',
                                            cursor: 'pointer',
                                            opacity: 0.6
                                        }}
                                        title="Delete Slot"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={20} />
                            User Directory
                        </h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="glass"
                                style={{ padding: '0.5rem 0.75rem 0.5rem 2.25rem', fontSize: '0.85rem', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Name</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Email</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{u.name}</td>
                                        <td style={{ padding: '1rem' }}>{u.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? 'var(--primary)' : 'white' }}>
                                                {u.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Booking Details
                        </h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={bookingSearch}
                                onChange={(e) => setBookingSearch(e.target.value)}
                                className="glass"
                                style={{ padding: '0.5rem 0.75rem 0.5rem 2.25rem', fontSize: '0.85rem', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>User</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Slot</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Vehicle No</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Vehicle Type</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.slice(0, 10).map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{b.user?.name || 'N/A'}</td>
                                        <td style={{ padding: '1rem' }}>{b.slot?.slotNumber || 'N/A'}</td>
                                        <td style={{ padding: '1rem' }}>{b.vehicleNumber || 'N/A'}</td>
                                        <td style={{ padding: '1rem' }}>{b.vehicleType || 'N/A'}</td>
                                        <td style={{ padding: '1rem' }}>₹{b.totalAmount || 0}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {b.status === 'active' || (!b.exitTime && b.status !== 'cancelled' && b.status !== 'completed') ? (
                                                <button
                                                    onClick={() => handleCancelBooking(b._id)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{b.status || (b.exitTime ? 'completed' : 'active')}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
