import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Printer, Download, Home } from 'lucide-react';

const Receipt = () => {
    const location = useLocation();
    const booking = location.state?.booking;

    if (!booking) {
        return <div className="container">No receipt found.</div>;
    }

    return (
        <div className="container" style={{ paddingTop: '4rem', display: 'flex', justifyContent: 'center' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={48} color="var(--success)" />
                    </div>
                    <h1>Payment Successful!</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Thank you for using SmartPark</p>
                </div>

                <div style={{ borderTop: '1px dashed var(--glass-border)', borderBottom: '1px dashed var(--glass-border)', padding: '2rem 0', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Slot Number:</span>
                        <span style={{ fontWeight: 'bold' }}>{booking.slot?.slotNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Vehicle Number:</span>
                        <span style={{ fontWeight: 'bold' }}>{booking.vehicleNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Vehicle Type:</span>
                        <span style={{ fontWeight: 'bold' }}>{booking.vehicleType}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Entry Time:</span>
                        <span>{new Date(booking.entryTime).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Exit Time:</span>
                        <span>{new Date(booking.exitTime).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                        <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{booking.paymentMethod || 'CARD'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Transaction ID:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{booking.transactionId || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total Paid:</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{booking.totalAmount}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button onClick={() => window.print()} className="btn btn-outline" style={{ justifyContent: 'center' }}>
                        <Printer size={18} />
                        Print Receipt
                    </button>
                    <Link to="/" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                        <Home size={18} />
                        Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Receipt;
