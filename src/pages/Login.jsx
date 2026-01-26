import { useState, useEffect } from 'react';
import { useLoginMutation } from '../services/authApi';
import { useDispatch } from 'react-redux';

const Login = () => {

    const [formData, setFormData] = useState({ email: "admin@gmail.com", password: "admi" });

    const [login, { isError, error, isSuccess, data, isLoading }] = useLoginMutation();

    const dispatch = useDispatch();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(formData).unwrap(); // unwrap gives you the actual response data
            console.log("Login success:", res);
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    useEffect(() => {
        if (isError) {
            alert("Wrong"); // Or use a toast notification
        }
    }, [isError, isSuccess, dispatch]);

    if (isLoading) return <h1>Loading...</h1>;

    if (isSuccess) {
        return (<h1>Success</h1>);
    }


    return (
        <form onSubmit={onSubmit}>
            <button type="submit">Login</button>
        </form>
    )
}

export default Login