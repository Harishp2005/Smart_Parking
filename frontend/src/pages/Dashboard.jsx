import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SlotCard from '../components/SlotCard';
import BookingModal from '../components/BookingModal';
import ParkingMap from '../components/ParkingMap';
import { LayoutDashboard, RefreshCw, Map as MapIcon, Grid } from 'lucide-react';

const Dashboard = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState('map'); // Default to the new impressive map view
    const [expandedFloors, setExpandedFloors] = useState({ 'Ground Floor': true, 'First Floor': true });

    const toggleFloor = (floor) => {
        setExpandedFloors(prev => ({ ...prev, [floor]: !prev[floor] }));
    };

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/slots');
            setSlots(data);
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleOpenModal = (slot) => {
        setSelectedSlot(slot);
        setShowModal(true);
    };

    const handleConfirmBooking = async (vehicleNumber, vehicleType) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) {
                alert('Please login to book a slot');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('http://localhost:5000/api/bookings/book', {
                slotId: selectedSlot?._id,
                vehicleNumber,
                vehicleType
            }, config);

            alert(`Slot ${selectedSlot?.slotNumber || 'Manual'} booked successfully!`);
            setShowModal(false);
            fetchSlots();
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <LayoutDashboard color="var(--primary)" />
                        Parking Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time status of all parking slots</p>
                </div>
                <button onClick={fetchSlots} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading slots...</div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                        <div className="glass" style={{ display: 'flex', padding: '0.4rem', borderRadius: '0.8rem', gap: '0.5rem' }}>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', border: 'none' }}
                            >
                                <Grid size={16} /> Grid View
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', border: 'none' }}
                            >
                                <MapIcon size={16} /> Map Layout
                            </button>
                        </div>
                    </div>

                    {viewMode === 'map' ? (
                        <ParkingMap slots={slots} onBook={handleOpenModal} />
                    ) : (
                        <div>
                            {['Ground Floor', 'First Floor', 'Second Floor'].map((floor, index) => {
                                const floorSlots = slots.filter(s => (s.floor || 'Ground Floor') === floor).sort((a, b) => a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true }));
                                if (floorSlots.length === 0) return null;

                                const groundSlots = slots.filter(s => (s.floor || 'Ground Floor') === 'Ground Floor');
                                const isGroundFloorFull = groundSlots.length > 0 && groundSlots.every(s => s.status !== 'available');


                                const firstFloorSlots = slots.filter(s => (s.floor || 'First Floor') === 'First Floor');
                                const isFloorFull = firstFloorSlots.length > 0 && firstFloorSlots.every(s => s.status !== 'available');

                                const availableSlots = floorSlots.filter(s => s.status === 'available');
                                const availableCount = availableSlots.length;
                                const availableSlotNumbers = availableSlots.map(s => s.slotNumber).join(', ');
                                const isExpanded = expandedFloors[floor] !== false; // Default to expanded if undefined

                                return (
                                    <div key={floor} style={{ marginBottom: '3rem' }}>
                                        <div className="glass" style={{
                                            padding: '2rem',
                                            borderRadius: '1rem',
                                            marginBottom: '1.5rem',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '1.5rem',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderLeft: `4px solid ${availableCount > 0 ? 'var(--success)' : 'var(--danger)'}`
                                        }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    Level 0{index + 1} Parking
                                                </h3>
                                                <p style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                                                    Available Slots: <span style={{ fontWeight: 'bold', color: availableCount > 0 ? 'var(--success)' : 'var(--danger)' }}>{availableCount}</span>
                                                </p>
                                                <p style={{ fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                                                    Slots: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{availableSlotNumbers || 'None'}</span>
                                                </p>
                                                <p style={{ color: 'var(--text-muted)' }}>Select a slot to park your vehicle.</p>
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button
                                                    className={`btn ${isExpanded ? 'btn-primary' : 'btn-outline'}`}
                                                    onClick={() => toggleFloor(floor)}
                                                >
                                                    {isExpanded ? 'Hide Slots' : 'Choose Slot'}
                                                </button>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        const firstAvailable = floorSlots.find(s => s.status === 'available');
                                                        if (firstAvailable) {
                                                            handleOpenModal(firstAvailable);
                                                        } else {
                                                            alert(`No slots available on ${floor}`);
                                                        }
                                                    }}
                                                    disabled={availableCount === 0}
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                                {floorSlots.map(slot => (
                                                    <SlotCard key={slot._id} slot={slot} onBook={handleOpenModal} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <BookingModal
                    slot={selectedSlot}
                    onConfirm={handleConfirmBooking}
                    onClose={() => setShowModal(false)}
                />
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
