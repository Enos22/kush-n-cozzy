import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: 12 }}>404</h1>
            <p style={{ fontSize: '1.1rem', marginBottom: 24 }}>The page you are looking for does not exist.</p>
            <Link to="/" style={{ display: 'inline-block', fontWeight: 700, color: 'var(--navy)' }}>Return home</Link>
        </div>
    );
}
