import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const verify = async () => {
      try {
        await api.verifyMagicLink(token);
        navigate('/admin');
      } catch (err) {
        console.error('Verify error:', err);
        navigate('/admin/login?error=verification_failed');
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Verifying your login...</h2>
        <p>Please wait while we verify your magic link.</p>
      </div>
    </div>
  );
}
