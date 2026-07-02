import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const PaymentModal = ({ booking, onPaymentSuccess, onClose }) => {
    const [processing, setProcessing] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        // Simulate payment processing delay
        setTimeout(() => {
            onPaymentSuccess();
            setProcessing(false);
        }, 2000);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="glass" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={48} color="var(--success)" />
                    </div>
                    <h2>Exit & Payment Confirmed</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Total Amount: <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>₹{booking.totalAmount}</span></p>
                </div>

                <div style={{ borderTop: '1px dashed var(--glass-border)', borderBottom: '1px dashed var(--glass-border)', padding: '1.5rem 0', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Slot Number:</span>
                        <span style={{ fontWeight: 'bold' }}>{booking.slot?.slotNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                        <span style={{ fontWeight: 'bold' }}>{booking.duration || 'Calculated'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Vehicle:</span>
                        <span style={{ fontWeight: 'bold' }}>{booking.vehicleNumber} ({booking.vehicleType})</span>
                    </div>
                </div>

                <button 
                    onClick={handlePayment} 
                    className="btn btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', height: '3.5rem' }}
                    disabled={processing}
                >
                    {processing ? 'Processing...' : 'Confirm & Close'}
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;
