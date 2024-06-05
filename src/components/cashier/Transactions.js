const { useEffect, useState } = require("react");
const axios = require('axios');

const Transactions = ({ stockDeficit, requestStock, setMenu, handlePayment, handleTransaksi }) => {
    let session = localStorage.getItem("session");
    session = JSON.parse(session);

    let order = localStorage.getItem("order");
    order = JSON.parse(order);

    let stock = localStorage.getItem("stock");
    stock = JSON.parse(stock);

    const numberFormatIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    const [orderx, setOrderx] = useState(null);


    const viewOrder = (order, setOrderx, stockDeficit) => {
        return (
            <div>
                <button className="btn btn-secondary d-flex" onClick={() => setOrderx(null)}>Back</button>
                <div className="card" style={{ margin: '1rem 0rem' }}>
                    <div className="card-body">
                        <h3 className="card-title text-start">Order {order.order_id}</h3>
                        <p className="card-text text-start">Table: {order.order_id}</p>
                        <p className="card-text text-start">Amount: {numberFormatIDR.format(order.gross_amount)}</p>
                        <p className="card-text text-start">Status: {order.status ? order.status : 'Pending'}</p>
                        {order.status === 'pending' || !order.status ? <button className="btn btn-primary d-flex m-2" onClick={() => handlePayment(order.order_id)}>Payment</button> : ''}
                        <button className="btn btn-warning d-flex m-2" onClick={() => handleTransaksi(order.order_id)}>Update Status</button>
                    </div>
                </div>
                {stockDeficit && stockDeficit.map((stockDeficit, index) => {
                    const orderDetail = order.order_details.find(orderDetail => orderDetail.id === stockDeficit.product_id && stockDeficit.affectedOrder.includes(order.order_id));
                    if (!orderDetail) {
                        return '';
                    }
                    return (
                        <div className="card" style={{ margin: '1rem 0rem' }} key={index}>
                            <div className="card-body p-4">
                                <h3 className="card-title text-start">Stock Deficit</h3>
                                <button className="btn btn-warning d-flex m-2" onClick={() => requestStock(stockDeficit)}>Request Stock</button>
                                <h4 className="card-text text-start m-2">{orderDetail.name}</h4>
                                <p className="card-text text-start m-2">Need Stock: {stockDeficit.needStock}</p>
                                <p className="card-text text-start m-2">Stock Deficit: {stockDeficit.stockDeficit}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }

    return (
        <div className="row">
            {order && !orderx && order.map((order, index) => {
                return (
                    <div className="col-md-4" key={index} onClick={() => setOrderx(order)}>
                        <div className="card" style={{ height: '15rem', margin: '1rem 0rem' }}>
                            <span className="badge" style={{ backgroundColor: order.status ? order.status == 'paid' ? 'blue' : 'green' : 'red' }}>{order.status ? order.status : 'Pending'}</span>
                            <div className="card-body">
                                <h5 className="card-title">{order.title}</h5>
                                <p className="card-text">Price: {numberFormatIDR.format(order.gross_amount)}</p>
                                <p className="card-text">Customer: {order.user_details.name}</p>
                                <p className="card-text">Order ID: {order.order_id}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
            {orderx && viewOrder(orderx, setOrderx, stockDeficit)}
        </div>
    )
}

export { Transactions }