import { useState, useEffect } from "react";
import { ProductList } from "../reusable/ProductList";
import { Cart } from "./Cart";
import { useNavigate } from 'react-router-dom';
import { Logout } from "../reusable/Logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Pusher from 'pusher-js';
import Transaksi from "../reusable/Transaksi";

const Consumer = ({ user }) => {
    let storedSessionData = localStorage.getItem('session');
    const [cart, setCart] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);
    const [menu, setMenu] = useState('products');
    const navigate = useNavigate();

    useEffect(() => {
        let pusher = new Pusher('871e38a0ad296d7d629e', {
            cluster: 'ap1'
        });

        let channel = pusher.subscribe('payment');

        channel.bind('payment', function (data) {
            const oid = data.oid;

            let storedOrder = localStorage.getItem('order');
            storedOrder = JSON.parse(storedOrder);

            if (storedOrder) {
                storedOrder = storedOrder.map(order => {
                    if (order.order_id === oid) {
                        order.status = 'paid';
                    }
                    return order;
                });

                localStorage.setItem('order', JSON.stringify(storedOrder));
            }

            alert('Payment received');
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }


    });


    // Since the data is stored as a string, you need to parse it back into an object
    storedSessionData = JSON.parse(storedSessionData);
    return (
        <div className="container p-3">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Consumer</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="nav-link" onClick={() => setMenu('products')}>Products</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" onClick={() => setMenu('status')}>Status</button>
                            </li>
                            <li className="nav-item">
                                <Logout />
                            </li>
                        </ul>
                        <div className="d-flex ms-auto" onClick={() => setMenu('cart')} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faBagShopping} size="2x" />
                            {cart.length > 0 ? <span className="cart-count" style={{ backgroundColor: 'red', borderRadius: '50%', color: 'white', padding: '1px 8px', position: 'absolute', top: '0', right: '0', fontSize: '1rem' }}>{cart.length}</span> : null}
                        </div>
                    </div>
                </div>
            </nav>

            {menu == 'products' ? <ProductList cart={cart} setCart={setCart} /> : null}
            {menu == 'cart' ? <Cart cart={cart} setCart={setCart} /> : null}
            {menu == 'status' ? <Transaksi /> : null}
        </div >
    );
}

export { Consumer };