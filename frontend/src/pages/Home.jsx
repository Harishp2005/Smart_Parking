import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Revolutionize Your <br /> <span style={{ color: 'var(--primary)' }}>Parking Experience</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px', marginInline: 'auto' }}>
                Smart, secure, and seamless parking solutions for modern cities. Find, book, and park in seconds.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '6rem' }}>
                <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Get Started</Link>
                <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Learn More</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
                <div className="glass" style={{ padding: '2rem', textAlign: 'left' }}>
                    <Zap color="var(--primary)" size={40} style={{ marginBottom: '1rem' }} />
                    <h3>Instant Booking</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Book your parking slot in real-time with our lightning-fast API.</p>
                </div>
                <div className="glass" style={{ padding: '2rem', textAlign: 'left' }}>
                    <ShieldCheck color="var(--primary)" size={40} style={{ marginBottom: '1rem' }} />
                    <h3>Secure Payment</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Your transactions are encrypted and processed securely.</p>
                </div>
                <div className="glass" style={{ padding: '2rem', textAlign: 'left' }}>
                    <Clock color="var(--primary)" size={40} style={{ marginBottom: '1rem' }} />
                    <h3>Automated Tracking</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time entry and exit tracking for hassle-free parking.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
