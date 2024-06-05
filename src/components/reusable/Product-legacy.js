import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Pusher from 'pusher-js';

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

    let stock = localStorage.getItem("stock");
    stock = JSON.parse(stock);

    const ManageProduct = (stock_id) => {
        const navigator = useNavigate();

        let userTier = localStorage.getItem("session");
        userTier = JSON.parse(userTier);
        userTier = userTier.tier;

        let product = localStorage.getItem("product");
        product = JSON.parse(product);

        product = product.filter((productItem) => {
            return productItem.stock_id === stock_id.stock_id;
        });

        let stock = localStorage.getItem("stock");
        stock = JSON.parse(stock);

        stock = stock.filter((stockItem) => {
            return stockItem.stock_id === stock_id.stock_id;
        });

        const updateProduct = (e) => {
            e.preventDefault();

            if (userTier === "admin" || userTier === "inventory" || userTier === "supplier") {


                const get = localStorage.getItem("product");
                let products = JSON.parse(get);


                products = [...products.filter((productItem) => {

                    if (productItem.stock_id === stock_id.stock_id) {
                        productItem.name = e.target[0].value;
                        productItem.price = e.target[1].value;
                    }

                    return productItem.stock_id !== stock_id.stock_id;
                }), ...products.filter((productItem) => {
                    return productItem.stock_id === stock_id.stock_id;
                })];

                let stock = localStorage.getItem("stock");
                stock = JSON.parse(stock);
                stock = stock.map((stockItem) => {
                    if (stockItem.stock_id === stock_id.stock_id) {
                        stockItem.stock = e.target[2].value;
                    }
                    return stockItem;
                });

                console.log(stock);

                localStorage.setItem("stock", JSON.stringify(stock));

                localStorage.setItem("product", JSON.stringify(products));

                setMenu('view');
            } else {
                alert("You do not have permission to update the product.");
            }
        };

        return (
            <div>
                <h1>Manage Product</h1>
                <button onClick={() => setMenu('view')}>Back</button>
                <form onSubmit={updateProduct}>
                    <p>Product ID: {product[0].stock_id}</p>
                    <input type="text" placeholder="Enter name" defaultValue={product[0].name} disabled={!(userTier === "admin" || userTier === "inventory")} />
                    <input type="number" placeholder="Enter price" defaultValue={product[0].price} disabled={!(userTier === "admin" || userTier === "inventory")} />
                    <input type="number" placeholder="Enter quantity" defaultValue={stock[0].stock} disabled={!(userTier === "admin" || userTier === "inventory" || userTier === "supplier")} />
                    <button type="submit">Update</button>
                </form>
            </div>
        );
    }

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

                products.push({
                    stock_id: products.length + 1,
                    name: e.target[0].value,
                    stock: products.length + 1,
                    sold: 0,
                    image: e.target[4].value,
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
                <h1>Add Product</h1>
                <button onClick={() => setMenu('view')}>Back</button>
                <form onSubmit={addProduct}>
                    <input type="text" placeholder="Enter name" />
                    <input type="number" placeholder="Enter price" />
                    <input type="number" placeholder="Enter quantity" />
                    <input type="number" placeholder="Enter restock cost" />
                    <input type="text" placeholder="Enter image URL" />
                    <input type="text" placeholder="Enter category" />
                    <input type="text" placeholder="Enter description" />
                    <button type="submit">Add</button>
                </form>
            </div>
        );


    };


    return (
        <div>
            <h1>Stock</h1>
            <button className="btn btn-primary" onClick={() => setMenu('add')}>Add Product</button>
            {menu === 'view' ? product.map((productItem, index) => {
                return stock.map((stockItem, index) => {
                    if (stockItem.stock_id === productItem.stock_id) {
                        return (
                            <div key={index} onClick={() => { setMenu('manage'); setManageProductId(stockItem.stock_id) }}>
                                <h2>Stock ID: {stockItem.stock_id}</h2>
                                <p>Product ID: {productItem.stock_id}</p>
                                <p>Product Name: {productItem.name}</p>
                                <p>Product Price: {productItem.price}</p>
                                <p>Product Quantity: {stockItem.stock}</p>
                            </div>
                        );
                    } else {
                        return null;
                    }
                });
            }) : menu === 'manage' ? <ManageProduct stock_id={manageProductId} /> : menu === 'add' ? <AddProduct /> : null}
        </div>
    );
}

export { ProductLegacy };