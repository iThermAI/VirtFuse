import Navbar from "./components/navbar";
import FirstView from "./components/firstView";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import Logout from "./components/logout";
import "./App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Switch } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import Protect from "./components/protect";
import InformationContext from "./context/information";
import axios from "axios";

export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1f263c', // dark blue
      }
    },
  });
  const [auth, setAuth] = useState(localStorage.getItem('token') ? true : false);
  const onAuthentication = (value) => {
    setAuth(value)
  }
  const [isOpen, setIsOpen] = useState(false);
  const handleButtonClick = () => {
    setIsOpen(prevState => !prevState);
  }
  const [logoutTimer, setLogoutTimer] = useState(null);
  const onChangeLogoutTimer = (value) => {
    setLogoutTimer(value)
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = "/login";
    setAuth(false);

    clearTimeout(logoutTimer);
    setLogoutTimer(null);
  }
  // Get the value from backend
  const [temp, setTemp] = useState([]);
  const [cureSensorTemp, setCureSensorTemp] = useState([]);
  const [time, setTime] = useState([]);
  const [image, setImage] = useState(null);
  const [imageTH, setImageTH] = useState(null);
  const [resinFlow, setResinFlow] = useState(false);
  const toggleResinFlow = () => {
    setResinFlow(!resinFlow);
  }

  const [requestInterval, setRequestInterval] = useState(null);
  const [status, setStatus] = useState(localStorage.getItem('status') ? localStorage.getItem('status') : null);
  const [catRatio, setCatRatio] = useState(localStorage.getItem('catRatio') ? localStorage.getItem('catRatio') : null);
  const [initialRoomTemp, setInitialRoomTemp] = useState(localStorage.getItem('initialRoomTemp') ? localStorage.getItem('initialRoomTemp') : null);
  const [id, setId] = useState(null);
  const [score, setScore] = useState(null);
  const previousTimeRef = useRef(null);

  const initiateExp = () => {
    localStorage.setItem("status", "initiate");
    setStatus("initiate");
    axios.get("/api/initiate").then((res) => {
      setCatRatio(res.data.catRatio);
      localStorage.setItem("catRatio", res.data.catRatio);      
    }).catch((err) => {
      console.log(err);
    });
  }

  const startExp = async () => {
    clearInterval(requestInterval);
    localStorage.setItem("status", "start");
    setStatus("start");

    await axios.get("/api/start").then((res) => {
      console.log(res);
      setId(res.data.id);
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    axios.post("/node/createTable",
      {
        id: id
      })
      .then(res => {
        console.log(res);
        const interval = setInterval(() => {
          axios.get("/node/getInfo")
            .then((res) => {
              if (res.data.timeFromStartTemp && res.data.timeFromStartTemp !== previousTimeRef.current) {
                setTime(prevTime => [...prevTime, res.data.timeFromStartTemp.toFixed(1)]);
                setTemp(prevTemp => [...prevTemp, res.data.resinTemp]);
                setCureSensorTemp(prevTime => [...prevTime, res.data.cureTemp]);
              }
              console.log(res.data.timeFromStartTemp, previousTimeRef.current);
              previousTimeRef.current = res.data.timeFromStartTemp;

              setImage('data:image/jpeg;base64,' + res.data.image_rgb);
              setImageTH('data:image/jpeg;base64,' + res.data.image_th);
            })
            .catch(err => {
              console.log(err);
            });


        }, 1000);
        setRequestInterval(interval);
      })
      .catch(err => {
        console.log(err);
      });

  }, [id]);

  useEffect(() => {
    if (temp.length === 1) {
      setInitialRoomTemp(temp[0]);
      localStorage.setItem("initialRoomTemp", temp[0]);
    }
  }, [temp]);

  const finishExp = () => {
    localStorage.setItem("status", "finish");
    setStatus("finish");
    clearInterval(requestInterval);
    // axios.get("/api/finish").then((res) => {
    //   console.log(res.data);
    //   setScore("65%");
    // }).catch((err) => {
    //   console.log(err);
    // });

    axios.get("/api/finish").then((res) => {
      setCatRatio(res.data.score);
      setScore(res.data.score);    
    }).catch((err) => {
      console.log(err);
    });
  }

  const SummaryExp = () => {
    // !!!
    clearInterval(requestInterval);
    axios.get("/api/finish").then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  const StartOverExperiment = async () => {
    localStorage.removeItem('status');
    localStorage.removeItem('catRatio');
    localStorage.removeItem('initialRoomTemp');
    setStatus(null);
    clearInterval(requestInterval);
    await setTemp([]);
    await setCureSensorTemp([]);
    await setTime([]);
    axios.get("/api/finish").then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    function resetLogoutTimer() {
      console.log("resetLogoutTimer");
      if (logoutTimer === null) return;
      clearTimeout(logoutTimer);
      const timer = setTimeout(() => {
        localStorage.removeItem('token');
        window.location = "/login";
        setAuth(false);

        clearTimeout(logoutTimer);
        setLogoutTimer(null);
      }, 3600 * 1000);
      setLogoutTimer(timer);
    }
    window.addEventListener('click', resetLogoutTimer);
    return () => {
      window.removeEventListener('click', resetLogoutTimer);
    };
  }, [logoutTimer]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar auth={auth} handleButtonClick={handleButtonClick} />
        <Switch>
          <Route exact path='/' render={(props) => <FirstView {...props} auth={auth} />} />
          <Route path='/login' render={(props) => <Login {...props}
            onAuthentication={onAuthentication}
            auth={auth}
            onChangeLogoutTimer={onChangeLogoutTimer}
            handleLogout={handleLogout}
          />} />
          <Route path='/logout' component={Logout} />
          <InformationContext.Provider value={{
            temp,
            cureSensorTemp,
            time,
            image,
            imageTH,
            resinFlow,
            toggleResinFlow,
            status,
            catRatio,
            score,
            initialRoomTemp,
            initiateExp,
            startExp,
            finishExp,
            SummaryExp,
            StartOverExperiment
          }}>
            <Protect path='/dashboard' component={Dashboard} />
          </InformationContext.Provider>
        </Switch >
      </ThemeProvider>

    </>
  );
}
