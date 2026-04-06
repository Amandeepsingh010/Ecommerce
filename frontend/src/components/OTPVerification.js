import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

function OTPVerification({ navigate }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(59);
    const inputRefs = useRef([]);
    const { api, setUser } = useAuth();

    const email = localStorage.getItem('pendingVerificationEmail');

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/verify-otp', {
                email,
                otp: otpCode
            });
            
            const { accessToken, refreshToken, fullName, role } = response.data.data;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userName', fullName);
            localStorage.setItem('userRole', role);
            localStorage.removeItem('pendingVerificationEmail');
            
            setUser({ email, fullName, role });
            
            toast.success('Email verified successfully!');
            
            if (role === 'ADMIN') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setTimer(59);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('OTP resent to your email');
        } catch (error) {
            toast.error('Failed to resend OTP');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-visual">
                <div className="auth-visual-content">
                    <h1 className="auth-visual-title">Verify Email</h1>
                    <p className="auth-visual-text">One step away from luxury shopping</p>
                </div>
            </div>
            <div className="auth-content">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div className="auth-header">
                        <div className="auth-logo">LUXE</div>
                        <h2 className="auth-title">Verify Your Email</h2>
                        <p className="auth-subtitle">
                            We've sent a 6-digit code to<br />
                            <strong>{email || 'your email'}</strong>
                        </p>
                    </div>

                    <div className="otp-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                maxLength={1}
                                className="otp-input"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleVerify}
                        disabled={loading}
                        style={{ width: '100%', marginBottom: '16px' }}
                    >
                        {loading ? 'Verifying...' : 'Verify Code →'}
                    </button>

                    <p className="resend-text">
                        {timer > 0 ? (
                            <>Resend code in <span className="timer">{timer}s</span></>
                        ) : (
                            <button
                                type="button"
                                className="resend-link"
                                onClick={handleResend}
                            >
                                Resend Code →
                            </button>
                        )}
                    </p>

                    <button
                        type="button"
                        className="back-link"
                        onClick={() => navigate('login', '/login')}
                    >
                        ← Back to Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OTPVerification;