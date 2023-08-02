import { useState, useContext } from 'react';
import "./dashboard.scss";
import {
    PlayCircleFilled as PlayCircleFilledIcon,
    Cancel as CancleIcon,
    Summarize as SummarizeIcon
} from "@mui/icons-material";
// import HeatMap from '../Charts/heatmap';
import GaugeChart from '../Charts/gauge';
// import BarChart from '../Charts/barChart';
import AreaChart from '../Charts/areaChart';
import "../sharedStyle.css";
import InformationContext from '../context/information';
import { Button } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const Dashboard = () => {
    const {
        image,
        imageTH,
        status,
        catRatio,
        score,
        initialRoomTemp,
        initiateExp,
        startExp,
        finishExp,
        SummaryExp,
        StartOverExperiment
    } = useContext(InformationContext);

    const [progress, setProgress] = useState(50);

    return (
        <>
            <div className="dashboard-container align-comp">
                <div className="sidebar" style={{ position: "relative", minWidth: "80px" }}>
                    <div style={{ position: "fixed" }}>
                        <ul>
                            <li className={`li-items ${status === "initiate" || status === "start" ? 'disabled' : ''}`}
                                onClick={status !== "initiate" && status !== "start" ? initiateExp : null}>
                                <PlayCircleFilledIcon sx={{ fontSize: "30px !important" }} />
                                <span className="sidebar-btn-txt" >Start Experiment</span>
                                <span className="sidebar-btn-txt-bottom">Start</span>
                            </li>
                            <li className={`li-items ${status === null || status === "initiate" || status === "finish" ? 'disabled' : ''}`}
                                onClick={status !== "null" ? finishExp : null}>
                                <CancleIcon sx={{ fontSize: "30px !important" }} />
                                <span className="sidebar-btn-txt" >Finish Experiment</span>
                                <span className="sidebar-btn-txt-bottom">Finish</span>
                            </li>
                            <li className={`li-items ${status === null || status === "initiate" || status === "start" ? 'disabled' : ''}`}
                                onClick={status !== "null" ? SummaryExp : null}>
                                <SummarizeIcon sx={{ fontSize: "30px !important" }} />
                                <span className="sidebar-btn-txt" >Summary of Expreriment</span>
                                <span className="sidebar-btn-txt-bottom">Summary</span>
                            </li>
                            <li className={`li-items`}>
                                <Button variant="contained" sx={{
                                    background: "#5bf93f",
                                    color: "black",
                                    width: "100%"
                                }}>Oil Pump Maintenance Check</Button>
                            </li>
                            <li className={`li-items`} >
                                <Button variant="contained" sx={{
                                    background: "#5bf93f",
                                    color: "black",
                                    width: "100%"
                                }}>Optimold Sensor Maintenance Check</Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="main-content" style={(status === null || status === "initiate") ? { height: '100vh' } : {}}>
                    <div className="dashboard-title">
                        VirtFuse Dashboard
                    </div>

                    {status === null && (
                        <div className={`info-box ${status === null ? 'fade-in' : 'fade-out'}`}>
                            <div>Click here to start your experiment.</div>
                            <div>
                                <Button variant="contained" onClick={initiateExp} sx={{
                                    background: "#f9dd3f",
                                    color: "black",
                                    fontSize: "1em",
                                    margin: "30px 0"
                                }}>Start Experiment</Button>
                            </div>
                        </div>
                    )}

                    {status === "initiate" && (
                        <div className={`warning-box ${status === "initiate" ? 'fade-in' : 'fade-out'}`}>
                            <div style={{ margin: "5px" }}>Best Catalyst/Resin Ratio is: <span className='catRatio-info'>{catRatio}</span></div>
                            <div>If you are ready, press next to go to dashboard.</div>
                            <div>
                                <Button variant="contained" onClick={startExp} sx={{
                                    background: "#f9dd3f",
                                    color: "black",
                                    fontSize: "1em",
                                    margin: "30px 0"
                                }}>Next</Button>
                            </div>
                        </div>
                    )}

                    {(status === "start" || status === "finish") && (<div className={`dashboard-box ${(status === "start" || status === "finish") ? 'fade-in' : 'fade-out'}`}>
                        <div className="catRatio-box">
                            Optimal Catalyst/Resin Ratio:  <span className='catRatio-info'>{catRatio}</span>
                        </div>
                        {status === "finish" && <div className="catRatio-box" style={{ background: "#5a1010" }}>
                            Final Score of Infusion: <span className='catRatio-info' style={{ background: "#3f0000" }}>{score}</span>
                        </div>}
                        <div style={{ width: "97%", margin: "auto", marginBottom: "20px" }}>
                            <div className="text">Oil Pump Usage Period [Maximum: 80 hours]</div>
                            <div className="progress-bar-container">
                                <progress className="progress-bar" value={100} max={100} />
                                <div className="progress-text">{`100%`} </div>
                            </div>
                        </div>
                        <div style={{ width: "97%", margin: "auto", marginBottom: "20px" }}>
                            <div className="text">Optimold Sensor Usage Period [Maximum: 10 hours]</div>
                            <div className="progress-bar-container1">
                                <progress className="progress-bar1" value={100} max={100} />
                                <div className="progress-text">{`100%`} </div>
                            </div>
                        </div>
                        <div className="charts">
                            <div className="image-container" style={status === "finish" ? { flexDirection: 'row' } : { flexDirection: 'column' }}>
                                {
                                    (status === "start" || status === "finish") ? (
                                        <>
                                            <img
                                                src={image}
                                                alt="Camera"
                                                className="camera-image"
                                                style={status === "finish" ? { width: '45%' } : { width: '100%' }}
                                            />

                                            <img
                                                src={imageTH}
                                                alt="Camera"
                                                className="camera-image"
                                                style={status === "finish" ? { width: '45%' } : { width: '100%' }}
                                            />
                                        </>
                                    ) : <div style={{ width: '100%', height: '100%', background: "#1f263c" }} />
                                }
                            </div>
                            {status === "start" && <div className="gauge-container">
                                <div className="chart-info" style={{ minHeight: "40vh" }}>
                                    <div className="chart-info-title" style={{ margin: "15px 5px", fontSize: "20px", fontWeight: "bold" }}>
                                        The more information:
                                    </div>
                                    <ul>
                                        <li>Catalyst/Resin Ratio:<span style={{ color: "white" }}> {catRatio}</span></li>
                                        <li>Initial Room Temperature:<span style={{ color: "white" }}> {initialRoomTemp} </span></li>
                                    </ul>
                                </div>
                                <div className="gauge-chart" style={{ minHeight: "45vh" }}>
                                    <div className="chart-info-title" style={{ margin: "15px 5px", fontSize: "20px", fontWeight: "bold" }}>
                                        Room Temperature:
                                    </div>
                                    <GaugeChart />
                                </div>
                            </div>}
                        </div>
                        <div className="bar-charts-container">
                            <div className="area-chart">
                                <div className="chart-info-title" style={{ margin: "15px 5px", fontSize: "20px", fontWeight: "bold" }}>
                                    Room Temperature:
                                </div>
                                {image && <AreaChart index="resin" />}
                            </div>
                            <div className="area-chart">
                                <div className="chart-info-title" style={{ margin: "15px 5px", fontSize: "20px", fontWeight: "bold" }}>
                                    Curing Level:
                                </div>
                                {image && <AreaChart index="curingSensor" />}
                            </div>
                        </div>
                        {status === "finish" && <div style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "x-large"
                        }}>
                            <Button variant="contained" onClick={StartOverExperiment} sx={{
                                background: "#f9dd3f",
                                color: "black",
                                fontSize: "1em",
                                margin: "30px 0"
                            }}>Start New Experiment</Button>
                        </div>}
                    </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Dashboard;