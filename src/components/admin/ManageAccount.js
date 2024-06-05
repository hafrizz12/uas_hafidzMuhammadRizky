import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pusher from 'pusher-js';

const ManageAccount = ({ setMenu, userId }) => {  // Correctly destructure the props
    let session = localStorage.getItem("session");
    session = JSON.parse(session);

    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    user = user.find(user => user.user_id === userId);  // Ensure userId is used correctly

    const navigate = useNavigate();
    const userTier = session.tier;

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(user.password);
    const [phone, setPhone] = useState(user.phone);
    const [tier, setTier] = useState(user.tier);

    useEffect(() => {
        Pusher.logToConsole = true;

        var pusher = new Pusher('871e38a0ad296d7d629e', {
            cluster: 'ap1'
        });

        var channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function (data) {
            alert(JSON.stringify(data));
        });

        // Cleanup function
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const updateAccount = (e) => {
        e.preventDefault();

        if (userTier === "admin") {
            let users = localStorage.getItem("user");
            users = JSON.parse(users);

            const updatedUsers = users.map(u =>
                u.user_id === userId
                    ? { ...u, name, email, password, phone, tier }
                    : u
            );

            localStorage.setItem("user", JSON.stringify(updatedUsers));
            alert('Account updated');
            setMenu('view');  // Navigate back to the main view
        } else {
            alert('Unauthorized');
        }
    }

    const deleteAccount = () => {
        if (userTier === "admin") {
            let users = localStorage.getItem("user");
            users = JSON.parse(users);

            const updatedUsers = users.filter(u => u.user_id !== userId);

            localStorage.setItem("user", JSON.stringify(updatedUsers));
            alert('Account deleted');
            navigate('/');
        } else {
            alert('Unauthorized');
        }
    }

    return (
        <div>
            <h1>Manage Account</h1>
            <button className="btn btn-primary" onClick={() => setMenu('view')}>Back</button>
            <form onSubmit={updateAccount}>
                <div className="form-group">
                    <label htmlFor="name" className="start-text d-flex">Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="start-text d-flex">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="start-text d-flex">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="phone" className="start-text d-flex">Phone</label>
                    <input type="text" className="form-control" id="phone" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="form-group start-text">
                    <label htmlFor="tier" className="start-text d-flex">Tier</label>
                    <select className="form-control" id="tier" value={tier} onChange={e => setTier(e.target.value)}>
                        <option value="consumer">Consumer</option>
                        <option value="inventory">Inventory</option>
                        <option value="cashier">Cashier</option>
                        <option value="supplier">Supplier</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" className="btn btn-danger" onClick={deleteAccount}>Delete</button>
            </form>
        </div>
    );
}

export default ManageAccount;
