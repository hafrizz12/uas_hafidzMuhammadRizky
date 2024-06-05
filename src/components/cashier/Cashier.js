import Pusher from 'pusher-js';
import { Transactions } from "./Transactions";
import axios from 'axios';
import { PaymentKasir } from './PaymentKasir';
import { Logout } from '../reusable/Logout';
import Transaksi from '../reusable/Transaksi';
const { useEffect, useState } = require("react");
const { useNavigate } = require("react-router-dom");


const Cashier = ({ }) => {
    let session = localStorage.getItem("session");
    let [menu, setMenu] = useState('view');
    const navigate = useNavigate();
    session = JSON.parse(session);
    let user_tier = session.tier;
    let [stockDeficit, setStockDeficit] = useState([]);
    const [TID, setTID] = useState(0);


    const logout = () => {
        localStorage.removeItem('session');
        navigate('/');
    }

    const handlePayment = (tid) => {
        setTID(tid);
        setMenu('payment-kasir');
    }

    const handleTransaksi = (tid) => {
        setTID(tid);
        setMenu('transaksi');
    }

    const requestStock = async (stockDeficit) => {
        axios.post('http://192.168.18.9:3500/api/pusher', {
            "message": stockDeficit,
            "channel": "supplier",
            "event": "request_stock"
        }).then(response => {
            console.log(response.data);
        })
    }
    useEffect(() => {

        const checkStockDeficit = (setStockDeficit) => {
            let order = localStorage.getItem("order");
            order = JSON.parse(order);

            let stock = localStorage.getItem("stock");
            stock = JSON.parse(stock);

            if (order) {
                order = order.sort((a, b) => {
                    if (a.status === 'pending' && b.status !== 'pending') {
                        return -1;
                    } else if (a.status !== 'pending' && b.status === 'pending') {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                let affectedOrder = [];

                order.map((order, i) => {
                    order.order_details.map((orderDetail, j) => {
                        let stockItem = stock.find(stockItem => stockItem.product_id === orderDetail.id);
                        if (stockItem && stockItem.stock < orderDetail.quantity) {
                            let findAffectedOrder = affectedOrder.find(affectedOrder => affectedOrder.product_id === orderDetail.id);
                            if (findAffectedOrder) {
                                // add the affected_order and stock deficit and need stock
                                findAffectedOrder.affectedOrder = [...findAffectedOrder.affectedOrder, order.order_id];
                                findAffectedOrder.needStock += orderDetail.quantity;
                                findAffectedOrder.stockDeficit += findAffectedOrder.stockDeficit > 0 ? findAffectedOrder.stockDeficit + orderDetail.quantity : orderDetail.quantity - stockItem.stock;
                            } else {
                                affectedOrder.push({
                                    product_id: orderDetail.id,
                                    affectedOrder: [order.order_id],
                                    needStock: orderDetail.quantity,
                                    stockDeficit: orderDetail.quantity - stockItem.stock
                                });
                            }
                        }
                    });
                });

                console.log('Affected order:', affectedOrder);

                if (affectedOrder.length > 0) {
                    setStockDeficit(affectedOrder);
                    localStorage.setItem('stockDeficit', JSON.stringify(affectedOrder));
                }

            }
        }

        checkStockDeficit(setStockDeficit);

        let pusher = new Pusher('871e38a0ad296d7d629e', {
            cluster: 'ap1'
        });

        let channel = pusher.subscribe('order');

        let channel2 = pusher.subscribe('payment');

        channel2.bind('payment', function (data) {
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

        channel.bind('order', function (data) {
            console.log(data.message);
            let ordera;
            if (typeof data.message === 'string') {
                try {
                    ordera = JSON.parse(data.message);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            } else if (typeof data.message === 'object') {
                ordera = data.message;
            } else {
                console.error('invalid bang');
            }

            let getPreviousOrder = localStorage.getItem('order');
            getPreviousOrder = getPreviousOrder ? JSON.parse(getPreviousOrder) : [];
            localStorage.setItem('order', JSON.stringify([...getPreviousOrder, ordera]));

            // refresh the table
            alert('New order received')
            setMenu('');
            checkStockDeficit(setStockDeficit);
            setTimeout(() => {
                setMenu('view');
            }, 100);
        });



        // Cleanup function
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);


    return (
        <div className="container p-3">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Cashier</a>
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

            {menu === 'view' ? <div>
                <Transactions stockDeficit={stockDeficit} requestStock={requestStock} setMenu={setMenu} handlePayment={handlePayment} handleTransaksi={handleTransaksi} />
            </div> : menu === 'payment-kasir' ?
                <PaymentKasir setMenu={setMenu} tid={TID} /> : menu == 'transaksi' ?
                    <div>
                        <Transaksi orderId={TID} />
                    </div> : ''}
        </div>
    );
}

export { Cashier }