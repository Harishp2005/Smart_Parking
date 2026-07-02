import React from 'react';
import { Car, CheckCircle, XCircle } from 'lucide-react';

const SlotCard = ({ slot, onBook }) => {
    const isAvailable = slot.status === 'available';

    return (
        <div className="glass" style={{ 
            padding: '1.5rem', 
            textAlign: 'center', 
            border: `1px solid ${isAvailable ? 'var(--success)' : 'var(--danger)'}`,
            transition: 'transform 0.3s ease'
        }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <Car size={40} color={isAvailable ? 'var(--success)' : 'var(--danger)'} />
            </div>
            <h3 style={{ marginBottom: '0.25rem' }}>Slot {slot.slotNumber}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{slot.floor || 'Ground Floor'}</p>
            <p style={{ 
                color: isAvailable ? 'var(--success)' : 'var(--danger)', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                marginBottom: '1.5rem'
            }}>
                {isAvailable ? 'Available' : 'Occupied'}
            </p>
            <p style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                ₹{slot.price || 200} / hr
            </p>
            
            <button 
                className={`btn ${isAvailable ? 'btn-primary' : 'btn-outline'}`}
                disabled={!isAvailable}
                onClick={() => onBook(slot)}
                style={{ width: '100%', justifyContent: 'center', opacity: isAvailable ? 1 : 0.5 }}
            >
                {isAvailable ? 'Book Now' : 'Reserved'}
            </button>
        </div>
    );
};

export default SlotCard;
