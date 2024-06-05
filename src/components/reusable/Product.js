import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pusher from 'pusher-js';
import ManageProduct from './ManageProduct'; // Adjust the path as necessary

const Product = ({ userTier, menux, manageId }) => {
    useEffect(() => {
        Pusher.logToConsole = true;

        var pusher = new Pusher('871e38a0ad296d7d629e', {
            cluster: 'ap1'
        });

        var channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function (data) {
            alert(JSON.stringify(data));
        });

        // Trigger an event
        channel.trigger('client-my-event', {
            message: 'Product updated'
        });

        // Cleanup function
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const [menu, setMenu] = useState(menux ? menux : 'view');
    const [manageProductId, setManageProductId] = useState(manageId ? manageId : 0);
    let product = localStorage.getItem("product");
    product = JSON.parse(product);

    const numberFormatIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    let stock = localStorage.getItem("stock");
    stock = JSON.parse(stock);

    const AddProduct = () => {
        const navigator = useNavigate();

        let userTier = localStorage.getItem("session");
        userTier = JSON.parse(userTier);
        userTier = userTier.tier;

        const addProduct = (e) => {
            e.preventDefault();

            if (userTier === "admin" || userTier === "inventory") {
                const get = localStorage.getItem("product");
                let products = JSON.parse(get);

                let stock2 = localStorage.getItem("stock");
                stock2 = JSON.parse(stock2);

                products.push({
                    product_id: products.length + 1,
                    stock_id: stock2.length + 1,
                    name: e.target[0].value,
                    stock: products.length + 1,
                    sold: 0,
                    image: [e.target[4].value],
                    price: e.target[1].value,
                    discount: 0,
                    category: e.target[5].value,
                    description: e.target[6].value,
                    rating: 0
                });

                localStorage.setItem("product", JSON.stringify(products));

                let stock = localStorage.getItem("stock");
                stock = JSON.parse(stock);

                stock.push({
                    product_id: products.length,
                    restock_cost: e.target[3].value,
                    stock_id: products.length,
                    stock: e.target[2].value
                });

                localStorage.setItem("stock", JSON.stringify(stock));

                setMenu('view');
            } else {
                alert("You do not have permission to add a product.");
            }
        };

        return (
            <div>
                <h1 className="m-3">Add Product</h1>
                <button className="btn btn-secondary m-3 d-flex" onClick={() => setMenu('view')}>Back</button>
                <form onSubmit={addProduct}>
                    <div className="form-group m-3">
                        <label className="d-flex align-items-center font-weight-bold" style={{ fontFamily: 'Poppins' }}>Name</label>
                        <input type="text" className="form-control" placeholder="Enter name" />
                    </div>
                    <div className="form-group m-3">
                        <label className="d-flex align-items-center font-weight-bold" style={{ fontFamily: 'Poppins' }}>Price</label>
                        <input type="number" className="form-control" placeholder="Enter price" />
                    </div>
                    <div className="form-group m-3">
                        <label className="d-flex align-items-center font-weight-bold" style={{ fontFamily: 'Poppins' }}>Quantity</label>
                        <input type="number" className="form-control" placeholder="Enter quantity" />
                    </div>
                    <div className="form-group m-3">
                        <label className="d-flex align-items-center font-weight-bold" style={{ fontFamily: 'Poppins' }}>Restock Cost</label>
                        <input type="number" className="form-control" placeholder="Enter restock cost" />
                    </div>
                    <div className="form-group m-3">
                        <label className="d-flex align-items-center font-weight-bold" style={{ fontFamily: 'Poppins' }}>Image URL</label>
                        <input type="text" className="form-control" placeholder="Enter image URL" />
                    </div>
                    <div className="form-group m-3">
                        <label className="d-flex align-items-center font-weight-bold" style={{ fontFamily: 'Poppins' }}>Category</label>
                        <input type="text" className="form-control" placeholder="Enter category" />
                    </div>
                    <div className="form-group m-3">
                        <label className="d-flex align-items-center font-weight-bold" style={{ fontFamily: 'Poppins' }}>Description</label>
                        <input type="text" className="form-control" placeholder="Enter description" />
                    </div>
                    <button type="submit" className="btn btn-primary m-3">Add</button>
                </form>
            </div>
        );
    };

    return (
        <div>
            <button className="btn btn-primary d-flex m-2" onClick={() => setMenu('add')}>Add Product</button>
            {menu === 'view' ? (
                <table className="table table-striped table-hover table-bordered table-responsive m-2">
                    <thead>
                        <tr>
                            <th>Stock ID</th>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Product Price</th>
                            <th>Product Quantity</th>
                            <th onClick={() => setMenu('manage')}>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((productItem, index) => {
                            return stock.map((stockItem, index) => {
                                if (stockItem.stock_id === productItem.stock_id) {
                                    return (
                                        <tr key={index} onClick={() => { setMenu('manage'); setManageProductId(stockItem.stock_id) }}>
                                            <td>{stockItem.stock_id}</td>
                                            <td>{productItem.stock_id}</td>
                                            <td>{productItem.name}</td>
                                            <td>{numberFormatIDR.format(productItem.price)}</td>
                                            <td>{stockItem.stock}</td>
                                            <td onClick={() => { setMenu('manage'); setManageProductId(stockItem.stock_id) }}><button className="btn btn-warning">Manage</button></td>
                                        </tr>
                                    );
                                } else {
                                    return null;
                                }
                            });
                        })}
                    </tbody>
                </table>
            ) : menu === 'manage' ? <ManageProduct stock_id={manageProductId} setMenu={setMenu} /> : menu === 'add' ? <AddProduct /> : null}
        </div>
    );
}

export { Product };
