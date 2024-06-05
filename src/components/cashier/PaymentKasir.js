import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentKasir = ({ setMenu, tid }) => {
    console.log(tid);
    const navigate = useNavigate();

    // pusher

    const [manageTransaksiId, setManageTransaksiId] = useState(tid);
    let orderData = localStorage.getItem("order");
    orderData = JSON.parse(orderData);
    orderData = orderData.filter((orderItem) => {
        return orderItem.order_id === tid;
    });

    const updateTransaksi = (e) => {
        e.preventDefault();
        let method = e.target[2].value;
        let discount = e.target[3].value;

        // Retrieve existing transactions
        let transactions = localStorage.getItem("order");
        transactions = JSON.parse(transactions) || [];

        // Find the transaction to update
        let updatedTransactions = transactions.map(transaction => {
            if (transaction.order_id === manageTransaksiId) {
                transaction.payment_method = method;
                transaction.discount = discount;

                // Update the order details
                transaction.order_details = transaction.order_details.map((detail, index) => {
                    detail.quantity = parseInt(e.target[`quantity-${index}`].value);
                    detail.price = parseFloat(e.target[`price-${index}`].value);
                    return detail;
                });

                // Recalculate gross amount
                transaction.gross_amount = transaction.order_details.reduce((sum, detail) => sum + (detail.price * detail.quantity), 0) - discount;
                transaction.status = 'paid';
            }
            return transaction;
        });

        // Save updated transactions back to local storage
        localStorage.setItem("order", JSON.stringify(updatedTransactions));
        alert('Transaction updated');
        setMenu('view');
    };

    return (
        <div>
            <h1>Payment</h1>
            <button onClick={() => navigate('/')}>Back</button>
            <form onSubmit={updateTransaksi}>
                <div>
                    <label>Transaksi ID</label>
                    <input type="text" value={manageTransaksiId} disabled onChange={(e) => setManageTransaksiId(e.target.value)} />
                    {orderData.map((orderItem, orderIndex) => {
                        const detail_order = orderItem.order_details;
                        return (
                            <div key={orderItem.order_id}>
                                {detail_order.map((detailx, detailIndex) => {
                                    return (
                                        <div key={detailx.id}>
                                            <p>{detailx.name}</p>
                                            <input type="number" placeholder="Enter quantity" required defaultValue={detailx.quantity} name={`quantity-${detailIndex}`} />
                                            <input type="number" placeholder="Enter price" required defaultValue={detailx.price} name={`price-${detailIndex}`} />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    <select id="method" required>
                        <option value="cash">Cash</option>
                        <option value="debit">Debit</option>
                        <option value="credit">Credit</option>
                    </select>
                    <input type="number" placeholder="Enter discount" />

                    {orderData.length > 0 && (
                        <>
                            <p>Discount: {orderData[0].discount}</p>
                            <p>Total: {orderData[0].gross_amount}</p>
                        </>
                    )}

                    <button type="submit">Pay</button>
                </div>
            </form>
        </div>
    );
};

export { PaymentKasir }
