import { NavLink, Outlet } from 'react-router-dom';

const navLinkStyle = ({ isActive }) => ({
  padding: '8px 4px',
  fontWeight: 600,
  fontSize: '0.92rem',
  borderBottom: isActive ? '2px solid var(--amber)' : '2px solid transparent',
  color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
  textDecoration: 'none',
});

const sidebarLinkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '10px 14px',
  borderRadius: 8,
  fontSize: '0.9rem',
  fontWeight: 600,
  color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
  background: isActive ? 'var(--paper)' : 'transparent',
  textDecoration: 'none',
});

// House is the layout shell: every page renders inside it via <Outlet />,
// the way rooms sit inside a house. It owns the parts that never change
// between pages — the top nav, the sidebar, and the footer.
export default function House() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--panel)' }}>
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}
        >
          <NavLink to="/" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>
              Kush-n-Cozzy<span style={{ color: 'var(--amber)' }}>.</span>
            </span>
          </NavLink>

          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <NavLink to="/" style={navLinkStyle} end>Home</NavLink>
            <NavLink to="/about" style={navLinkStyle}>About</NavLink>
            <NavLink to="/contact" style={navLinkStyle}>Contact</NavLink>
            <NavLink to="/login" style={navLinkStyle}>Login</NavLink>
          </nav>
        </div>
      </header>

      <div className="container" style={{ display: 'flex', flex: 1, gap: 32, paddingTop: 28, alignItems: 'flex-start' }}>
        <aside style={{ width: 220, flexShrink: 0 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <NavLink to="/products" style={sidebarLinkStyle}>Products</NavLink>
            <NavLink to="/add-product" style={sidebarLinkStyle}>Add Product</NavLink>
            <NavLink to="/orders" style={sidebarLinkStyle}>Orders</NavLink>
            <NavLink to="/categories" style={sidebarLinkStyle}>Categories</NavLink>
            <NavLink to="/settings" style={sidebarLinkStyle}>Settings</NavLink>
          </nav>
        </aside>

        <main style={{ flex: 1, minWidth: 0, paddingBottom: 48 }}>
          {/* Pages render here */}
          <Outlet />
        </main>
      </div>

      <footer style={{ borderTop: '1px solid var(--line)', padding: '20px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', margin: 0 }}>
          © {new Date().getFullYear()} Kush-n-Cozzy Admin Portal
        </p>
      </footer>
    </div>
  );
}