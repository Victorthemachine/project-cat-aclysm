import React from "react";
import Loading from '../Loading/Loading';
import { Navigate } from 'react-router';
import { useParams } from "react-router-dom";
import axios from 'axios';

// Pretty sure restOfProps is useless but I will keep for now.
// source: https://dev.to/olumidesamuel_/implementing-protected-route-and-authentication-in-react-js-3cl4#:~:text=Protected%20Routes%20are%20routes%20that,based%20on%20a%20set%20condition.
function LoginRoute() {
    //const isAuthenticated = localStorage.getItem("nya-bot-auth");
    ////console.log("this", isAuthenticated);
    const params = useParams();
    const [verified, setVerified] = React.useState();

    React.useEffect(() => {
        axios.post('http://localhost:8080/auth/verify', {
            url: params.id
        }, {
            withCredentials: true,
        })
            .then(res => {
                if (Object.keys(res.data).includes('auth')) {
                    if (res.data.auth === true) {
                        setVerified(true);
                    } else {
                        //localStorage.setItem('nya-bot-auth', 'false');
                        setVerified(false);
                    }
                } else setVerified(false);
            })
            .then(err => {
                // Generally server timeout todo here
            });
    }, [params])

    return (
        verified !== undefined
        ? <Navigate replace to="/dashboard" />
        : <Loading />
    );

}

export default LoginRoute;