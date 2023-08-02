import "./firstView.scss";
import { Button } from "@mui/material";
import { useHistory } from 'react-router-dom';
import "../sharedStyle.css";

function FirstView(props) {
    const history = useHistory();

    const handleClick = (input) => {
        history.push(input);
    };

    return (
        <>
            <div className="first-view-wrapper align-comp">
                <div className="main-container">
                    <div className="text-flex">
                        <h1 style={{ color: "#f9dd3f" }}>
                            Welcome to the dashboard!
                        </h1>
                        The dashboard provides real-time data on the resin flow, allowing you to monitor the flow rate, temperature, and other important metrics.
                        <div style={{ margin: "20px 0" }}>
                            {props.auth === true ? (
                                <Button variant="contained" onClick={() => handleClick('/dashboard')} sx={{
                                    background: "#f9dd3f",
                                    color: "black"
                                }}>Dashboard</Button>
                            ) : (
                                <Button variant="contained" onClick={() => handleClick('/login')} sx={{
                                    background: "#f9dd3f",
                                    color: "black"
                                }}>Login</Button>
                            )}
                        </div>
                    </div>
                    <div className="image-flex">
                        <img src={require('../assets/first-view.jpg')} alt="First View" className="image" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default FirstView;