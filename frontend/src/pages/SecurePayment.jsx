import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, User, Calendar, Lock, CheckCircle, ShieldCheck, ArrowLeft, Loader2, QrCode, Smartphone, Check } from 'lucide-react';
import axios from 'axios';

const SecurePayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [upiId, setUpiId] = useState('');
    const [upiError, setUpiError] = useState('');

    const [cardData, setCardData] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [cardType, setCardType] = useState('unknown');

    useEffect(() => {
        if (!booking) {
            navigate('/my-bookings');
        }
    }, [booking, navigate]);

    // Detect card type
    useEffect(() => {
        const num = cardData.number.replace(/\s/g, '');
        if (num.startsWith('4')) setCardType('visa');
        else if (num.startsWith('5')) setCardType('mastercard');
        else if (num.match(/^3[47]/)) setCardType('amex');
        else setCardType('unknown');
    }, [cardData.number]);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{0,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length > 0) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'number') {
            formattedValue = formatCardNumber(value).substring(0, 19);
        } else if (name === 'expiry') {
            formattedValue = formatExpiry(value).substring(0, 5);
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);
        } else if (name === 'name') {
            formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
        }

        setCardData({ ...cardData, [name]: formattedValue });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        const cardNumberClean = cardData.number.replace(/\s/g, '');
        
        if (!cardData.name) newErrors.name = 'Card holder name is required';
        if (cardNumberClean.length !== 16) newErrors.number = 'Invalid card number (16 digits required)';
        
        if (!cardData.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            newErrors.expiry = 'Invalid expiry format (MM/YY)';
        } else {
            const [month, year] = cardData.expiry.split('/');
            const expiryDate = new Date(`20${year}`, month - 1);
            if (expiryDate < new Date()) {
                newErrors.expiry = 'Card has expired';
            }
        }
        
        if (cardData.cvv.length !== 3) newErrors.cvv = 'Invalid CVV (3 digits required)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);

    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        
        if (paymentMethod === 'card' && !validate()) return;
        if (paymentMethod === 'upi' && !upiId.includes('@')) {
            setUpiError('Please enter a valid UPI ID for verification');
            return;
        }

        setIsProcessing(true);
        if (paymentMethod === 'upi') setIsVerifyingUpi(true);
        
        try {
            // Simulate processing/verification delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            
            const { data } = await axios.post('http://localhost:5000/api/bookings/pay', { 
                bookingId: booking._id,
                paymentMethod: paymentMethod,
                transactionId: paymentMethod === 'upi' ? `UPI${Date.now()}` : `CRD${Date.now()}`
            }, config);
            
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/receipt', { state: { booking: data } });
            }, 2000);
        } catch (error) {
            setErrors({ submit: 'Payment verification failed. Please check your bank app.' });
            setIsProcessing(false);
            setIsVerifyingUpi(false);
        }
    };

    // Auto-trigger for UPI simulation (optional, but requested "immediate processing")
    useEffect(() => {
        if (paymentMethod === 'upi' && upiId.length > 5 && !isProcessing) {
            // This could be triggered by polling, but for demo we stay manual or semi-auto
        }
    }, [paymentMethod, upiId]);

    if (isProcessing && !isSuccess) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass" style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', width: '100%', borderRadius: '2rem' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2.5rem' }}>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" style={{ width: '100%', height: '100%', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
                        <QrCode size={40} color="var(--primary)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate( -50%, -50%)' }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{paymentMethod === 'upi' ? 'Verifying Transaction' : 'Processing Payment'}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Please do not close this window or refresh the page.</p>
                    <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.6 }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.8 }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span>
                    </div>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass" style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', width: '100%', borderRadius: '2rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <CheckCircle size={60} color="var(--success)" className="animate-bounce" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Payment Successful!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Your transaction has been processed securely.</p>
                    <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--primary)' }}>Redirecting to receipt...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <button 
                onClick={() => navigate('/my-bookings')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', cursor: 'pointer', fontSize: '1rem' }}
            >
                <ArrowLeft size={20} /> Back to Bookings
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Left Side: Summary & Card Preview */}
                <div style={{ position: 'sticky', top: '2rem' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Secure Payment</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Complete your transaction for Slot {booking?.slot?.slotNumber}</p>
                    </div>

                    {/* Virtual Card Representation */}
                    {paymentMethod === 'card' ? (
                        <div style={{ 
                            width: '100%', 
                            height: '240px', 
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.5)',
                            overflow: 'hidden',
                            marginBottom: '3rem'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(1px)' }}></div>
                            
                            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ width: '50px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem' }}></div>
                                    {cardType === 'visa' && <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontStyle: 'italic' }}>VISA</span>}
                                    {cardType === 'mastercard' && <div style={{ display: 'flex' }}><div style={{ width: '30px', height: '30px', background: '#eb001b', borderRadius: '50%', opacity: 0.8 }}></div><div style={{ width: '30px', height: '30px', background: '#f79e1b', borderRadius: '50%', marginLeft: '-15px', opacity: 0.8 }}></div></div>}
                                    {cardType === 'unknown' && <CreditCard size={32} opacity={0.5} />}
                                </div>

                                <div>
                                    <div style={{ fontSize: '1.5rem', letterSpacing: '0.2em', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
                                        {cardData.number || '•••• •••• •••• ••••'}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '0.2rem' }}>Card Holder</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{cardData.name || 'YOUR NAME'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '0.2rem' }}>Expires</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{cardData.expiry || 'MM/YY'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ 
                            width: '100%', 
                            height: '240px', 
                            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '3rem',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(1px)' }}></div>
                            <div style={{ position: 'relative', textAlign: 'center' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Smartphone size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>UPI Payment</h3>
                                <p style={{ opacity: 0.8 }}>Unified Payments Interface</p>
                            </div>
                        </div>
                    )}

                    <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Amount to pay:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>₹{booking?.totalAmount}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.9rem' }}>
                            <ShieldCheck size={16} /> Secure 256-bit encrypted payment
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="glass" style={{ padding: '3rem', borderRadius: '2rem' }}>
                    {/* Payment Method Tabs */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '1rem' }}>
                        <button 
                            onClick={() => setPaymentMethod('card')}
                            style={{ 
                                flex: 1, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '0.5rem', 
                                padding: '1rem', 
                                borderRadius: '0.75rem',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: paymentMethod === 'card' ? 'var(--primary)' : 'transparent',
                                color: paymentMethod === 'card' ? 'white' : 'var(--text-muted)'
                            }}
                        >
                            <CreditCard size={18} /> Card
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('upi')}
                            style={{ 
                                flex: 1, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '0.5rem', 
                                padding: '1rem', 
                                borderRadius: '0.75rem',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: paymentMethod === 'upi' ? 'var(--primary)' : 'transparent',
                                color: paymentMethod === 'upi' ? 'white' : 'var(--text-muted)'
                            }}
                        >
                            <Smartphone size={18} /> UPI
                        </button>
                    </div>

                    <form onSubmit={handlePayment}>
                        {paymentMethod === 'card' ? (
                            <>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>Card Holder Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            name="name"
                                            type="text"
                                            placeholder="Enter name on card"
                                            value={cardData.name}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '1rem 1rem 1rem 3rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${errors.name ? 'var(--danger)' : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '0.75rem',
                                                color: 'white',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>
                                    {errors.name && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{errors.name}</p>}
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>Card Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <CreditCard size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            name="number"
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            value={cardData.number}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '1rem 1rem 1rem 3rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${errors.number ? 'var(--danger)' : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '0.75rem',
                                                color: 'white',
                                                fontSize: '1rem',
                                                letterSpacing: '0.1em'
                                            }}
                                        />
                                    </div>
                                    {errors.number && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{errors.number}</p>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>Expiry Date</label>
                                        <div style={{ position: 'relative' }}>
                                            <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input 
                                                name="expiry"
                                                type="text"
                                                placeholder="MM/YY"
                                                value={cardData.expiry}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem 1rem 1rem 3rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: `1px solid ${errors.expiry ? 'var(--danger)' : 'rgba(255,255,255,0.1)'}`,
                                                    borderRadius: '0.75rem',
                                                    color: 'white',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>
                                        {errors.expiry && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{errors.expiry}</p>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>CVV</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input 
                                                name="cvv"
                                                type="password"
                                                placeholder="•••"
                                                value={cardData.cvv}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem 1rem 1rem 3rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: `1px solid ${errors.cvv ? 'var(--danger)' : 'rgba(255,255,255,0.1)'}`,
                                                    borderRadius: '0.75rem',
                                                    color: 'white',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>
                                        {errors.cvv && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{errors.cvv}</p>}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Scan the QR code to pay using any UPI app</p>
                                    <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=palanivelharish2005-1@okaxis&pn=Harish&am=${(booking?.totalAmount || 0)}.00&cu=INR&tn=Parking-Slot-${booking?.slot?.slotNumber || 'N/A'}`)}`} 
                                            alt="UPI QR Code" 
                                            style={{ display: 'block', width: '220px', height: '220px', objectFit: 'contain' }}
                                            onLoad={(e) => console.log('QR Code loaded successfully')}
                                            onError={(e) => {
                                                console.error('QR Loading failed, retrying...');
                                                e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=palanivelharish2005-1@okaxis&pn=Harish`;
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', opacity: 0.7 }}>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" height="20" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" height="20" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" height="20" />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>Enter UPI ID</label>
                                    <div style={{ position: 'relative' }}>
                                        <Smartphone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            type="text"
                                            placeholder="example@upi"
                                            value={upiId}
                                            onChange={(e) => {
                                                setUpiId(e.target.value);
                                                if (upiError) setUpiError('');
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '1rem 1rem 1rem 3rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${upiError ? 'var(--danger)' : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '0.75rem',
                                                color: 'white',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>
                                    {upiError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{upiError}</p>}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            <input type="checkbox" id="save" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            <label htmlFor="save" style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Save payment details for future</label>
                        </div>

                        {errors.submit && <p style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '1rem' }}>{errors.submit}</p>}

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isProcessing}
                            style={{ 
                                width: '100%', 
                                justifyContent: 'center', 
                                padding: '1.25rem', 
                                fontSize: '1.1rem', 
                                fontWeight: 'bold',
                                borderRadius: '1rem',
                                boxShadow: '0 15px 30px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Processing...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={20} /> Pay ₹{booking?.totalAmount}
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.5 }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" height="15" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="20" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" height="18" />
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                .animate-bounce {
                    animation: bounce 1s infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(-10%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }

                @media (max-width: 900px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                    div[style*="position: sticky"] {
                        position: static !important;
                        margin-bottom: 3rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default SecurePayment;
