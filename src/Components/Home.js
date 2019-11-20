import React from "react";
import { AuthContext } from "../App";
import Card from "./Card";


const initialState = {
    songs: [], // hold songs initially empty 
    isFetching: false, // loading state
    hasError: false, // error state 
};
  
// if fetchsongrequest is dispatched , return new state of isFetching to true
const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_SONGS_REQUEST":
        return {
          ...state,
          isFetching: true,
          hasError: false
        };
        // if dispatched, return new state with value isFetching to false
        // then set songs to the payload sent back from sever 
      case "FETCH_SONGS_SUCCESS":
        return {
          ...state,
          isFetching: false,
          songs: action.payload
        };
        // if failed set set error to true and isfetching to false and return initial state
      case "FETCH_SONGS_FAILURE":
        return {
          ...state,
          hasError: true,
          isFetching: false
        };
      default:
        return state;
    }
  };

  // conditionally rendering span with loading text if loading state is true 
  // or render span with error message if error state is true 
  // otherwise we loop through array of songs and render each one as Card component passing in props
  export const Home = () => {
    const { state: authState } = React.useContext(AuthContext);
    const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
      dispatch({
        type: "FETCH_SONGS_REQUEST"
      });
      fetch("https://hookedbe.herokuapp.com/api/songs", {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw res;
          }
        })
        .then(resJson => {
          console.log(resJson);
          dispatch({
            type: "FETCH_SONGS_SUCCESS",
            payload: resJson
          });
        })
        .catch(error => {
          console.log(error);
          dispatch({
            type: "FETCH_SONGS_FAILURE"
          });
        });
    }, [authState.token]);
  
    return (
      <React.Fragment>
      <div className="home">
        {state.isFetching ? (
          <span className="loader">LOADING...</span>
        ) : state.hasError ? (
          <span className="error">AN ERROR HAS OCCURED</span>
        ) : (
          <>
            {state.songs.length > 0 &&
              state.songs.map(song => (
                <Card key={song.id.toString()} song={song} />
              ))}
          </>
        )}
      </div>
      </React.Fragment>
    );
  };
  export default Home;