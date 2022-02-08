import MomentUtils from '@date-io/moment';
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import axios from "axios";
import Cookie from "js-cookie";
import jwtDecode from "jwt-decode";
import { updateLocale } from "moment";
import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import socketIOClient from "socket.io-client";
import "./App.css";
import AppBar from "./components/AppBar";
import AuthRoute from "./components/AuthRoute";
import AuthRouteAdminOnly from "./components/AuthRouteAdminOnly";
import ConnectionLostModal from "./components/ConnectionLostModal";
import Navigation from "./components/Navigation";
import Notification from "./components/Notification";
import ParamTemplates from "./pages/ParamTemplates";
import { checkLocalStorage } from "./redux/actions/dataActions";
import {
  getDstat, saveStatus, setSocketsResponse
} from "./redux/actions/dcuActions";
import { checkEnv, getOptions } from "./redux/actions/uiActions";
import {
  checkUser,
  getSocketUsers, logoutUser
} from "./redux/actions/userActions";
import store from "./redux/store";
import { colorSwitch } from "./utils/MiscFunctions";
import PLCRoutes from "./routes/PLCRoutes";
import HesRoutes from "./routes/HesRoutes";
import LinearLoadBar from "./components/LinearLoadBar";
import { I18n } from "react-redux-i18n";
import AccountIcon from "@material-ui/icons/AccountCircleRounded";


//pages import for splitting whole App to smaller .js chunks
//process.env.xxxx
const Dashboard = lazy(() => import("./pages/Dashboard"));
const login = lazy(() => import("./pages/login"));
const Meters = lazy(() => import("./pages/Meters"));
const Users = lazy(() => import("./pages/Users"));
const Billing = lazy(() => import("./pages/Billing"));
const MeterDataSum = lazy(() => import("./pages/MetersDataSum"));
const MeterInfo = lazy(() => import("./pages/MeterInfo"));
const LoadProfile = lazy(() => import("./pages/LoadProfile"));
const InstantValues = lazy(() => import("./pages/InstantValues"));
const MetersReadings = lazy(() => import("./pages/MetersReadings"));
const UserTasks = lazy(() => import("./pages/UserTasks"));
const DcuLiveStats = lazy(() => import("./pages/DCULiveStats"));

//const DCUStatus = lazy(() => import("./pages/DCUSystemStatus"));
const SystemTasks = lazy(() => import("./pages/SystemTasks"));
const PLCTree = lazy(() => import("./pages/PLCTree"));
const Page404 = lazy(() => import("./pages/Page404"));
const Alarms = lazy(() => import("./pages/Alarms"));
const ResetPassword = lazy(() => import("./pages/reset"));
const EventLog = lazy(() => import("./pages/EventLog"));
const Settings = lazy(() => import("./pages/Settings"));
const TaskLogs = lazy(() => import("./pages/TaskLogs"));
const MsureProfile = lazy(() => import("./pages/MsureProfile"));
const DataReports = lazy(() => import("./pages/DataReports"));
const DataExports = lazy(() => import("./pages/DataExports"));
const KPIReports = lazy(() => import("./pages/KPIReports"));
const MetersBlackList = lazy(() => import("./pages/MetersBlackList"));
const DCUStatus = lazy(() => import("./pages/DCUStatus"));
const MetersWhiteList = lazy(() => import("./pages/MetersWhiteList"));
const DailyProfile = lazy(() => import("./pages/DailyProfile.js"));

// const PLCRoutingTable = lazy(() => import("./pages/PLCRoutingTable"));
// const PLCNeighbourTable = lazy(() => import("./pages/PLCNeighbourTable"));
// const PLCSpectrumLive = lazy(() => import("./pages/PLCSpectrumLive"));
// const PLCSpectrumSession = lazy(() =>
//   import("./pages/PLCMeterSessionSpectrum")
// );
// const PLCPresharedKeys = lazy(() => import("./pages/PLCPresharedKeys.js"));
const MetersReadingsPercentage = lazy(() =>
  import("./pages/MetersReadingsPercentage")
);
const SystemEventsConfig = lazy(() => import("./pages/SystemEventsConfig"));
const SystemEvents = lazy(() => import("./pages/SystemEvents.js"));


let socket = null;
let logout;

export class App extends Component {
  state = {
    sockets: false,
    connection: true,
  };
  /*
   * Setting time counter before user is logged out
   */

  logOutIfTokenExp = () => {
    const logOutTIme = localStorage.getItem("lou");
    console.log("Loging out after " + logOutTIme / 1000 + "s");
    logout = setTimeout(() => {
      clearTimeout(logout);
      console.log("Token expired, loging out");
      store.dispatch(logoutUser());
      // store.dispatch(
      //   setNotification(
      //     "Please login to continue.",
      //     "info",
      //     "Session time is over."
      //   )
      // );
    }, logOutTIme);
  };

  componentDidMount() {
    store.dispatch(getOptions());
    store.dispatch(checkLocalStorage());
    store.dispatch(checkEnv());
    /*
     * Setting lout (Log Out User) time
     */
    const logOutTIme = localStorage.getItem("lou");
    const cookieToken = Cookie.get("dcuToken");

    updateLocale(this.props.locale.toLowerCase(), { week: { dow: 1 } });

    /*
     * Checking token
     */

    if (cookieToken) {
      const decodedToken = jwtDecode(cookieToken);
      if (!decodedToken.exp || !logOutTIme) {
        store.dispatch(logoutUser());
        window.location.href = "/login";
        axios.defaults.headers.common["Authorization"] = null;

        // socket.removeListener("dcuStatusChanged");
        // socket.off("dcuStatusChanged", this.setData);
        // socket.removeListener("dstat");
        // socket.off("dstat", this.setData);
        // this.setState({ sockets: false });
        // socket = null;
      } else {
        axios.defaults.headers.common["Authorization"] = cookieToken;
        this.props.checkUser();
        // this.logOutIfTokenExp();
        // console.log(decodedToken.exp * 1000 - Date.now());
        // setTimeout(() => {
        //   store.dispatch(logoutUser()); //passing the user id
        // }, decodedToken.exp * 1000 - Date.now());
        // setTimeout(() => {
        //   console.log("didi mount, loging out");
        //   this.props.logoutUser();
        //   // socket.removeListener("dcuStatusChanged");
        //   // socket.off("dcuStatusChanged", this.setData);
        //   // socket.removeListener("dstat");
        //   // socket.off("dstat", this.setData);
        //   // this.setState({ sockets: false });
        //   // socket = null;
        // }, 3000);
        // socket.on("dcuStatusChanged", data => store.dispatch(saveStatus(data)));
        // data => saveStatus(data)
        //window.location.href = "/";

        //store.dispatch({ type: SET_AUTHENTICATED });
        // store.dispatch(setUser(decodedToken.name));
      }
    }
  }

  getYear = () => {
    const date = new Date().getFullYear();
    return date;
  };

  logout = () => {
    clearTimeout(logout);
    socket.removeListener("dcuStatusChanged");
    localStorage.removeItem("lou");
    socket.close();
    this.props.logoutUser();
    this.setState({ sockets: false });
  };

  /*
   * Setting up sockets connection if client authenticated
   */

  UNSAFE_componentWillReceiveProps(newProps) {
    newProps.locale !== this.props.locale && updateLocale(newProps.locale.toLowerCase(), { week: { dow: 1 } });
    //if user authenticated and socket are off
    const that = this;
    if (newProps.user.authenticated && !this.state.sockets) {
      this.logOutIfTokenExp();
      that.setState({ connection: true });
      socket = socketIOClient("/", {
        query: {
          token: Cookie.get("dcuToken"),
          // name: this.props.user.user.name,
        },
      });

      store.dispatch({ type: "SET_SOCKET_IO", payload: socket });
      socket.io.on("reconnect", () => {
        that.setState({ connection: true }); // true
      });
      socket.on("dcuStatusChanged", (data) => store.dispatch(saveStatus(data)));
      socket.on("dstat", (data) => store.dispatch(getDstat(data)));
      socket.on("connect_error", (err) => console.log(err));
      socket.on("connect_failed", (err) => console.log(err));
      socket.on("socketsUsers", (data) => store.dispatch(getSocketUsers(data)));
      // socket.on("dcuStatusChanged", (data) => console.log(data));
      socket.on(
        "dcu",
        (data) => {
          store.dispatch(setSocketsResponse(data));
        }

        // data => store.dispatch(setSocketsResponse(data))
      );
      socket.on("disconnect", function () {
        window.location.search !== "?restarting" &&
          that.setState({ connection: false });
        console.log("Lost connection with websockets!");
        //window.location.reload(true);
      });

      this.setState({ sockets: true });
    }

    if (!newProps.user.authenticated && this.state.sockets) {
      console.log("disabling sockets");

      socket.close();
      this.setState({ sockets: false });
    }
  }

  /*
   * Closing socket connections when user closing browser
   */

  componentWillUnmount() {
    console.log("Unmounting app");
    // socket.close();
    // socket.removeListener("dcuStatusChanged");
    // socket.off("dcuStatusChanged", this.setData);
    // socket.removeListener("dstat");
    // socket.off("dstat", this.setData);
    // socket.removeAllListeners("dcu");
    this.setState({ sockets: false });
  }

  closeConnectionModal = (st) => {
    this.setState({ connection: st });
  };

  render() {
    const { authenticated, loading, user } = this.props.user;

    // const userType = user && user.type;

    return (
      <div className="main" locale={this.props.locale}>
        <div
          className={`background ${this.props.ui.options && this.props.ui.options.clr
            ? colorSwitch(this.props.ui.options.clr)
            : colorSwitch(0)
            }`}
        />
        {this.props.ui.errors && this.props.ui.errors.notification && (
          <Notification
            msgType={"err"}
            title={"Error"}
            msg={this.props.ui.errors.notification}
          />
        )}
        {this.props.ui.notification && (
          <Notification
            msgType={"succ"}
            title={"Success"}
            msg={this.props.ui.notification}
          />
        )}
        <MuiPickersUtilsProvider utils={MomentUtils} locale={this.props.locale.toLowerCase()}>
          <Router>

            {authenticated ? (
              !loading &&
              user && (
                <div className="main-container fade-in">
                  <div className="dashboard">
                    <div className="home-cont">
                      {!this.state.connection && (
                        <ConnectionLostModal
                          close={() => this.closeConnectionModal(true)}
                        />
                      )}
                      <Navigation />

                      <div style={{ width: "100%", overflow: "hidden" }}>
                        <AppBar />
                        <div className="home-main">

                          <Suspense
                            fallback={<div className="loading-abs linear-load" >
                              <LinearLoadBar text={`${I18n.t('Preparing page, please wait')}...`} />
                            </div>
                            }
                          >
                            <Switch>

                              <AuthRoute exact path="/" component={Dashboard} />
                              <AuthRoute path="/404" component={Page404} />
                              <AuthRoute
                                path="/eventconfig"
                                component={SystemEventsConfig}
                              />
                              <AuthRoute path="/events" component={SystemEvents} />
                              <AuthRoute
                                path="/whitelist"
                                component={MetersWhiteList}
                              />
                              <AuthRoute
                                path="/meters/dailyprofile/:id"
                                component={DailyProfile}
                              />
                              <AuthRoute
                                path="/blacklist"
                                component={MetersBlackList}
                              />
                              <AuthRoute path="/kpi" component={KPIReports} />
                              <AuthRoute
                                path="/data/exports"
                                component={DataExports}
                              />
                              <AuthRoute
                                path="/data/reports"
                                component={DataReports}
                              />
                              <AuthRoute
                                path="/meters/msureprofile/:id"
                                component={MsureProfile}
                              />

                              <AuthRoute path="/tasks/logs" component={TaskLogs} />
                              <AuthRoute path="/plctree" component={PLCTree} />
                              <AuthRoute
                                path="/status/statusdcu"
                                component={DCUStatus}
                              />

                              <AuthRoute
                                path="/settings/settings"
                                component={Settings}
                              />
                              <AuthRoute path="/alarms" component={Alarms} />

                              <AuthRoute
                                path="/dcu/stats"
                                component={DcuLiveStats}
                              />
                              <AuthRoute
                                path="/tasks/system"
                                component={SystemTasks}
                              />
                              <AuthRoute path="/tasks/user" component={UserTasks} />
                              <AuthRoute
                                path="/settings/paramtemplates"
                                component={ParamTemplates}
                              />
                              <AuthRoute
                                path="/readingspercentage"
                                component={MetersReadingsPercentage}
                              />
                              <AuthRoute
                                path="/readingstable"
                                component={MetersReadings}
                              />


                              {/* <AuthRoute exact path="/" component={Dashboard} /> */}
                              <AuthRoute
                                path="/meters/eventlog/:id"
                                component={EventLog}
                              />
                              <AuthRoute
                                path="/meters/billing/:id"
                                component={Billing}
                              />
                              <AuthRoute
                                path="/meters/instantvalues/:id"
                                component={InstantValues}
                              />
                              <AuthRoute
                                path="/meters/loadprofile/:id"
                                component={LoadProfile}
                              />

                              <AuthRoute path="/settings/users" component={Users} />
                              <AuthRouteAdminOnly
                                path="/meters/info/:id"
                                component={MeterInfo}
                              />
                              <AuthRoute
                                path="/meterdatasum"
                                component={MeterDataSum}
                              />
                              <AuthRoute path="/meters" component={Meters} />

                              {parseInt(process.env.REACT_APP_G3_PLC) === 1 && <PLCRoutes />}
                              {process.env.REACT_APP_SYSTEM_MODE === 'hes' && <HesRoutes />}
                              <AuthRoute component={Dashboard} />

                            </Switch>
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : !user && !loading ? (
              <Suspense fallback={<div className="loading-abs linear-load" >
                <LinearLoadBar text={`${I18n.t('Loading')}...`} />
              </div>}>
                <Switch>
                  <Route exact path="/" component={login} />
                  <Route path="/reset" component={ResetPassword} />
                  <Route path="/404" component={Page404} />
                  <Route component={login} />
                </Switch>
              </Suspense>
            ) : (
              <div className="loading-abs linear-load" >
                <LinearLoadBar text={<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 7, alignItems: 'flex-end' }}><AccountIcon style={{ marginRight: 7, color: '#696969' }} /><div>{I18n.t('Logging in')}...</div></div>} />
              </div>
            )}
          </Router>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  ui: state.ui,
  locale: state.i18n.locale,
});

export default connect(mapStateToProps, {
  checkUser,
  logoutUser,
  saveStatus,
  checkEnv,
  setSocketsResponse,
})(App);
