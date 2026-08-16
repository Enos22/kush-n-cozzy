import { NavLink, Outlet } from "react-router-dom";

const navLinkStyle = ({ isActive }) => ({
  padding: "8px 4px",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: "0.92rem",
  borderBottom: isActive ? "2px solid var(--orange)" : "2px solid transparent",
  color: isActive ? "var(--ink)" : "var(--navy-muted)",
  textDecoration: "none",
});

const sidebarLinkStyle = ({ isActive }) => ({
  display: "block",
  textAlign: "center",
  padding: "12px 16px",
  marginBottom: 10,
  fontFamily: "'Baloo 2', sans-serif",
  fontWeight: 700,
  fontSize: "0.95rem",
  color: "var(--ink)",
  background: isActive ? "var(--orange-deep)" : "var(--orange)",
  border: "3px solid var(--ink)",
  borderRadius: "var(--radius-md)",
  boxShadow: "0 4px 0 var(--ink)",
  textDecoration: "none",
});

export default function House() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        style={{
          borderBottom: "1px solid var(--navy-muted)",
          background: "var(--white)",
        }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            height: 68,
            padding: "0 24px",
          }}>
          <div />

          <NavLink
            to="/"
            style={{
              textDecoration: "none",
              color: "var(--navy)",
              justifySelf: "center",
            }}>
            <span
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 800,
                fontSize: "1.4rem",
              }}>
              Kush-n-<span style={{ color: "var(--orange)" }}>Cozzy</span>
            </span>
          </NavLink>

          <nav
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              justifySelf: "end",
            }}>
            <NavLink to="/" style={navLinkStyle} end>
              Home
            </NavLink>
            <NavLink to="/about" style={navLinkStyle}>
              About
            </NavLink>
            <NavLink to="/contact" style={navLinkStyle}>
              Contact
            </NavLink>
            <NavLink to="/login" style={navLinkStyle}>
              Login
            </NavLink>
          </nav>
        </div>
      </header>

      <div
        className="container"
        style={{
          display: "flex",
          flex: 1,
          gap: 32,
          paddingTop: 28,
          alignItems: "flex-start",
        }}>
        <aside style={{ width: 220, flexShrink: 0 }}>
          <nav style={{ display: "flex", flexDirection: "column" }}>
            <NavLink to="/products" style={sidebarLinkStyle}>
              Products
            </NavLink>
            <NavLink to="/add-product" style={sidebarLinkStyle}>
              Add Product
            </NavLink>
            <NavLink to="/orders" style={sidebarLinkStyle}>
              Orders
            </NavLink>
            <NavLink to="/categories" style={sidebarLinkStyle}>
              Categories
            </NavLink>
            <NavLink to="/settings" style={sidebarLinkStyle}>
              Settings
            </NavLink>
          </nav>
        </aside>

        <main style={{ flex: 1, minWidth: 0, paddingBottom: 48 }}>
          <Outlet />
        </main>
      </div>

      <footer
        style={{
          background: "var(--navy)",
          padding: "24px 0",
          textAlign: "center",
          marginTop: 40,
        }}>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.8rem",
            color: "var(--cream)",
            margin: 0,
          }}>
          © {new Date().getFullYear()} Kush-n-Cozzy Admin Portal
        </p>
      </footer>
    </div>
  );
}
