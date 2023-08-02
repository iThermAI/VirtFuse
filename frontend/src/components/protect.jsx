import { Route, Redirect } from 'react-router-dom';

const Protect = ({ component: Component, ...restProps }) => {
    const isAuth = localStorage.getItem('token');

    return (
        <Route render={(props) => {
            return isAuth ? <Component {...props} {...restProps}/> : <Redirect to="/login" />
        }}
        />
    );

}

export default Protect;