import axios from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageProduct from '../reusable/ManageProduct';
import { Logout } from '../reusable/Logout';

const Supplier = () => {
    let session = localStorage.getItem("session");
    session = JSON.parse(session);
    const [menu, setMenu] = useState('view');
    const [manageProductId, setManageProductId] = useState(0);
    const navigate = useNavigate();
    const user_tier = session.tier;

    const logout = () => {
        localStorage.removeItem('session');
        navigate('/');
    };

    const [stockDeficit, setStockDeficit] = useState(localStorage.getItem("stockDeficit") ? JSON.parse(localStorage.getItem("stockDeficit")) : []);

    useEffect(() => {
        let pusher = new Pusher('871e38a0ad296d7d629e', {
            cluster: 'ap1'
        });

        let channel = pusher.subscribe('supplier');

        channel.bind('request_stock', function (data) {
            console.log('stock deficit:', data);
            const deficit = data.message;

            // Check if already exists, if not add to stockDeficit
            if (stockDeficit.find(stockDeficit => stockDeficit.product_id === deficit.product_id)) {
                return;
            }

            setStockDeficit([...stockDeficit, deficit]);
            localStorage.setItem("stockDeficit", JSON.stringify([...stockDeficit, deficit]));
            setMenu('');
            alert('Stock request received');
            setTimeout(() => {
                setMenu('view');
            }, 100);
        });

        // Cleanup function
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [stockDeficit]);

    let stock = localStorage.getItem("stock");
    stock = JSON.parse(stock);

    let product = localStorage.getItem("product");
    product = JSON.parse(product);

    const checkStockDeficit = () => {
        let updatedStockDeficit = stockDeficit.filter(stockDeficit => {
            let findStock = stock.find(stockItem => stockItem.product_id === stockDeficit.product_id);
            return !(findStock.stock > stockDeficit.needStock);
        });

        setStockDeficit(updatedStockDeficit);
        localStorage.setItem("stockDeficit", JSON.stringify(updatedStockDeficit));
    };

    return (
        <div className="container p-3">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Supplier</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Logout />
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {menu === 'view' && stockDeficit && (
                <div className="row">
                    {stockDeficit.map((stockDeficit, i) => {
                        let findStock = stock.find(stockItem => stockItem.product_id === stockDeficit.product_id);
                        let findProduct = product.find(productItem => productItem.product_id === stockDeficit.product_id);
                        return (
                            <div key={i} className="col-md-4" onClick={() => { setMenu('manage'); setManageProductId(findStock.stock_id); }}>
                                <div className="card mb-3" style={{ height: '25rem' }}>
                                    <div className="col g-0">
                                        <div className="col w-100">
                                            <img src={findProduct.image} alt={findProduct.name} style={{ height: '14rem', objectFit: 'cover' }} className="img-fluid" />
                                        </div>
                                        <div className="col">
                                            <div className="card-body">
                                                <h5 className="card-title">{findProduct.name}</h5>
                                                <div className="badge bg-danger">{stockDeficit.needStock} Deficit</div>
                                                <p data-bs-toggle="tooltip" data-bs-placement="bottom" title={stockDeficit.affectedOrder.length > 1 ? stockDeficit.affectedOrder.join(", ") : stockDeficit.affectedOrder}>Hover to see affected order! </p>
                                                <button className="btn btn-primary">Modify Stock</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            {menu === 'manage' && manageProductId ? <ManageProduct stock_id={manageProductId} setMenu={setMenu} setStockDeficit={checkStockDeficit} /> : null}
        </div>
    );
};

export { Supplier };
