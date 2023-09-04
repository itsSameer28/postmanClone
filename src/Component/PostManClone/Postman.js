import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { instance } from "../Services/Api";
export default function PostMan() {

  //States
  
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [buttonClick, setButtonClick] = useState(false);
  const [openBodyTextButton, setOpenBodyTextButton] = useState(false);
  const [response, setResponse] = useState(null);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);
  const [deleteButton, setDeleteButton] = useState(false);
  const [keyParams, setKeyParams] = useState("");
  const [valueParams, setValueParams] = useState("");
  const [paramsButton, setParamsButton] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    // JSON Validation
    try {
      JSON.parse(body);
      setError("valid JSON");
      return;
    } catch (err) {
      setError("InValid Json");
      return;
    }
  };

  const handleResponsesOfProtocols = async (method, url, data) => {
    try {
      const responses = await instance({
        method,
        url,
        data,
      });
      setResponse(responses.data);
    } catch (error) {
      console.log(error);
    }
  };
  //Setting Key Values In the URL With The Help Of useEffect
  useEffect(() => {
    if (url !== "") {
      const newURL = new URL(url);
      const searchParams = newURL.searchParams;
      searchParams.forEach((_, paramKey) => {
        if (paramKey !== keyParams) {
          searchParams.delete(paramKey);
        }
      });
      if (valueParams) {
        newURL.searchParams.set(keyParams, valueParams);
      } else {
        newURL.searchParams.delete(keyParams, valueParams);
      }
      setUrl(newURL);
    }
  }, [keyParams, valueParams]);

  // Actions Performing on Submission Of Form
  const handleSubmit = (event) => {
    event.preventDefault();

    //HTTP Protocols' Response
    try {
      switch (method) {
        case "GET":
          if (url) {
            handleResponsesOfProtocols("GET", url);
          } else {
            setError("URL or data is not defined");
            return;
          }
          break;
        case "POST":
          if (url && body) {
            handleResponsesOfProtocols("POST", url, JSON.parse(body));
          } else {
            setError("URL or data is not defined");
            return;
          }
          break;
        case "PUT":
          if (url && body) {
            handleResponsesOfProtocols("PUT", `${url}/${id}`, JSON.parse(body));
          } else {
            setError("URL or data is not defined");
            return;
          }
          break;
        case "DELETE":
          if (url && id) {
            handleResponsesOfProtocols("DELETE", `${url}/${id}`);
          } else {
            setError("URL or ID is not defined");
            return;
          }
          break;
        default:
          handleResponsesOfProtocols("GET", url);
      }
    } catch (error) {
      setResponse(error.message);
    }

    //Loading Response
    instance.interceptors.request.use((req) => {
      setLoader(true);
      return req;
    });

    instance.interceptors.response.use((res) => {
      setLoader(false);
      return res;
    });
  };

  //Return Section
  return (
    <div className="form-container">
      <div className="form-operations">
        <form onSubmit={handleSubmit}>
          <button className="form-button">Click For Get PostMan</button>
          <br />
          <br />
          <div>
            <label className="form-label">
              Method:
              <select
                className="form-select"
                value={method}
                onChange={handleMethodChange}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="DELETE">DELETE</option>
                <option value="PUT">PUT</option>
              </select>
            </label>
            <br />
            <br />
            <label className="form-label">
              URL:
              <button
                className="form-button"
                onClick={(e) => setButtonClick(true)}
              >
                Open Url
              </button>
              <br />
              <br />
              {buttonClick && (
                <input
                  className="form-input"
                  type="text"
                  placeholder="URL"
                  value={url}
                  onChange={handleUrlChange}
                />
              )}
            </label>
            <br />
            <br />
            <label className="form-label">
              Params:
              <button
                className="form-button"
                onClick={(e) => {
                  setParamsButton(true);
                  setOpenBodyTextButton(true);
                  setButtonClick(false);
                }}
              >
                Params
              </button>
              {paramsButton && (
                <div>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Key"
                    value={keyParams}
                    onChange={(e) => setKeyParams(e.target.value)}
                  />
                  <br />
                  <br />
                  <input
                    className="form-input"
                    type="text"
                    value={valueParams}
                    placeholder="Value"
                    onChange={(e) => setValueParams(e.target.value)}
                  />
                </div>
              )}
            </label>
            {method === "PUT" && (
              <label className="form-label">
                Body:
                <button
                  className="form-button"
                  onClick={() => {
                    setOpenBodyTextButton(true);
                    setButtonClick(false);
                  }}
                >
                  Click For Write Body
                </button>
                <br />
                <br />
                {openBodyTextButton && (
                  <textarea
                    className="form-textarea"
                    placeholder="Body"
                    value={body}
                    onChange={handleBodyChange}
                    rows="8"
                    cols="25"
                  />
                )}
                <br />
                <br />
                <label className="form-label">
                  <button
                    className="form-button"
                    onClick={() => {
                      setOpenBodyTextButton(false);
                      setButtonClick(false);
                      setDeleteButton(true);
                    }}
                  >
                    ID For Edit In Data:
                  </button>
                  <br />
                  <br />
                  {deleteButton && (
                    <input
                      className="form-input"
                      type="text"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  )}
                </label>
                <br />
                <br />
                {error && (
                  <p className="form-error" style={{ color: "red" }}>
                    {error}
                  </p>
                )}
              </label>
            )}
            {method === "POST" ? (
              <label className="form-label">
                Body:
                <button
                  className="form-button"
                  onClick={() => {
                    setOpenBodyTextButton(true);
                    setButtonClick(false);
                  }}
                >
                  Click For Write Body
                </button>
                <br />
                <br />
                {openBodyTextButton && (
                  <textarea
                    className="form-textarea"
                    value={body}
                    onChange={handleBodyChange}
                    rows="8"
                    cols="25"
                  />
                )}
                {error && (
                  <p className="form-error" style={{ color: "red" }}>
                    {error}
                  </p>
                )}
              </label>
            ) : method === "DELETE" ? (
              <div>
                <label className="form-label">
                  <button
                    className="form-button"
                    onClick={() => {
                      setOpenBodyTextButton(true);
                      setButtonClick(false);
                      setDeleteButton(true);
                    }}
                  >
                    ID For Delete Data:
                  </button>
                  <br />
                  <br />

                  {deleteButton && (
                    <input
                      className="form-input"
                      type="text"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  )}
                </label>
              </div>
            ) : null}
            <br />
            <br />
            <button className="form-button form-submit" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="form-response">
        {loader && (
          <div>
            <CircularProgress className="loader" />
          </div>
        )}
        {response && (
          <textarea className="form-response" rows="25" cols="80">
            {JSON.stringify(response, null, 2)}
          </textarea>
        )}
      </div>
    </div>
  );
}