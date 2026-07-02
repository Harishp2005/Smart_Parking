import React from 'react';
import { Link } from 'react-router-dom';
import { Car, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass" style={{ margin: '1rem', borderRadius: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <Car size={32} color="var(--primary)" />
                <span>SmartPark</span>
            </Link>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>Home</Link>
                {user && <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>Dashboard</Link>}
                {user && user.role !== 'admin' && <Link to="/my-bookings" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>My Bookings</Link>}
                {user && user.role === 'admin' && <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600' }}>Admin Panel</Link>}
                {user ? (
                    <>
                        <span style={{ color: 'var(--text-muted)' }}>Hello, {user.name}</span>
                        <button onClick={logout} className="btn btn-outline">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline">
                            <LogIn size={18} />
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            <UserPlus size={18} />
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
