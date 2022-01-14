/* eslint-disable no-underscore-dangle */
import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../misc/config";

import Details from "../components/show/Details";
import ShowMainData from "../components/show/ShowMainData";
import Cast from "../components/show/Cast";

import Seasons from "../components/show/Seasons";
import { InfoBlock, ShowPageWrapper } from "./Show.styled";

function Show() {
  const reducer = (prevState, action) => {
    switch (action.type) {
      case "FETCH_SUCCESS": {
        return {
          isLoading: false,
          error: null,
          show: action.show,
        };
      }

      case "FETCH_FAILED": {
        return {
          ...prevState,
          isLoading: false,
          error: action.error,
        };
      }

      default:
        return prevState;
    }
  };

  const initialState = {
    show: null,
    isLoading: true,
    error: null,
  };

  const { id } = useParams();

  const [{ show, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // console.log("state", state);

  useEffect(() => {
    let isMounted = "true";

    apiGet(`/shows/${id}?embed[]=seasons&embed[]=cast`)
      .then((results) => {
        if (isMounted) {
          dispatch({ type: "FETCH_SUCCESS", show: results });
        }
      })
      .catch((err) => {
        if (isMounted) {
          dispatch({ type: "FETCH_FAILED", error: err.message });
        }
      });

    return () => {
      isMounted = "false";
    };
  }, [id]);

  // console.log("show", show);
  // console.log("isLoading", isLoading);

  if (isLoading) {
    return <div>Data is being loaded</div>;
  }

  if (error) {
    return <div>Error occured: {error}</div>;
  }

  return (
    <ShowPageWrapper>
      <ShowMainData
        image={show.image}
        name={show.name}
        rating={show.rating}
        summary={show.summary}
        tags={show.genres}
      />

      <InfoBlock>
        <h2>Details</h2>
        <Details
          status={show.status}
          network={show.neywork}
          premiered={show.premiered}
        />
      </InfoBlock>

      <InfoBlock>
        <h2>Seasons</h2>
        <Seasons seasons={show._embedded.seasons} />
      </InfoBlock>

      <InfoBlock>
        <h2>Cast</h2>
        <Cast cast={show._embedded.cast} />
      </InfoBlock>
    </ShowPageWrapper>
  );
}

export default Show;
