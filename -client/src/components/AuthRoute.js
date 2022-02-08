import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Outlet } from "react-router-dom";

const AuthRoute = ({ component: Component, path, element }) => {
  const userState = useSelector((state) => state.user);

  return (
    userState.user ? <Outlet /> : <Navigate to="/login" />
  );
};


export default (AuthRoute);

// import React from "react";
// import { Route, Redirect } from "react-router-dom";
// import { connect } from "react-redux";

// const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={props =>
//         authenticated !== true ? (
//           <Redirect to="/login" />
//         ) : (
//           <Component {...props} />
//         )
//       }
//     />
//   );
// };
// const mapStateToProps = state => ({
//   authenticated: state.user.authenticated
// });
// export default connect(mapStateToProps)(AuthRoute);
