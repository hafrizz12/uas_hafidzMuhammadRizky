import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('session');
        navigate('/');
        window.location.reload();
    }

    return (
        <button className='btn btn-danger' onClick={logout}>Logout</button>
    )
}

export { Logout }