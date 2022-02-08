import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { loginUser } from '../redux/actions/UserActions'
import { useNavigate } from "react-router-dom";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    let navigate = useNavigate();

    return <div style={{ display: 'flex', flexDirection: 'column', width: 200 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => dispatch(loginUser({ name: name, password: password }, navigate))}>submit</button>
    </div>;
}

export default Login;
