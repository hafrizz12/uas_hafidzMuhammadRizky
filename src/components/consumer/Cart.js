import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cart, setCart }) => {
    let product = localStorage.getItem('product');
    product = product ? JSON.parse(product) : [];
    const [selectedProduct, setSelectedProduct] = useState([]);
    const navigate = useNavigate();

    const numberFormatIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });


    const handleProductSelection = (product_id) => {
        return (e) => {
            if (e.target.checked) {
                setSelectedProduct([...selectedProduct, product_id]);
            } else {
                setSelectedProduct(selectedProduct.filter(sp => sp !== product_id));
            }
        }
    }
    const totalCost = cart.reduce((acc, c) => {
        let foundAndSelectedProduct = selectedProduct.find(sp => sp === c.product_id);
        if (foundAndSelectedProduct) {
            let foundProduct = product.find(p => p.product_id === c.product_id);
            return acc + (foundProduct.price * c.quantity);
        }
        return acc; // Add this line to handle the case when foundAndSelectedProduct is undefined
    }, 0);

    return (
        <div>
            <h1>Cart</h1>
            {cart.length > 0 ? (
                cart.map((c, i) => (
                    <div key={i} style={{ display: 'flex', marginBottom: '20px' }}>
                        <div style={{ marginRight: '20px' }}>
                            <input type="checkbox" onChange={handleProductSelection(c.product_id)} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        </div>
                        {product.map((p, i) => {
                            if (c.product_id === p.product_id) {
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                        <div style={{ paddingRight: '20px' }}>
                                            <img src={p.image} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ textAlign: "start" }}>
                                            <h3>{p.name}</h3>
                                            <p>{p.description.length > 150 ? p.description.substring(0, 150) + '...' : p.description}</p>
                                            <p>{numberFormatIDR.format(p.price)} x {c.quantity} = {numberFormatIDR.format(p.price * c.quantity)}</p>
                                            <div style={{ display: 'flex' }}>
                                                <button onClick={() => {
                                                    let cartData = JSON.parse(localStorage.getItem('cart'));
                                                    let foundProduct = cartData.find(cp => cp.product_id === p.product_id);
                                                    if (foundProduct) {
                                                        if (foundProduct.quantity === 1) {
                                                            cartData = cartData.filter(cp => cp.product_id !== p.product_id);
                                                        } else {
                                                            foundProduct.quantity -= 1;
                                                        }
                                                    }
                                                    localStorage.setItem('cart', JSON.stringify(cartData));
                                                    setCart(cartData);
                                                }}>
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                                <p style={{ margin: '0 10px' }}>{c.quantity}</p>
                                                <button onClick={() => {
                                                    let cartData = JSON.parse(localStorage.getItem('cart'));
                                                    let foundProduct = cartData.find(cp => cp.product_id === p.product_id);
                                                    if (foundProduct) {
                                                        foundProduct.quantity += 1;
                                                    }
                                                    localStorage.setItem('cart', JSON.stringify(cartData));
                                                    setCart(cartData);
                                                }}>
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                ))
            ) : (
                <p>No items in cart</p>
            )}
            <div className="card p-4 " style={{ marginTop: '20px' }}>
                {selectedProduct.length > 0 ? (
                    <div>
                        <div className="d-flex justify-content-between">
                            <div className="col start" style={{ textAlign: 'start' }}>
                                <p className="poppins-regular" style={{ fontSize: '1.2rem', alignItems: 'start', textAlign: 'start', alignSelf: 'center' }}>{numberFormatIDR.format(totalCost)}</p>
                                <p>Selected items: {selectedProduct.length}</p>
                            </div>
                            <button className="btn btn-primary w-25 h-100 p-3 align-self-center" onClick={() => { navigate('/checkout', { state: { product: selectedProduct } }) }}>Buy</button>
                        </div>
                    </div>
                ) : (
                    <p>No item selected</p>
                )}
            </div>
        </div>
    );
}

export { Cart };