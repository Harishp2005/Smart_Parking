import React, { useState } from 'react';
import { X, Car, Bike, Truck, CheckCircle } from 'lucide-react';

const BookingModal = ({ slot, onConfirm, onClose }) => {
    const [step, setStep] = useState(1);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('Car');

    const getAmount = () => {
        if (vehicleType === 'Bike') return 100;
        if (vehicleType === 'Truck') return 300;
        return 200;
    };

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(vehicleNumber, vehicleType);
    };

    const amount = getAmount();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="glass" style={{ width: '100%', maxWidth: '450px', position: 'relative', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                {step === 1 ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <Car size={32} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Book Slot {slot.slotNumber}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Enter your vehicle details to proceed</p>
                        </div>

                        <form onSubmit={handleNext}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Vehicle License Plate</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. MH 12 AB 1234"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                    required
                                    className="glass"
                                    style={{ width: '100%', padding: '1rem', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1rem' }}
                                />
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                    Select your vehicle type
                                </label>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    {[
                                        { type: 'Bike' },
                                        { type: 'Car' },
                                        { type: 'Truck' }
                                    ].map(({ type }) => (
                                        <div 
                                            key={type}
                                            onClick={() => setVehicleType(type)}
                                            style={{
                                                padding: '1.25rem 0.5rem',
                                                textAlign: 'center',
                                                borderRadius: '1rem',
                                                cursor: 'pointer',
                                                border: `2px solid ${vehicleType === type ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                                                background: vehicleType === type ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            {type === 'Car' && <Car size={24} style={{ marginBottom: '0.5rem' }} />}
                                            {type === 'Bike' && <Bike size={24} style={{ marginBottom: '0.5rem' }} />}
                                            {type === 'Truck' && <Truck size={24} style={{ marginBottom: '0.5rem' }} />}
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{type}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.1rem', fontSize: '1rem', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
                                Proceed to Payment
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <CheckCircle size={48} color="var(--success)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: 'white' }}>Booking Confirmed!</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Your parking slot has been reserved</p>
                        </div>

                        <div style={{ borderTop: '1px dashed var(--glass-border)', borderBottom: '1px dashed var(--glass-border)', padding: '2rem 0', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Slot Number:</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Slot {slot.slotNumber}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Vehicle Type:</span>
                                <span style={{ fontWeight: 'bold' }}>{vehicleType}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Vehicle Number:</span>
                                <span style={{ fontWeight: 'bold' }}>{vehicleNumber}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Amount:</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{amount}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <button 
                                type="submit" 
                                className="btn" 
                                style={{ 
                                    width: '100%', 
                                    justifyContent: 'center', 
                                    padding: '1.25rem', 
                                    fontSize: '1.1rem', 
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #d946ef 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '1rem',
                                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                                    marginBottom: '1rem'
                                }}
                            >
                                Complete Booking
                            </button>

                            <div style={{ textAlign: 'center' }}>
                                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Back
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
