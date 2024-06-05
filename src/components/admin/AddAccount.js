import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pusher from 'pusher-js';

const AddAccount = () => {
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

    const navigate = useNavigate();

    let userTier = localStorage.getItem("session");
    userTier = JSON.parse(userTier);
    userTier = userTier.tier;

    const addAccount = (e) => {
        e.preventDefault();

        if (userTier === "admin") {
            const get = localStorage.getItem("user");
            let accounts = JSON.parse(get);

            accounts.push({
                user_id: accounts.length + 1,
                name: e.target[0].value,
                email: e.target[1].value,
                password: e.target[2].value,
                tier: e.target[3].value,
                phone: e.target[4].value,
                created_at: new Date().toLocaleString()
            });

            localStorage.setItem("user", JSON.stringify(accounts));
            alert('Account added');
            navigate('/');
        } else {
            alert('Unauthorized');
        }
    }

    return (
        <div className="container p-2">
            <button className="btn btn-secondary d-flex m-2 ms-0" onClick={() => navigate('/')}>Back</button>
            <form onSubmit={addAccount}>
                <div className="mb-3 text-start">
                    <label className="form-label">Name</label>
                    <input className="form-control" type="text" required />
                </div>
                <div className="mb-3 text-start">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" required />
                </div>
                <div className="mb-3 text-start">
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" required />
                </div>
                <div className="mb-3 text-start">
                    <label className="form-label">Phone</label>
                    <input className="form-control" type="tel" required />
                </div>
                <div className="mb-3 text-start">
                    <label className="form-label">Tier</label>
                    <select className="form-select" required>
                        <option value="admin">Admin</option>
                        <option value="inventory">Inventory</option>
                        <option value="supplier">Supplier</option>
                        <option value="cashier">Cashier</option>
                        <option value="consumer">Consumer</option>
                    </select>
                </div>
                <button className="btn btn-primary" type="submit">Add Account</button>
            </form>
        </div>
    );
}

export default AddAccount;
