import { useState } from "react";
import { Logout } from "../reusable/Logout";
import AddAccount from "./AddAccount";
import ManageAccount from "./ManageAccount";
import { Product } from "../reusable/Product";
import Transaksi from "../reusable/Transaksi";

const Admin = () => {
    const [menu, setMenu] = useState('view');
    const [manageUserId, setManageUserId] = useState(0);

    let user = localStorage.getItem("user");
    user = JSON.parse(user);

    return (
        <div className="container p-3">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Admin</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item m-2">
                                <button className="btn btn-primary" onClick={() => setMenu('view')}>View User</button>
                            </li>
                            <li className="nav-item m-2">
                                <button className="btn btn-primary" onClick={() => setMenu('product')}>Product</button>
                            </li>
                            <li className="nav-item m-2">
                                <button className="btn btn-primary" onClick={() => setMenu('transaction')}>Transaction</button>
                            </li>
                            <li className="nav-item m-2">
                                <Logout />
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>



            {menu === 'view' ? (
                <div>
                    <button className="btn btn-primary d-flex m-2 ms-0" onClick={() => setMenu('add')}>Add User</button>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((user) => (
                                <tr key={user.user_id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.tier}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => { setMenu('manage'); setManageUserId(user.user_id); }}>Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : menu === 'add' ? (
                <AddAccount />
            ) : menu === 'manage' ? (
                <ManageAccount userId={manageUserId} setMenu={setMenu} />
            ) : menu === 'product' ? (
                <Product />) : menu === 'transaction' ? (
                    <Transaksi />) : null}
        </div>
    );
}

export { Admin };
