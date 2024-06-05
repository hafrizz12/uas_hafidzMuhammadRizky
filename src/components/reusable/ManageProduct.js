import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ManageProduct = ({ stock_id, setMenu, setStockDeficit }) => {
    const navigator = useNavigate();
    const [menu, setMenuLocal] = useState('manage');

    let userTier = localStorage.getItem("session");
    userTier = JSON.parse(userTier).tier;

    let product = localStorage.getItem("product");
    product = JSON.parse(product).filter((productItem) => {
        return productItem.stock_id === stock_id;
    });

    let stock = localStorage.getItem("stock");
    stock = JSON.parse(stock).filter((stockItem) => {
        return stockItem.stock_id === stock_id;
    });

    const updateProduct = (e) => {
        e.preventDefault();

        if (userTier === "admin" || userTier === "inventory" || userTier === "supplier") {
            const get = localStorage.getItem("product");
            let products = JSON.parse(get);

            products = [...products.filter((productItem) => {
                if (productItem.stock_id === stock_id) {
                    productItem.name = e.target[0].value;
                    productItem.image = e.target[1].value;
                    productItem.price = e.target[2].value;
                }
                return productItem.stock_id !== stock_id;
            }), ...products.filter((productItem) => {
                return productItem.stock_id === stock_id;
            })];

            let stock = localStorage.getItem("stock");
            stock = JSON.parse(stock);
            stock = stock.map((stockItem) => {
                if (stockItem.stock_id === stock_id) {
                    stockItem.stock = e.target[3].value;
                }
                return stockItem;
            });

            localStorage.setItem("stock", JSON.stringify(stock));
            localStorage.setItem("product", JSON.stringify(products));

            setMenu('view');
            if (userTier === "supplier") {
                setStockDeficit();
            }
        } else {
            alert("You do not have permission to update the product.");
        }
    };

    const deleteProduct = () => {
        if (userTier === "admin" || userTier === "inventory") {
            let products = localStorage.getItem("product");
            products = JSON.parse(products);

            products = products.filter(productItem => {
                return productItem.stock_id !== stock_id;
            });

            let stock = localStorage.getItem("stock");
            stock = JSON.parse(stock);

            stock = stock.filter(stockItem => {
                return stockItem.stock_id !== stock_id;
            });

            localStorage.setItem("product", JSON.stringify(products));
            localStorage.setItem("stock", JSON.stringify(stock));

            setMenu('view');
        } else {
            alert("You do not have permission to delete the product.");
        }
    }

    return (
        <div>
            <h1>Manage Product</h1>
            <button onClick={() => setMenu('view')} className="btn btn-secondary d-flex">Back</button>
            <form onSubmit={updateProduct}>
                <div className="form-group">
                    <label htmlFor="name" className="text-start d-flex m-3">Name</label>
                    <input type="text" className="form-control m-3" id="name" placeholder="Enter name" defaultValue={product[0].name} disabled={!(userTier === "admin" || userTier === "inventory")} />
                </div>
                <div className="form-group">
                    <label htmlFor="price" className="text-start d-flex m-3">Image</label>
                    <input type="text" className="form-control m-3" id="image" placeholder="Enter image URL" defaultValue={product[0].image} disabled={!(userTier === "admin" || userTier === "inventory")} />
                </div>
                <div className="form-group">
                    <label htmlFor="price" className="text-start d-flex m-3">Price</label>
                    <input type="number" className="form-control m-3" id="price" placeholder="Enter price" defaultValue={product[0].price} disabled={!(userTier === "admin" || userTier === "inventory")} />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity" className="text-start d-flex m-3">Quantity</label>
                    <input type="number" className="form-control m-3" id="quantity" placeholder="Enter quantity" defaultValue={stock[0].stock} disabled={!(userTier === "admin" || userTier === "inventory" || userTier === "supplier")} />
                </div>
                <button type="submit" className="btn btn-primary m-4">Update</button>
                <button className="btn btn-danger" onClick={deleteProduct} disabled={!(userTier === "admin" || userTier === "inventory")}>Delete</button>
            </form>
        </div>
    );
};

export default ManageProduct;
