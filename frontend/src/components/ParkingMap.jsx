import React, { useRef, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Shield, Lightbulb, Wind, Activity, Zap, Thermometer, Lock, Database } from 'lucide-react';

const ParkingMap = ({ slots, onBook }) => {
    const groundSlots = slots.filter(s => (s.floor || 'Ground Floor') === 'Ground Floor').sort((a, b) => a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true })).slice(0, 10);
    const firstSlots = slots.filter(s => s.floor === 'First Floor').sort((a, b) => a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true })).slice(0, 10);
    const secondSlots = slots.filter(s => s.floor === 'Second Floor').sort((a, b) => a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true })).slice(0, 10);

    const isGroundFloorFull = groundSlots.length > 0 && groundSlots.every(s => s.status !== 'available');
    const firstFloorRef = useRef(null);
    const secondFloorRef = useRef(null);

    useEffect(() => {
        if (isGroundFloorFull && firstFloorRef.current) {
            // Automatically scroll to first floor if ground floor is full
            firstFloorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isGroundFloorFull]);

    const renderSlot = (slot) => {
        const isAvailable = slot.status === 'available';
        return (
            <div
                key={slot._id}
                onClick={() => isAvailable && onBook(slot)}
                style={{
                    padding: '1rem',
                    textAlign: 'center',
                    borderRadius: '0.75rem',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    border: `1px solid ${isAvailable ? 'rgba(34, 211, 238, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
                    background: isAvailable ? 'rgba(34, 211, 238, 0.05)' : 'rgba(244, 63, 94, 0.1)',
                    boxShadow: isAvailable ? '0 0 20px rgba(34, 211, 238, 0.15)' : 'none',
                    position: 'relative',
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
                className={`map-slot-base ${isAvailable ? 'pulse-available' : ''}`}
            >
                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '900',
                    color: isAvailable ? 'var(--primary)' : 'var(--danger)',
                    textShadow: isAvailable ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none'
                }}>
                    {slot.slotNumber}
                </div>

                {!isAvailable && (
                    <div style={{ fontSize: '0.6rem', color: 'var(--danger)', fontWeight: 'bold' }}>OCCUPIED</div>
                )}
            </div>
        );
    };

    const renderHUD = (level) => (
        <div style={{ display: 'flex', gap: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={16} color="var(--primary)" />
                <div>
                    <div className="hud-label">{level} Status</div>
                    <div className="hud-value">OPTIMAL</div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} color="#fbbf24" />
                <div>
                    <div className="hud-label">Lighting</div>
                    <div className="hud-value">100% LED</div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer size={16} color="#10b981" />
                <div>
                    <div className="hud-label">Ventilation</div>
                    <div className="hud-value">ACTIVE</div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', padding: '2rem' }}>
            {/* Ground Floor Layout */}
            <div>
                <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '2px' }}>01 / GROUND FLOOR</h2>
                {renderHUD('Ground')}

                <div style={{ position: 'relative', display: 'flex', gap: '2rem', alignItems: 'stretch' }}>
                    {/* Entry Path */}
                    <div style={{ width: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '2px dashed var(--glass-border)' }}>
                        <ArrowRight size={32} color="var(--primary)" />
                        <span style={{ writingMode: 'vertical-rl', fontSize: '0.8rem', color: 'var(--text-muted)', transform: 'rotate(180deg)', marginTop: '1rem' }}>ENTRY PATH</span>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
                            {groundSlots.map(renderSlot)}
                        </div>
                    </div>

                    {/* Ramp Up */}
                    <div style={{ width: '120px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '1rem', border: '2px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                        <ArrowUpRight size={40} color="var(--primary)" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center', marginTop: '0.5rem' }}>UPWARD RAMP TO FIRST FLOOR</span>
                        <div style={{ width: '100%', height: '4px', background: 'repeating-linear-gradient(90deg, var(--primary) 0, var(--primary) 5px, transparent 5px, transparent 10px)', marginTop: '1rem' }} />
                    </div>
                </div>
            </div>

            {/* First Floor Layout */}
            <div ref={firstFloorRef} style={{ position: 'relative' }}>
                <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '1.5rem', border: '2px solid var(--glass-border)', boxShadow: '0 0 40px rgba(0,0,0,0.5)', transition: 'all 0.5s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                        <div>
                            <span className="hud-label" style={{ color: 'var(--primary)', letterSpacing: '4px' }}>LEVEL 02</span>
                            <h2 style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: '900', marginTop: '0.5rem' }}>FIRST FLOOR</h2>
                        </div>
                        {renderHUD('First')}
                    </div>

                    <div style={{ position: 'relative', display: 'flex', gap: '3rem', alignItems: 'stretch' }}>
                        {/* Ramp Downward (LEFT SIDE) */}
                        <div style={{ width: '140px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem', border: '3px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.5rem', boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.2)' }}>
                            <div style={{ transform: 'rotate(180deg)', marginBottom: '1rem' }}><ArrowUpRight size={48} color="var(--primary)" /></div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '900', textAlign: 'center', color: 'var(--primary)' }}>DOWNWARD RAMP TO GROUND</span>
                            <div style={{ width: '100%', height: '8px', background: 'repeating-linear-gradient(90deg, var(--primary) 0, var(--primary) 10px, transparent 10px, transparent 20px)', marginTop: '1.5rem' }} />
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Top row of slots */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
                                {firstSlots.slice(0, 5).map(renderSlot)}
                            </div>

                            {/* Driving Lane marking */}
                            <div style={{ height: '60px', borderTop: '2px dashed var(--glass-border)', borderBottom: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.3 }}>
                                    <ArrowRight size={20} />
                                    <span style={{ letterSpacing: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>DRIVING LANE</span>
                                    <ArrowRight size={20} />
                                </div>
                            </div>

                            {/* Bottom row of slots */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
                                {firstSlots.slice(5, 10).map(renderSlot)}
                            </div>
                        </div>

                        {/* Ramp Upward to Second (RIGHT SIDE) */}
                        <div style={{ width: '140px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem', border: '3px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.5rem', boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.2)' }}>
                            <ArrowUpRight size={48} color="var(--primary)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: '900', textAlign: 'center', color: 'var(--primary)' }}>UPWARD RAMP TO SECOND FLOOR</span>
                            <div style={{ width: '100%', height: '8px', background: 'repeating-linear-gradient(90deg, var(--primary) 0, var(--primary) 10px, transparent 10px, transparent 20px)', marginTop: '1.5rem' }} />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Shield size={20} color="var(--primary)" />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <strong style={{ color: 'white' }}>SAFETY PROTOCOL:</strong> Organized arrangement F1-F10 optimized for maneuverability and clearance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Floor Layout */}
            <div ref={secondFloorRef} style={{ position: 'relative', marginTop: '4rem' }}>
                <div style={{ 
                    padding: '2rem', 
                    background: 'rgba(15, 23, 42, 0.7)', 
                    borderRadius: '1.5rem', 
                    border: '2px solid rgba(139, 92, 246, 0.3)', // Purple border tint
                    boxShadow: '0 0 50px rgba(139, 92, 246, 0.15)', // Purple glow
                    transition: 'all 0.5s ease',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                        <div>
                            <span className="hud-label" style={{ color: '#8b5cf6', letterSpacing: '4px' }}>LEVEL 03</span>
                            <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '900', marginTop: '0.5rem', textShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>SECOND FLOOR</h2>
                        </div>
                        
                        {/* Status Panel */}
                        <div style={{ display: 'flex', gap: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '1rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Activity size={18} color="#8b5cf6" />
                                <div>
                                    <div className="hud-label" style={{ fontSize: '0.65rem' }}>LEVEL STATUS</div>
                                    <div className="hud-value" style={{ color: '#8b5cf6' }}>OPTIMAL</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Zap size={18} color="#f59e0b" />
                                <div>
                                    <div className="hud-label">LIGHTING</div>
                                    <div className="hud-value" style={{ color: '#f59e0b' }}>100% LED</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Thermometer size={18} color="#10b981" />
                                <div>
                                    <div className="hud-label">VENTILATION</div>
                                    <div className="hud-value" style={{ color: '#10b981' }}>ACTIVE</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'relative', display: 'flex', gap: '3rem', alignItems: 'stretch' }}>
                        {/* Ramp Downward (LEFT SIDE) */}
                        <div style={{ width: '140px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '1.2rem', border: '3px solid #8b5cf6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.5rem', boxShadow: 'inset 0 0 30px rgba(139, 92, 246, 0.2)' }}>
                            <div style={{ transform: 'rotate(180deg)', marginBottom: '1rem' }}><ArrowUpRight size={54} color="#8b5cf6" /></div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '900', textAlign: 'center', color: '#8b5cf6', letterSpacing: '1px' }}>DOWNWARD RAMP TO FIRST FLOOR</span>
                            <div style={{ width: '100%', height: '8px', background: 'repeating-linear-gradient(90deg, #8b5cf6 0, #8b5cf6 10px, transparent 10px, transparent 20px)', marginTop: '1.5rem' }} />
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {secondSlots.length > 0 ? (
                                <>
                                    {/* Top row of slots S1-S5 */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
                                        {secondSlots.slice(0, 5).map(renderSlot)}
                                    </div>

                                    {/* Driving Lane marking */}
                                    <div style={{ 
                                        height: '80px', 
                                        borderTop: '2px dashed rgba(139, 92, 246, 0.3)', 
                                        borderBottom: '2px dashed rgba(139, 92, 246, 0.3)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        background: 'rgba(139, 92, 246, 0.03)',
                                        borderRadius: '4px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', opacity: 0.6 }}>
                                            <ArrowRight size={24} color="#8b5cf6" />
                                            <span style={{ letterSpacing: '15px', fontSize: '1rem', fontWeight: '900', color: 'white' }}>DRIVING LANE</span>
                                            <ArrowRight size={24} color="#8b5cf6" />
                                        </div>
                                    </div>

                                    {/* Bottom row of slots S6-S10 */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
                                        {secondSlots.slice(5, 10).map(renderSlot)}
                                    </div>
                                </>
                            ) : (
                                <div style={{ 
                                    flex: 1, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    padding: '4rem', 
                                    border: '2px dashed rgba(139, 92, 246, 0.2)', 
                                    borderRadius: '1rem',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>
                                    <Database size={48} color="#8b5cf6" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                                        No slots allocated for the Second Floor yet.<br/>
                                        Use the Admin Panel to register slots on this level.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Exit Path (RIGHT SIDE) */}
                        <div style={{ width: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderLeft: '2px dashed var(--glass-border)', paddingLeft: '2rem' }}>
                            <ArrowRight size={40} color="var(--danger)" />
                            <span style={{ writingMode: 'vertical-rl', fontSize: '0.9rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '4px', marginTop: '1.5rem', transform: 'rotate(180deg)' }}>EXIT PATH</span>
                        </div>
                    </div>

                    {/* Safety Bar */}
                    <div style={{ marginTop: '2.5rem', padding: '1.2rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '1rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Shield size={22} color="#8b5cf6" />
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>
                                <strong style={{ color: 'white', marginRight: '0.50rem' }}>SAFETY PROTOCOL:</strong> 
                                Organized arrangement {secondSlots.length > 0 ? `S1–S${secondSlots.length}` : 'S1-S10'} optimized for maneuverability and clearance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkingMap;
