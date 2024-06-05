const ProductList = ({ cart, setCart }) => {
    let products = localStorage.getItem('product');
    let storedSessionData = localStorage.getItem('session');
    let productList = products ? JSON.parse(products) : [];

    const numberFormatIDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    const addToCart = (product) => {
        // if there is already inside
        let storedSessionData = JSON.parse(localStorage.getItem('session'));
        let userId = storedSessionData.user_id;
        let cartData = {
            "user_id": userId,
            "product_id": product.product_id,
            "quantity": 1
        };

        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        let foundProduct = cart.find(cp => cp.product_id === product.product_id);
        if (foundProduct) {
            foundProduct.quantity += 1;
        } else {
            cart.push(cartData);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        setCart(cart);
    }

    return (
        <div className="row">
            {productList.length > 0 ? (
                productList.map((p, i) => (
                    <div key={i} className="col-md-4 col-12" style={{ marginTop: "20px" }}>
                        <div className="card h-100">
                            <img src={p.image[0]} className="card-img-top" height={'100%'} alt={p.name} style={{ objectFit: 'cover' }} />
                            <div className="card-body">
                                <h3 className="card-title">{p.name}</h3>
                                <p className="card-text">{numberFormatIDR.format(p.price)}</p>
                                <p className="card-text">{p.description.length > 150 ? `${p.description.substring(0, 150)}...` : p.description}</p>
                            </div>
                            {p.isNew && (
                                <span className="badge badge-success">New</span>
                            )}
                            <div className="card-footer">
                                <button onClick={() => { addToCart(p) }} className="btn btn-primary">Add to cart</button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
}

export { ProductList };