import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';

const Transaksi = ({ orderId }) => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState(localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : []);
    const [searchOrderId, setSearchOrderId] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [view, setView] = useState('view');

    let session = localStorage.getItem("session");
    session = JSON.parse(session);
    const user_tier = session.tier;

    const numberFormatIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    useEffect(() => {

        if (user_tier == 'admin') {
            setFilteredTransactions(transactions);
        }

        if (orderId) {
            if (user_tier == 'cashier') {
                const foundOrder = transactions.find(t => t.order_id === orderId);
                if (foundOrder) {
                    setCurrentTransaction(foundOrder);
                    setView('edit');
                } else {
                    alert('Order ID not found');
                    navigate('/cashier');
                }
            }
        }

        Pusher.logToConsole = true;

        const pusher = new Pusher('871e38a0ad296d7d629e', {
            cluster: 'ap1'
        });

        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function (data) {
            alert(JSON.stringify(data));
        });

        // Cleanup function
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [orderId, transactions]);

    const handleSearch = () => {
        if (searchOrderId) {
            const filtered = transactions.filter(transaction => transaction.order_id === searchOrderId);
            setFilteredTransactions(filtered);
            if (user_tier === 'consumer' && filtered.length > 0) {
                setCurrentTransaction(filtered[0]);
            }
        } else {
            setFilteredTransactions(transactions);
        }
    };

    const handleDelete = (order_id) => {
        const confirmDelete = window.confirm('Delete this transaction?');
        if (confirmDelete) {
            const updatedTransactions = transactions.filter(t => t.order_id !== order_id);
            setTransactions(updatedTransactions);
            setFilteredTransactions(updatedTransactions);
            localStorage.setItem("order", JSON.stringify(updatedTransactions));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedTransactions = transactions.map(t =>
            t.order_id === currentTransaction.order_id
                ? { ...t, ...{ status: e.target.status.value } }
                : t
        );

        setTransactions(updatedTransactions);
        setFilteredTransactions(updatedTransactions);
        localStorage.setItem("order", JSON.stringify(updatedTransactions));
        alert('Transaction updated');
        setView('view');
    };

    return (
        <div>
            {view === 'view' ? (
                <div className='d-flex m-2'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Order ID"
                        value={searchOrderId}
                        onChange={(e) => setSearchOrderId(e.target.value)}
                    />
                    <button
                        className="btn btn-primary m-2"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            ) : null}

            {view === 'view' && <table className='table table-bordered'>
                <thead className="thead-dark">
                    <tr>
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        {user_tier === 'consumer' ? null : <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.order_id}</td>
                            <td>{numberFormatIDR.format(transaction.gross_amount)}</td>
                            <td>{transaction.status}</td>
                            {user_tier === 'consumer' ? null : <td>
                                <button className="btn btn-primary" onClick={() => {
                                    setCurrentTransaction(transaction);
                                    setView('edit');
                                }}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(transaction.order_id)}>Delete</button>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>}

            {view === 'edit' && currentTransaction &&
                <div>
                    <h1>Update Transaction</h1>
                    <button className="btn btn-secondary d-flex" onClick={() => user_tier === 'cashier' ? window.location.reload() : setView('view')}>Back</button>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group text-start">
                            <label>Order ID</label>
                            <input type="text" className="form-control text-start d-flex" value={currentTransaction.order_id} disabled />
                        </div>
                        <div className="form-group text-start">
                            <label>Gross Amount</label>
                            <input type="number" className="form-control" value={currentTransaction.gross_amount} disabled />
                        </div>
                        <div className="form-group text-start">
                            <label>Status</label>
                            <select className="form-control" name="status" defaultValue={currentTransaction.status}>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="delivered">Delivered</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">Update</button>
                    </form>
                </div>
            }
        </div>
    );
};

export default Transaksi;
