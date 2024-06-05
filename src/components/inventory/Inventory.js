import { useState } from "react";
import { useEffect } from "react";
import { Stock } from "../reusable/Stock";
import Pusher from 'pusher-js';
import { Product } from "../reusable/Product";
import { Logout } from "../reusable/Logout";


const Inventory = ({ }) => {
    let session = localStorage.getItem("session");
    session = JSON.parse(session);
    let user_tier = session.tier;
    useEffect(() => {
        let pusher = new Pusher('871e38a0ad296d7d629e', {
            cluster: 'ap1'
        });

        let channel = pusher.subscribe('my-channel');

        channel.bind('my-event', function (data) {
            alert('An event was triggeraed with data: ' + JSON.stringify(data));
        });

        // Cleanup function
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);
    return (
        <div className="container p-3">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Inventory</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Logout />
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Product userTier={user_tier} />
        </div>
    );
}

export { Inventory };