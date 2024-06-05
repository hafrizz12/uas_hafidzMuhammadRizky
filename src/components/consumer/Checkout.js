import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from "bootstrap";


const Checkout = ({ }) => {
    let location = useLocation();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        if (!location.state || !location.state.product) {
            navigate('/');
        }
    }, [location, navigate]);

    const numberFormatIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    const selectedProduct = location.state.product;
    console.log(selectedProduct)
    let product = localStorage.getItem('product');
    let user = localStorage.getItem('session');
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];
    product = product ? JSON.parse(product) : [];


    const pay = () => {
        console.log('pay')
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (!name || !email || !phone) {
            alert('Please fill all fields');
            return;
        }

        let orderDetails = [];

        selectedProduct.map((pa, i) => {
            return product.map((p, i) => {
                if (pa === p.product_id) {
                    return cart.map((c, v) => {
                        if (c.product_id === p.product_id) {
                            let orderDetail = {
                                "id": p.product_id,
                                "price": parseInt(p.price),
                                "quantity": c.quantity,
                                "name": p.name
                            }
                            orderDetails.push(orderDetail);
                        } else {
                            return null;
                        }
                    });
                } else {
                    return null;
                }
            });
        });

        if (paymentMethod === 'qris') {
            axios.post('http://192.168.224.171:8593/api/v1/charge', {
                item_details: JSON.stringify(orderDetails),
                buyer_name: name,
                buyer_mail: email,
            }, {
                headers: {
                    'api-key': '512cb9ba743af057d54379a1375ab7801b4d0b9302f4c3a4d724b3db961e8e01',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(async response => {
                    console.log(response.data.status);
                    if (response.data.status == 200) {
                        const orderId = response.data.data.order_id;
                        const gross_amount = response.data.data.gross_amount;
                        const expiryTime = response.data.data.expiry_time;
                        const qrisLink = response.data.qrisLink;
                        const user_id = user.user_id;

                        let ordera = {
                            "payment_method": "qris",
                            "order_id": orderId,
                            "user_id": user_id,
                            "user_details": {
                                "name": name,
                                "email": email,
                                "phone": phone
                            },
                            "gross_amount": gross_amount,
                            "expiry_time": expiryTime,
                            "qris_link": qrisLink,
                            "order_details": orderDetails
                        }

                        axios.post('http://192.168.224.171:3500/api/pusher', {
                            "message": ordera,
                            "channel": "order",
                            "event": "order"
                        }).then(response => {
                            console.log(response.data);
                        })


                        let getPreviousOrder = localStorage.getItem('order');
                        getPreviousOrder = getPreviousOrder ? JSON.parse(getPreviousOrder) : [];
                        localStorage.setItem('order', JSON.stringify([...getPreviousOrder, ordera]));
                        let img = document.createElement('img');
                        img.src = qrisLink;

                        // Create Bootstrap modal
                        const modal = document.createElement('div');
                        modal.classList.add('modal', 'fade');
                        modal.id = 'qrisModal';
                        modal.tabIndex = '-1';
                        modal.setAttribute('aria-labelledby', 'qrisModalLabel');
                        modal.setAttribute('aria-hidden', 'true');

                        // Create modal dialog
                        const modalDialog = document.createElement('div');
                        modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
                        modal.appendChild(modalDialog);

                        // Create modal content
                        const modalContent = document.createElement('div');
                        modalContent.classList.add('modal-content');
                        modalDialog.appendChild(modalContent);

                        // Create modal header
                        const modalHeader = document.createElement('div');
                        modalHeader.classList.add('modal-header');
                        modalContent.appendChild(modalHeader);

                        // Create modal title
                        const modalTitle = document.createElement('h5');
                        modalTitle.classList.add('modal-title');
                        modalTitle.id = 'qrisModalLabel';
                        modalTitle.textContent = 'QR Code Payment';
                        modalHeader.appendChild(modalTitle);

                        // Create modal body
                        const modalBody = document.createElement('div');
                        modalBody.classList.add('modal-body');
                        modalContent.appendChild(modalBody);

                        // Append QR code image to modal body
                        modalBody.appendChild(img);

                        // Create modal footer
                        const modalFooter = document.createElement('div');
                        modalFooter.classList.add('modal-footer');
                        modalContent.appendChild(modalFooter);

                        // Create close button
                        const closeButton = document.createElement('button');
                        closeButton.classList.add('btn', 'btn-secondary');
                        closeButton.setAttribute('data-bs-dismiss', 'modal');
                        closeButton.textContent = 'Close';
                        modalFooter.appendChild(closeButton);

                        // Append modal to document body
                        document.body.appendChild(modal);

                        // Show the modal
                        const qrisModal = new Modal(document.getElementById('qrisModal'));
                        qrisModal.show();
                        qrisModal._element.addEventListener('hidden.bs.modal', function () {
                            navigate('/consumer');
                        });

                        alert('orderID: ' + orderId);
                    }
                }
                )
        }

        if (paymentMethod === 'cashier') {

            let orderId = Math.floor(Math.random() * 1000000);
            orderId = orderId.toString() + new Date().getTime().toString();

            const user_id = user.user_id;
            const gross_amount = totalPrice;
            const expiryTime = new Date().getTime() + 3600000;

            let ordera = {
                "payment_method": "cashier",
                "order_id": orderId,
                "user_id": user_id,
                "user_details": {
                    "name": name,
                    "email": email,
                    "phone": phone
                },
                "gross_amount": gross_amount,
                "expiry_time": expiryTime,
                "order_details": orderDetails
            }

            axios.post('http://192.168.224.171:3500/api/pusher', {
                "message": ordera,
                "channel": "order",
                "event": "order"
            }).then(response => {
                console.log(response.data);
            })

            let getPreviousOrder = localStorage.getItem('order');
            getPreviousOrder = getPreviousOrder ? JSON.parse(getPreviousOrder) : [];
            localStorage.setItem('order', JSON.stringify([...getPreviousOrder, ordera]));

            // bootstrap modal


            alert('orderID: ' + orderId);

        }

        let cartData = JSON.parse(localStorage.getItem('cart'));
        selectedProduct.map((pa, i) => {
            return product.map((p, i) => {
                if (pa === p.product_id) {
                    cartData = cartData.filter(cp => cp.product_id !== p.product_id);
                }
            });
        });


    }


    const totalPrice = cart.reduce((acc, c) => {
        let foundAndSelectedProduct = selectedProduct.find(sp => sp === c.product_id);
        if (foundAndSelectedProduct) {
            let foundProduct = product.find(p => p.product_id === c.product_id);
            return acc + (foundProduct.price * c.quantity);
        }
        return acc; // Add this line to handle the case when foundAndSelectedProduct is undefined
    }, 0);

    const payment = (paymentMethod) => {
        if (paymentMethod === 'qris') {
            /*
         
                */
        } else if (paymentMethod === 'bank') {
            console.log('Payment success with bank transfer');
        } else if (paymentMethod === 'cashier') {
            console.log('Payment success with cashier');
        }
    }

    return (
        <div className="container p-4">
            <nav className="navbar navbar-expand-lg navbar-light">
                <a className="navbar-brand" href="#">Checkout</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => navigate('/consumer')}>Back to consumer</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="container mt-4">
                <h3>Details</h3>
                <div className="form-group">
                    <input type="text" className="form-control p-3 m-3" placeholder="Name" id="name" required />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control p-3 m-3" placeholder="Email" id="email" required />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control p-3 m-3" placeholder="Phone" id="phone" required />
                </div>
                <div className="mt-4">
                    {selectedProduct.length > 0 ? (
                        selectedProduct.map((pa, i) => {
                            return (
                                <div className="card mb-3 p-3 m-3" key={i}>
                                    {product.map((p, i) => {
                                        if (pa === p.product_id) {
                                            return cart.map((c, v) => {
                                                if (c.product_id === p.product_id) {
                                                    return (
                                                        <div className="card-body" key={v}>
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <h5 className="card-title text-start">{p.name}</h5>
                                                                    <p className="card-text text-start">{p.description.length > 150 ? p.description.substring(0, 150) + '...' : p.description}</p>
                                                                    <p className="card-text text-start">Price: {numberFormatIDR.format(p.price)}</p>
                                                                    <p className="card-text text-start">Total Price: {numberFormatIDR.format(p.price * c.quantity)}</p>
                                                                    <p className="card-text text-start">Quantity: {c.quantity}</p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <img src={p.image} alt={p.name} className="img-fluid" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            });
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            );
                        })
                    ) : (
                        <p>No product selected</p>
                    )}
                </div>
                <h2 className="mt-4 text-start poppins-bold p-2"> {numberFormatIDR.format(totalPrice)}</h2>
                <h3 className="text-start poppins-medium p-2">Payment Method</h3>

                <div className="d-flex">
                    <div
                        className="payment-card w-25 card"
                        style={{
                            backgroundColor: paymentMethod === 'qris' ? '#f0f0f0' : 'white',
                            padding: '10px',
                            margin: '10px',
                            height: '15rem',
                            border: '1px solid black',
                            cursor: 'pointer'
                        }}
                        onClick={() => setPaymentMethod('qris')}
                    >
                        <img src={"https://static.vecteezy.com/system/resources/previews/015/873/570/original/qr-code-scan-illustration-in-flat-style-mobile-phone-scanning-illustration-on-isolated-background-barcode-reader-in-hand-sign-business-concept-vector.jpg"} alt="qris" style={{ width: '100px', height: '100px' }} />
                        <h4 style={{ textAlign: 'center', margin: '2rem 0rem' }}>QRIS</h4>
                    </div>
                    <div
                        className="payment-card w-25 card"
                        style={{
                            backgroundColor: paymentMethod === 'cashier' ? '#f0f0f0' : 'white',
                            padding: '10px',
                            margin: '10px',
                            border: '1px solid black',
                            cursor: 'pointer',
                            transition: '0.3s ease'


                        }}
                        onClick={() => setPaymentMethod('cashier')}
                    >
                        <img src={"https://static.vecteezy.com/system/resources/previews/015/873/570/original/qr-code-scan-illustration-in-flat-style-mobile-phone-scanning-illustration-on-isolated-background-barcode-reader-in-hand-sign-business-concept-vector.jpg"} alt="cashier" style={{ width: '100px', height: '100px' }} />
                        <h4 style={{ textAlign: 'center', margin: '2rem 0rem' }}>Cashier</h4>
                    </div>
                </div>
                <button onClick={pay} className="btn btn-primary mt-4 w-25 p-3">Pay</button>
            </div>
        </div>
    );

}

export { Checkout };