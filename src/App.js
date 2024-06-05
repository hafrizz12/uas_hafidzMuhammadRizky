import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import MD5 from 'crypto-js/md5';
import user from './datastore/user.json';
import product from './datastore/product.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import stock from './datastore/stock.json';
import { Checkout } from './components/consumer/Checkout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Consumer } from './components/consumer/Consumer';
import { Inventory } from './components/inventory/Inventory';
import { useNavigate } from 'react-router-dom';
import { Cashier } from './components/cashier/Cashier';
import { Supplier } from './components/supplier/Supplier';
import { Admin } from './components/admin/Admin';

function Login({ setUserTier, userTier }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [menu, setMenu] = useState(false);

  let a = localStorage.getItem('product') ? null : localStorage.setItem('product', JSON.stringify(product));


  const handleLogin = () => {

    let d = localStorage.getItem('user') ? null : localStorage.setItem('user', JSON.stringify(user));
    d = localStorage.getItem('user');
    d = JSON.parse(d);


    const foundUser = d.find(user => user.email === email);

    if (!foundUser) {
      setLoginError(true);
      return;
    }

    if (foundUser.password === password) {
      setUserTier(foundUser.tier);
      setLoginError(false);
      const rand = Math.random().toString(36).substring(7);

      let sessionData = {
        "session_id": MD5(rand).toString(), // Generate a session ID by hashing the random string
        "user_id": foundUser.user_id, // User ID from the foundUser object
        "tier": foundUser.tier, // User tier from the foundUser object
        "created_at": new Date().toISOString(), // Current date and time
      }

      // set localstorage right here
      let b = localStorage.getItem('stock') ? null : localStorage.setItem('stock', JSON.stringify(stock));
      let c = localStorage.getItem('session') ? null : localStorage.setItem('session', JSON.stringify(sessionData));

      if (foundUser.tier === "consumer") {
        navigate('/consumer');
      }

      if (foundUser.tier === "inventory") {

        navigate('/inventory');
      }

      if (foundUser.tier === "cashier") {
        navigate('/cashier');
      }

      if (foundUser.tier === "supplier") {
        navigate('/supplier');
      }

      if (foundUser.tier === "admin") {
        navigate('/admin');
      }

    }
  }


  const guest = () => {
    // assigns random uid to guest
    let rand = Math.floor(Math.random() * 1000000);

    let sessionData = {
      "session_id": MD5(rand).toString(),
      "user_id": rand,
      "tier": "consumer",
      "created_at": new Date().toISOString()
    }
    localStorage.setItem('session', JSON.stringify(sessionData));
    setUserTier("consumer");
    if (userTier === "consumer") {
      navigate('/consumer');
    }

  }

  if (userTier === "consumer") {
    navigate('/consumer');
  }

  if (userTier === "inventory") {
    navigate('/inventory');
  }

  if (userTier === "cashier") {
    navigate('/cashier');
  }

  if (userTier === "supplier") {
    navigate('/supplier');
  }

  if (userTier === "admin") {
    navigate('/admin');
  }

  return (
    <div>
      <div className='container p-4'>
        <h1>Login | BI-Rotan</h1>
        <p>Authenticate to your account </p>
        <div className="form-group">
          <input type="text" className='form-style poppins-regular form-text w-100 w-md-25' placeholder="Email" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="password" className='form-style poppins-regular form-text w-100 w-md-25' placeholder="Password" onChange={e => setPassword(MD5(e.target.value).toString())} />
        </div>
      </div>
      <div className="form-group">
        <button onClick={handleLogin} className='button p-2 poppins-regularw-100 w-md-25' >Login</button>
      </div>
      <div className="form-group">
        <button className='button btn btn-dark p-2 poppins-regular w-50 w-md-25' onClick={guest}>Continue As Guest</button>
      </div>
      {loginError && <p>Invalid email or password</p>}
      {userTier && <p>You are logged in as a tier {userTier} user.</p>}
    </div>
  );


}

function App() {
  const session = localStorage.getItem('session');
  const [userTier, setUserTier] = useState(null);

  useEffect(() => {
    setUserTier(session ? JSON.parse(session).tier : null);
  }, [session]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login setUserTier={setUserTier} userTier={userTier} />} />
        </Routes>
        <Routes>
          <Route path="/consumer" element={
            userTier == "consumer" ? <Consumer user={userTier} /> : <p>You are not authorized to view this page.</p>
          } />
          <Route path="/inventory" element={
            userTier == "inventory" ? <Inventory user={userTier} /> : <p>You are not authorized to view this page.</p>
          } />
          <Route path="/cashier" element={
            userTier == "cashier" ? <Cashier user={userTier} /> : <p>You are not authorized to view this page.</p>
          } />
          <Route path="/supplier" element={
            userTier == "supplier" ? <Supplier user={userTier} /> : <p>You are not authorized to view this page.</p>
          } />
          <Route path="/admin" element={
            userTier == "admin" ? <Admin /> : <p>You are not authorized to view this page.</p>
          } />
          <Route path='/checkout' element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
