import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
const NotFound = () =>{
    const navigate = useNavigate()
    useEffect(()=>{
        setTimeout(() => {
            navigate('/', { replace: true });
        }, 3000);
    }, [navigate])
    return (
        <h1>404 WRONG PAGE, you're being redirected in 3, 2... ... thanks </h1>
    )
}

export default NotFound