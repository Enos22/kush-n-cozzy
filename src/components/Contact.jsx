const contactInfo = [
    { type: 'Email', value: 'Ekibuchi@gmail.com' },
    { type: 'Phone', value: '0722319981' },
    { type: 'Customer Support', value: '0789653583' },
    { type: 'Website', value: 'www.kush-n-cozzy.com' },
    { type: 'Social Media', value: '@kushncozzy' },
];

export default function Contact() {
    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Contact Us</h1>
            <div style={{ background: 'var(--white)', border: '3px solid var(--ink)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-tag)', padding: 28 }}>
                {contactInfo.map((info, index) => (
                    <p key={index} style={{ margin: '12px 0', fontSize: '1rem' }}>
                        <strong>{info.type}:</strong> {info.value}
                    </p>
                ))}
                <p style={{ marginTop: 20, marginBottom: 0 }}>
                    <strong>Address:</strong> 123 Main Street, Nairobi, Kenya
                </p>
            </div>
        </div>
    );
} 