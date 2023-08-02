import React, { useState, useEffect } from 'react';
import {
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Box,
  Avatar,
  IconButton
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Cancel as CancleIcon
} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  DrawerHeader,
  AppBar,
  Drawer,
  Item
} from "./MUI/MUIFunctions";
import { AspectRatio } from '@mui/joy';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import Ws from './components/Ws';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: "20px"
  },
});


export default function App() {
  const [open, setOpen] = useState(false);
  const [imgsrc, setImgsrc] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [data, setData] = useState([]);
  const [time, setTime] = useState([]);
  const [room, setRoom] = useState([]);
  const [part, setPart] = useState([]);
  const [resin, setResin] = useState([]);
  const [chartState, setChartState] = useState({
    series: [
      {
        name: 'Temprature',
        data: resin,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      xaxis: {
        categories: time,
      },
      title: {
        text: 'Resin Temprature'
      },
    }
  });
  const [chartOptions, setChartOpions] = useState({
    series: [{
      name: "Room Temprature",
      data: room
    }],
    options: {
      chart: {
        type: 'area',
        height: 350
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Room Temp'
      },
      xaxis: {
        categories: time,
      }
    },
  }
  )

  useEffect(() => {
    setChartState({
      series: [
        {
          name: 'Temperature',
          data: resin,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'bar',
        },
        xaxis: {
          categories: time,
        },
      },
    });

    setChartOpions({
      series: [{
        name: "Room Temprature",
        data: room
      }],
      options: {
        xaxis: {
          categories: time,
        }
      },
    })
  }, [resin, time, room]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [clipPath, setClipPath] = useState('ellipse(25% 20% at 46% 79%)');

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
      setIntervalId(null);
    };
  }, []);

  useEffect(() => {
    axios.get('/api')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);


  const start = () => {
    console.log("start");
    const id = setInterval(() => {
      axios.get('/api/frame', { responseType: 'arraybuffer' })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'image/jpeg' });
          const reader = new FileReader();
          reader.onload = () => {
            setImgsrc(reader.result);
          };
          reader.readAsDataURL(blob);

          axios.get('/api/data').then((res) => {
            console.log(res.data);
            setData(res.data);
            setTime((prevList) => [...prevList, res.data["Time"]]);
            setResin((prevList) => [...prevList, res.data["Initial Resin Temprature"]]);
            setRoom((prevList) => [...prevList, res.data["Room Temprature"]]);
            setPart((prevList) => [...prevList, res.data["Part Temprature"]]);
          }).catch((err) => {
            console.log(err);
          });

          setClipPath((prevClipPath) =>
            prevClipPath === 'ellipse(25% 20% at 46% 79%)'
              ? 'ellipse(20% 15% at 46% 79%)'
              : 'ellipse(25% 20% at 46% 79%)'
          );

        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000);
    setIntervalId(id);
  }

  const exit = () => {
    console.log("exit");
    clearInterval(intervalId);
    setIntervalId(null);
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton sx={{ px: 1 }}>
              <Avatar alt="Kyklos" src="logo192.png" />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Kyklos Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <Typography variant="h6" Wrap component="div" edge="start">
              Enjoy!
            </Typography>
            <IconButton onClick={handleDrawerClose} edge="end">
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {[["Start", <PlayCircleFilledIcon onClick={start} />], ["End", <CancleIcon onClick={exit} />]].map((i, index) => (
              <ListItem key={i[0]} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {i[1]}
                  </ListItemIcon>
                  <ListItemText primary={i[0]} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "#eeeaea",
            minHeight: "100vh",
          }}
        >
          <DrawerHeader />

          <Ws />

          <Typography paragraph align="center" fontWeight="bold">
            The introduction or any information which is needed.
          </Typography>
          <Box sx={{
            flexGrow: 1,
            my: 2,
            p: 1,
            borderRadius: 2,
            boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.25)",
            fontSize: "0.875rem",
            fontWeight: "700",
            backgroundColor: "white",
            textAlign: "center",
            background: "#ffac386e"
          }}>
            Catalyst/Resin Ratio: ?%
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              my: 2,
              p: 1,
              borderRadius: 2,
              boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.25)",
              fontSize: "0.875rem",
              fontWeight: "700",
              backgroundColor: "white",
            }}
          >
            <AspectRatio objectFit="fill" maxHeight={600} minWidth="100%" position="relative">
              <img alt="Sample" src={imgsrc} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
              <div style={{ position: 'absolute', right: "8%", top: "8%", zIndex: 2, background: "#a97b4f", color: "white", padding: "10px", borderRadius: "5px" }}>
                Room Temprature: {data["Room Temprature"]}
              </div>
              <div style={{ position: 'absolute', right: "27%", top: "45%", zIndex: 2, background: "#c2b946de", color: "white", padding: "10px", borderRadius: "5px" }}>
                Resin Temprature: {data["Initial Resin Temprature"]}
              </div>
              <CustomTooltip title="The center" followCursor>
                <div style={{
                  position: 'absolute', top: 0, left: 0, zIndex: 4,
                  backgroundColor: '#917816', width: "100%", height: "100%",
                  clipPath: clipPath,
                  opacity: "0.4",
                  borderRadius: "50px / 30px"
                }}>
                </div>
              </CustomTooltip>
            </AspectRatio >
          </Box>
          <Box sx={{
            flexGrow: 1,
            my: 2,
            p: 1,
            borderRadius: 2,
            boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.25)",
            fontSize: "0.875rem",
            fontWeight: "700",
            backgroundColor: "white",
            textAlign: "center"
          }}>
            <Grid
              container
              sx={{
                margin: "auto",
              }}
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                sx={{ background: "#de9f1aa6" }}
              >
                Heater Temprature: {data["Heater Tempreture"]}
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                sx={{ background: "#e3e086d9" }}
              >
                Part Temprature: {data["Part Temprature"]}
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              sx={{
                margin: "auto",
              }}
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
              >
                <Item sx={{ minHeight: "200px" }}><div id="chart">
                  <ReactApexChart options={chartState.options} series={chartState.series} type="bar" height={380} />
                </div></Item>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
              >
                <Item sx={{ minHeight: "200px" }}><div id="chart">
                  <ReactApexChart options={chartOptions.options} series={chartOptions.series} type="area" height={380} />
                </div></Item>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box >

      <div className="login-page">
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="form-item">
                        <Avatar alt="Kyklos" src={require('../assets/logo192.png')} sx={{ m: 1, width: 80, height: 80 }} />
                        Sing in to dashboard
                    </div>
                    {this.state.errors.length !== 0 && (
                        <Alert severity="error">
                            <AlertTitle>Errors</AlertTitle>
                            <ul>
                                {this.state.errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}
                    <Input
                        name="Email"
                        value={Email}
                        onChange={this.handleChange}
                    />
                    <Input
                        name="password"
                        value={password}
                        label="Password"
                        onChange={this.handleChange}
                        onShowPass={this.handleClickShowPassword}
                        showPassword={this.state.showPassword}
                    />
                    {/* <div className="form-item">
            <Button
              variant="contained"
              className="submit-btn"
              onClick={this.handleSubmit}
              disabled={this.state.loading}
            >
              ورود
            </Button>
            <Link to={"/signup"}>
              <div className="desc-link">
                برای ایجاد حساب کاربری کلیک نمایید.
              </div>
            </Link>
          </div> */}
                </form>
            </div>
    </>
  );
}
