import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Car, ExternalLink, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [bookingToExit, setBookingToExit] = useState(null);
    const navigate = useNavigate();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/bookings/my', config);
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const confirmExitDialog = (booking) => {
        setBookingToExit(booking);
        setShowExitConfirm(true);
    };

    const proceedWithExit = () => {
        setShowExitConfirm(false);
        if (bookingToExit) {
            handleExit(bookingToExit._id);
        }
    };

    const handleExit = async (bookingId) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/bookings/exit', { bookingId }, config);
            navigate('/payment', { state: { booking: data } });
        } catch (error) {
            alert(error.response?.data?.message || 'Exit failed');
        }
    };


    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock color="var(--primary)" />
                    My Parking History
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Track your active and past parking sessions</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading your history...</div>
            ) : bookings.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>You have no bookings yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map(booking => (
                        <div key={booking._id} className="glass" style={{
                            padding: '1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: `4px solid ${booking.status === 'cancelled' ? 'var(--danger)' : booking.exitTime ? 'var(--text-muted)' : 'var(--success)'}`
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem' }}>
                                    <Car color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>Slot {booking.slot?.slotNumber || 'N/A'}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                                        Vehicle: <span style={{ fontWeight: 'bold' }}>{booking.vehicleNumber}</span> ({booking.vehicleType})
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Entry: {new Date(booking.entryTime).toLocaleString()}
                                    </p>
                                    {booking.exitTime && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            Exit: {new Date(booking.exitTime).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                {booking.status === 'cancelled' ? (
                                    <div>
                                        <p style={{ fontWeight: 'bold', color: 'var(--danger)' }}>Cancelled</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cancelled by Admin</span>
                                    </div>
                                ) : booking.exitTime ? (
                                    <div>
                                        <p style={{ fontWeight: 'bold', color: 'var(--success)' }}>Paid: ₹{booking.totalAmount}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</span>
                                    </div>
                                ) : (
                                    <button onClick={() => confirmExitDialog(booking)} className="btn btn-primary">
                                        <ExternalLink size={18} />
                                        Exit Slot
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showExitConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '1.5rem', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Clock size={32} color="var(--primary)" />
                        </div>
                        <h2 style={{ marginBottom: '1rem', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>Your parking session is active.</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                            Exiting now will stop the session and calculate your parking fee.
                        </p>
                        <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Do you want to continue to secure payment?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={proceedWithExit} className="btn btn-primary" style={{ flex: 1.5, padding: '1rem', justifyContent: 'center' }}>
                                <Check size={20} /> Yes, Exit & Pay
                            </button>
                            <button onClick={() => setShowExitConfirm(false)} className="btn btn-outline" style={{ flex: 1, padding: '1rem', justifyContent: 'center' }}>
                                <X size={20} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
