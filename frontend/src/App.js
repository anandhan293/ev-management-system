import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const RATE_PER_PORT_HOUR = 45; // ₹ per occupied port, per hour — placeholder until a real billing API is wired in

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/; // 10-digit Indian mobile number, starts 6-9

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [stations, setStations] = useState([]);

  // ---- auth mode: "login" | "signup" ----
  const [authMode, setAuthMode] = useState("login");

  // registered users, simulated client-side (swap for a real API later)
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupErrors, setSignupErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState("");

  useEffect(() => {
    fetch("http://54.166.52.251:5000/stations")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.log(err));
  }, []);

  const districtLabel = (s) =>
    s.district && String(s.district).trim() !== "" ? s.district : "Unassigned";

  const filteredStations =
    selectedDistrict === "All"
      ? stations
      : stations.filter((s) => districtLabel(s) === selectedDistrict);

  const districts = [
    "All",
    ...new Set(stations.map((s) => districtLabel(s)))
  ];

  const occupiedPorts = (s) => Math.max(Number(s.ports) - Number(s.available), 0);
  const stationBill = (s) => occupiedPorts(s) * RATE_PER_PORT_HOUR;
  const totalBilling = filteredStations.reduce((sum, s) => sum + stationBill(s), 0);

  const formatINR = (n) =>
    "₹" + n.toLocaleString("en-IN");

  // ---------- Auth handlers ----------

  const resetSignupForm = () => {
    setSignupName("");
    setSignupEmail("");
    setSignupMobile("");
    setSignupPassword("");
    setSignupConfirm("");
    setSignupErrors({});
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    const email = loginEmail.trim();
    const mobile = loginMobile.trim();

    if (!email && !mobile) {
      setLoginError("Enter your email or mobile number.");
      return;
    }
    if (email && !EMAIL_REGEX.test(email)) {
      setLoginError("Enter a valid email address.");
      return;
    }
    if (mobile && !MOBILE_REGEX.test(mobile)) {
      setLoginError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Enter your password.");
      return;
    }

    const match = users.find(
      (u) =>
        (!email || u.email.toLowerCase() === email.toLowerCase()) &&
        (!mobile || u.mobile === mobile) &&
        u.password === loginPassword
    );

    if (!match) {
      setLoginError("No account matches those details. Sign up first if you're new.");
      return;
    }

    setCurrentUser(match);
    setLoggedIn(true);
    setLoginPassword("");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!signupName.trim()) {
      errors.name = "Enter your full name.";
    }

    if (!EMAIL_REGEX.test(signupEmail.trim())) {
      errors.email = "Enter a valid email address (e.g. name@example.com).";
    } else if (
      users.some((u) => u.email.toLowerCase() === signupEmail.trim().toLowerCase())
    ) {
      errors.email = "An account with this email already exists.";
    }

    if (!MOBILE_REGEX.test(signupMobile.trim())) {
      errors.mobile = "Enter a valid 10-digit mobile number (starts with 6-9, no country code).";
    }

    if (!signupPassword || signupPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (signupConfirm !== signupPassword) {
      errors.confirm = "Passwords do not match.";
    }

    setSignupErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const newUser = {
      name: signupName.trim(),
      email: signupEmail.trim(),
      mobile: signupMobile.trim(),
      password: signupPassword
    };

    setUsers((prev) => [...prev, newUser]);
    setSignupSuccess("Account created! You can log in now.");
    resetSignupForm();
    setLoginEmail(newUser.email);
    setLoginMobile(newUser.mobile);
    setAuthMode("login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5fff7" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        body{
          margin:0;
          font-family:'Inter',Arial,Helvetica,sans-serif;
        }

        /* ---------- Login page ---------- */

        .login-page{
          min-height:100vh;
          position:relative;
          background:
            linear-gradient(160deg, rgba(6,20,15,.88) 0%, rgba(6,20,15,.55) 45%, rgba(6,36,24,.82) 100%),
            url("https://images.unsplash.com/photo-1707341597123-c53bbb7e7f93?auto=format&fit=crop&w=1800&q=80");
          background-size:cover;
          background-position:center;
          display:flex;
          justify-content:center;
          align-items:center;
          overflow:hidden;
          padding:30px 16px;
        }

        .login-page::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,255,107,.16), transparent 70%);
          pointer-events:none;
        }

        .volt-grid{
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(124,255,107,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,255,107,.05) 1px, transparent 1px);
          background-size:42px 42px;
          mask-image:linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
          pointer-events:none;
        }

        .login-card{
          position:relative;
          z-index:2;
          width:430px;
          max-width:100%;
          border-radius:22px;
          overflow:hidden;
          background:rgba(10,26,19,.55);
          backdrop-filter:blur(18px);
          -webkit-backdrop-filter:blur(18px);
          border:1px solid rgba(124,255,107,.25);
          box-shadow:
            0 25px 60px rgba(0,0,0,.55),
            0 0 0 1px rgba(255,255,255,.03) inset;
          animation:rise .6s cubic-bezier(.2,.8,.2,1) both;
        }

        @keyframes rise{
          from{ opacity:0; transform:translateY(18px); }
          to{ opacity:1; transform:translateY(0); }
        }

        .login-header{
          text-align:center;
          padding:34px 28px 18px;
          border-bottom:1px solid rgba(124,255,107,.15);
        }

        .bolt-badge{
          width:56px;
          height:56px;
          margin:0 auto 14px;
          border-radius:16px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:26px;
          background:linear-gradient(135deg,#1c4d33,#0e2f1f);
          border:1px solid rgba(124,255,107,.4);
          box-shadow:0 0 0 6px rgba(124,255,107,.06), 0 0 22px rgba(124,255,107,.35);
          animation:pulse 2.4s ease-in-out infinite;
        }

        @keyframes pulse{
          0%,100%{ box-shadow:0 0 0 6px rgba(124,255,107,.06), 0 0 18px rgba(124,255,107,.28); }
          50%{ box-shadow:0 0 0 9px rgba(124,255,107,.1), 0 0 30px rgba(124,255,107,.5); }
        }

        .login-header h2{
          font-family:'Space Grotesk',sans-serif;
          font-weight:700;
          letter-spacing:.2px;
          color:#eafbef;
          margin-bottom:4px;
          font-size:26px;
        }

        .login-header p{
          color:rgba(234,251,239,.6);
          font-size:14px;
          margin:0;
          letter-spacing:.3px;
        }

        /* ---------- tab switcher ---------- */

        .auth-tabs{
          display:flex;
          margin:18px 30px 0;
          border:1px solid rgba(124,255,107,.25);
          border-radius:12px;
          overflow:hidden;
        }

        .auth-tab{
          flex:1;
          text-align:center;
          padding:9px 0;
          font-family:'Space Grotesk',sans-serif;
          font-size:13.5px;
          font-weight:600;
          letter-spacing:.3px;
          color:rgba(234,251,239,.55);
          background:transparent;
          border:none;
          cursor:pointer;
          transition:background .15s ease, color .15s ease;
        }

        .auth-tab.active{
          background:linear-gradient(90deg,#3fae5c,#7cff6b);
          color:#06140f;
        }

        .login-body{
          padding:22px 30px 32px;
        }

        .login-body .form-control{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.12);
          color:#eafbef;
        }

        .login-body .form-control::placeholder{
          color:rgba(234,251,239,.4);
        }

        .login-body .form-control:focus{
          background:rgba(255,255,255,.06);
          border-color:#7cff6b;
          box-shadow:0 0 0 3px rgba(124,255,107,.15);
          color:#eafbef;
        }

        .login-body .form-control.is-invalid{
          border-color:#ff6b6b;
        }

        .field-error{
          color:#ffb3b3;
          font-size:12.5px;
          margin:-10px 0 12px;
        }

        .form-success{
          color:#b7ffb0;
          font-size:13px;
          text-align:center;
          margin-bottom:14px;
        }

        .form-alert{
          color:#ffb3b3;
          font-size:13px;
          text-align:center;
          margin-bottom:14px;
        }

        .login-btn{
          background:linear-gradient(90deg,#3fae5c,#7cff6b);
          color:#06140f;
          font-family:'Space Grotesk',sans-serif;
          font-size:16px;
          font-weight:700;
          letter-spacing:.3px;
          border:none;
          transition:filter .15s ease, transform .15s ease;
        }

        .login-btn:hover{
          filter:brightness(1.08);
          color:#06140f;
          transform:translateY(-1px);
        }

        .login-footnote{
          text-align:center;
          margin-top:18px;
          font-size:12.5px;
          color:rgba(234,251,239,.4);
        }

        /* ---------- Dashboard ---------- */

        .navbar{
          background:linear-gradient(90deg,#006400,#00c853);
        }

        .dashboard-hero{
          position:relative;
          min-height:220px;
          display:flex;
          align-items:center;
          background:
            linear-gradient(100deg, rgba(6,20,15,.82) 30%, rgba(6,20,15,.35) 100%),
            url("https://images.unsplash.com/photo-1639302610362-4c86747e8680?auto=format&fit=crop&w=1800&q=80");
          background-size:cover;
          background-position:center 65%;
          background-attachment:fixed;
        }

        .dashboard-hero-content{
          position:relative;
          z-index:2;
          color:#eafbef;
          padding:28px 0;
        }

        .dashboard-hero-content h1{
          font-family:'Space Grotesk',sans-serif;
          font-weight:700;
          font-size:30px;
          margin-bottom:6px;
        }

        .dashboard-hero-content p{
          color:rgba(234,251,239,.7);
          font-size:15px;
          margin:0;
        }

        .dashboard-card{
          height:170px;
          border-radius:15px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          color:white;
          box-shadow:0 5px 15px rgba(0,0,0,.3);
        }

        .total-station{
          background:linear-gradient(135deg,#2196f3,#00b0ff);
        }

        .total-port{
          background:linear-gradient(135deg,#7b1fa2,#ba68c8);
        }

        .available-port{
          background:linear-gradient(135deg,#43a047,#76ff03);
          color:black;
        }

        .total-billing{
          background:linear-gradient(135deg,#f57c00,#ffca28);
          color:black;
        }

        .table-head{
          background:linear-gradient(90deg,#ffd600,#ffeb3b);
          font-weight:bold;
          font-size:18px;
        }

        .bill-note{
          font-size:12.5px;
          color:#6c757d;
          padding:10px 14px 0;
        }
      `}</style>

      {!loggedIn ? (
        <div className="login-page">
          <div className="volt-grid" />
          <div className="login-card">
            <div className="login-header">
              <div className="bolt-badge">⚡</div>
              <h2>EV Charging Station</h2>
              <p>{authMode === "login" ? "Sign in to your dashboard" : "Create your account"}</p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${authMode === "login" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("login");
                  setSignupSuccess("");
                }}
              >
                Log in
              </button>
              <button
                type="button"
                className={`auth-tab ${authMode === "signup" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("signup");
                  setLoginError("");
                }}
              >
                Sign up
              </button>
            </div>

            <div className="login-body">
              {authMode === "login" ? (
                <form onSubmit={handleLoginSubmit} noValidate>
                  {signupSuccess && <div className="form-success">{signupSuccess}</div>}
                  {loginError && <div className="form-alert">{loginError}</div>}

                  <input
                    type="email"
                    className="form-control form-control-lg mb-3"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />

                  <input
                    type="tel"
                    className="form-control form-control-lg mb-3"
                    placeholder="Mobile number (optional if email entered)"
                    value={loginMobile}
                    maxLength={10}
                    onChange={(e) =>
                      setLoginMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                  />

                  <input
                    type="password"
                    className="form-control form-control-lg mb-4"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />

                  <button className="btn login-btn w-100 py-2" type="submit">
                    Log in
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} noValidate>
                  <input
                    type="text"
                    className={`form-control form-control-lg mb-1 ${signupErrors.name ? "is-invalid" : ""}`}
                    placeholder="Full name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                  {signupErrors.name && <div className="field-error">{signupErrors.name}</div>}

                  <input
                    type="email"
                    className={`form-control form-control-lg mb-1 ${signupErrors.email ? "is-invalid" : ""}`}
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                  {signupErrors.email && <div className="field-error">{signupErrors.email}</div>}

                  <input
                    type="tel"
                    className={`form-control form-control-lg mb-1 ${signupErrors.mobile ? "is-invalid" : ""}`}
                    placeholder="Mobile number (10 digits)"
                    value={signupMobile}
                    maxLength={10}
                    onChange={(e) =>
                      setSignupMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                  />
                  {signupErrors.mobile && <div className="field-error">{signupErrors.mobile}</div>}

                  <input
                    type="password"
                    className={`form-control form-control-lg mb-1 ${signupErrors.password ? "is-invalid" : ""}`}
                    placeholder="Password (min 6 characters)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  {signupErrors.password && <div className="field-error">{signupErrors.password}</div>}

                  <input
                    type="password"
                    className={`form-control form-control-lg mb-1 ${signupErrors.confirm ? "is-invalid" : ""}`}
                    placeholder="Confirm password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                  />
                  {signupErrors.confirm && <div className="field-error">{signupErrors.confirm}</div>}

                  <button className="btn login-btn w-100 py-2 mt-3" type="submit">
                    Create account
                  </button>
                </form>
              )}

              <p className="login-footnote">Real-time status across every station in your network</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <nav className="navbar navbar-dark">
            <div className="container">
              <h3 className="text-white">
                ⚡ EV Charging Station Dashboard
              </h3>

              <div className="d-flex align-items-center gap-3">
                {currentUser && (
                  <span className="text-white small">
                    {currentUser.name}
                  </span>
                )}
                <button
                  className="btn btn-light"
                  onClick={() => {
                    setLoggedIn(false);
                    setCurrentUser(null);
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>

          <div className="dashboard-hero">
            <div className="container dashboard-hero-content">
              <h1>Network overview</h1>
              <p>Live station status and estimated billing across {selectedDistrict === "All" ? "all districts" : selectedDistrict}</p>
            </div>
          </div>

          <div className="container mt-4">
            <div className="row g-4">
              <div className="col-md-3">
                <div className="dashboard-card total-station">
                  <h5>📍 Total Stations</h5>
                  <h2>{filteredStations.length}</h2>
                </div>
              </div>

              <div className="col-md-3">
                <div className="dashboard-card total-port">
                  <h5>🔌 Total Ports</h5>
                  <h2>
                    {filteredStations.reduce(
                      (sum, s) => sum + Number(s.ports),
                      0
                    )}
                  </h2>
                </div>
              </div>

              <div className="col-md-3">
                <div className="dashboard-card available-port">
                  <h5>⚡ Available Ports</h5>
                  <h2>
                    {filteredStations.reduce(
                      (sum, s) => sum + Number(s.available),
                      0
                    )}
                  </h2>
                </div>
              </div>

              <div className="col-md-3">
                <div className="dashboard-card total-billing">
                  <h5>💰 Est. Billing</h5>
                  <h2>{formatINR(totalBilling)}</h2>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="fw-bold">Select District</label>

              <select
                className="form-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {districts.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="card shadow mt-4">
              <div className="card-header table-head">
                ⚡ EV Charging Station Details
              </div>

              <table className="table table-bordered table-hover mb-0">
                <thead className="table-success">
                  <tr>
                    <th>District</th>
                    <th>Location</th>
                    <th>Station</th>
                    <th>Address</th>
                    <th>Total Ports</th>
                    <th>Available</th>
                    <th>Bill (Est.)</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStations.map((s, index) => (
                    <tr key={index}>
                      <td>{districtLabel(s)}</td>
                      <td>{s.location}</td>
                      <td>{s.station}</td>
                      <td>{s.address}</td>
                      <td>{s.ports} 🔌</td>
                      <td>{s.available} ⚡</td>
                      <td>{formatINR(stationBill(s))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="bill-note pb-3">
                Estimated at ₹{RATE_PER_PORT_HOUR}/occupied port/hour (ports in use = total ports − available). Connect a real billing/metering API for actual charges.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

