import { useState } from "react";

const Status = ({ }) => {
    const [status, setStatus] = useState('');
    return (
        <div>
            <h1>Status</h1>
            <p>{status}</p>
        </div>
    );
}

export { Status };