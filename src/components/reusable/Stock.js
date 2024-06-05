import { useState } from "react";

const Stock = ({ userTier }) => {
    const [menu, setMenu] = useState('view');
    const [manageStockId, setManageStockId] = useState(null);
    let product = localStorage.getItem("product");
    product = JSON.parse(product);
    console.log(product);

    let stock = localStorage.getItem("stock");
    stock = JSON.parse(stock);

    const ManageStock = (stock_id) => {
        console.log(stock_id);

        console.log(stock);


        return (
            <div>
                <h1>Manage Stock</h1>
                <input type="number" placeholder="Enter quantity" />
            </div>
        );
    }

    return (
        <div>
            <h1>Stock</h1>
            {menu === 'view' ? product.map((productItem, index) => {
                return stock.map((stockItem, index) => {
                    if (stockItem.stock_id === productItem.stock_id) {
                        return (
                            <div key={index} onClick={() => { setMenu('manage'); setManageStockId(stockItem.stock_id) }}>
                                <h2>Stock ID: {stockItem.stock_id}</h2>
                                <p>Product ID: {productItem.stock_id}</p>
                                <p>Product Name: {productItem.name}</p>
                                <p>Product Price: {productItem.price}</p>
                                <p>Product Quantity: {stockItem.stock}</p>
                            </div>
                        );
                    } else {
                        return <h1 key={index}>No product stockable available</h1>
                    }
                });
            }) : menu === 'manage' ? <ManageStock stock_id={manageStockId} /> : null}
        </div>
    );
}

export { Stock };