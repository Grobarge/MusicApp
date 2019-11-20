import React from "react";
import "./App.css";


import Login from "./Components/Login";
import Home from "./Components/Home";
import Header from "./Components/Header";

// Auth context that will path Auth state to all components
export const AuthContext = React.createContext(); 
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};
// reducer is function that takes in state & action & returns new state based on action
const reducer = (state, action) => {
  switch (action.type) {
    // dispatched with payload containing "user" & "token" saves to localStorage then returns new state setting Auth to true and values of user & token keys
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    // When dispatched, clears LocalStorage of all data and sets to null
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
      // if no action is dispatched from above, this returns initail state
    default:
      return state;
  }
}

function App() {
  // returns state and dispatch 
  // state contains state of component and updates based on actions dispatched
  // dispatch is function that used to call/dispatch actions that change the state
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    // passing object into value prop 
    // object contains state and dispatch funtion so that it can be used globally
    // finaly, conditionally rendering Home/Login component based on Auth status
  <AuthContext.Provider
    value={{
      state,
      dispatch
    }}>
      <Header />
    <div className="App">{!state.isAuthenticated ? <Login /> : <Home />}</div>
    </AuthContext.Provider>
  );
}
export default App;
