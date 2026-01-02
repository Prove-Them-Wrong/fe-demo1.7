// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
//   return (
//     <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', background: '#f0f0f0' }}>
//       <Link to="/">Home/Gallery</Link>
//       {isLoggedIn ? (
//         <>
//           <Link to="/referral">Referral</Link>
//           {isAdmin && <Link to="/admin-crm">Admin CRM</Link>}
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <>
//           <Link to="/login">Login</Link>
//           <Link to="/register">Register</Link>
//         </>
//       )}
//     </nav>
//   );
// };


//2
// const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
//   return (
//     <nav style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px 40px',
//       background: '#000000',
//       color: 'white',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
//     }}>
//       <h1 style={{ margin: 0, fontSize: '28px' }}>TailorChic</h1>
//       <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
//         <Link to="/" style={{ fontWeight: 'bold', fontSize: '18px' }}>Gallery</Link>
//         {isLoggedIn ? (
//           <>
//             <Link to="/referral">Referrals</Link>
//             {isAdmin && <Link to="/admin-crm">Admin CRM</Link>}
//             <button onClick={handleLogout} className="btn-secondary">Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/register">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/headerstyles.css"; // Import the shared header styles

const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
  return (
    <nav className="site-header__nav-secondary">
      <Link to="/" className="site-header__nav-link">Gallery</Link>
      {isLoggedIn ? (
        <>
          <Link to="/referral" className="site-header__nav-link">Referrals</Link>
          {isAdmin && <Link to="/admin-crm" className="site-header__nav-link">Admin CRM</Link>}
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </>
      ) : (
        <>
          <Link to="/search" className="site-header__nav-link">Search</Link>
          <Link to="/login" className="site-header__nav-link">Login</Link>
          <Link to="/register" className="site-header__nav-link">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;