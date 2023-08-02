import { Avatar, Button } from "@mui/material";
import "./login.scss";
import * as yup from "yup";
import { Alert, AlertTitle } from "@mui/material";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import "../sharedStyle.css";

const Login = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [account, setAccount] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const schema = yup.object().shape({
        email: yup
            .string()
            .email("The email is not valid.")
            .required("Email is required."),
        password: yup
            .string()
            .required("Password is required."),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await validate();
        console.log("Result is", result);
        if (result) {
            setLoading(true);
            setErrors([]);

            await axios
                .post("/node/login", result)
                .then((res) => {
                    console.log(res);
                    localStorage.setItem("token", res.data);
                    props.onAuthentication(true);
                    const timer = setTimeout(() => {
                        props.handleLogout();
                    }, 3600 * 1000);
                    props.onChangeLogoutTimer(timer);
                    props.history.replace("/dashboard");
                    // window.location = "/dashboard";
                })
                .catch((err) => {
                    console.log(err);
                    setErrors([err.response.data]);
                    props.onAuthentication(false);
                });

            setLoading(false);
        }
    };

    const handleChange = ({ currentTarget: input }) => {
        // e.currentTarget
        const updatedAccount = { ...account };
        updatedAccount[input.id] = input.value;
        setAccount(updatedAccount);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validate = async () => {
        const result = await schema
            .validate(account, {
                abortEarly: false,
            })
            .then((res) => {
                setErrors([]);
                return res;
            })
            .catch((err) => {
                console.log(err.errors);
                setErrors(err.errors);
            });
        return result;
    };

    return (
        <>
            <div className="login-page align-comp">
                <form className="form-wrapper" onSubmit={handleSubmit}>

                    <div className="form-intro">
                        <Avatar alt="Kyklos" src={require('../assets/logo.png')} sx={{ m: 1, width: 80, height: 80 }} />
                        Sing in to dashboard
                    </div>

                    {errors.length !== 0 && (
                        <Alert severity="error">
                            <AlertTitle>Errors</AlertTitle>
                            <ul>
                                {errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}

                    {props.auth === true ? (
                        <h3>
                            You are already singed in!
                        </h3>
                    ) : (<>
                        <label htmlFor="email" className="input-label">Email</label>
                        <input type="text" id="email" name="email" className="input-text" autoComplete="email" value={account.email} onChange={handleChange} />

                        <label htmlFor="password" className="input-label">Password</label>
                        <div className="password-container">
                            <input type={showPassword ? "text" : "password"} id="password" name="password" autoComplete="password" className="input-text" style={{ marginBottom: "0" }} value={account.password} onChange={handleChange} />
                            <span className="visible-toggle-btn" onClick={handleClickShowPassword}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </span>
                        </div>

                        <Button
                            variant="contained"
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Login
                        </Button>
                    </>)}
                </form>
            </div>
        </>
    )


};

export default Login;
