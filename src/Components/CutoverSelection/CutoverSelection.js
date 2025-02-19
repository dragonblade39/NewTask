import React, { useState, useEffect } from "react";
import "../../App.css";

function CutoverSelection() {
  const steps = ["Select", "TPS", "Cutover", "Report"];
  const [activeStep, setActiveStep] = useState(0);
  const progressWidth = activeStep * (100 / steps.length) + "%";
  const progressLeft = 100 / (steps.length * 2) + "%";

  const [cutoverType, setCutoverType] = useState("Single Loop");
  const [selectedNames, setSelectedNames] = useState([]);
  const [controllerTypes, setControllerTypes] = useState([]);

  const [selectedContainer, setSelectedContainer] = useState("");
  const [pointType, setPointType] = useState("");

  const [tpsAvailable, setTpsAvailable] = useState([]);
  const [tpsSelected, setTpsSelected] = useState([]);

  const [cutoverContent, setCutoverContent] = useState([]);
  const [cutoverSelected, setCutoverSelected] = useState([]);

  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tpsAvailable.length / itemsPerPage);
  const paginatedItems = tpsAvailable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchControllerTypes = async () => {
      try {
        const response = await fetch("/ControllerTypes.json");
        const data = await response.json();
        setControllerTypes(data);
      } catch (error) {
        console.error("Error fetching controller types:", error);
      }
    };
    fetchControllerTypes();
  }, []);

  useEffect(() => {
    if (activeStep === 1) {
      const fetchLoopSelection = async () => {
        try {
          const response = await fetch("/LoopSelection.json");
          const data = await response.json();
          setTpsAvailable(data);
          setCurrentPage(1);
        } catch (error) {
          console.error("Error fetching LoopSelection data:", error);
        }
      };
      fetchLoopSelection();
    }
  }, [activeStep]);

  useEffect(() => {
    if (activeStep === 2) {
      const fetchCutoverContent = async () => {
        try {
          const response = await fetch("/CutoutoverContent.json");
          const data = await response.json();
          setCutoverContent(data);
        } catch (error) {
          console.error("Error fetching CutoutoverContent:", error);
        }
      };
      fetchCutoverContent();
    }
  }, [activeStep]);

  // Automatically set the first selected name as selectedContainer when navigating to activeStep 1
  useEffect(() => {
    if (activeStep === 1 && selectedNames.length > 0) {
      setSelectedContainer(selectedNames[0]); // Set the first selected name as the container
    }
  }, [activeStep, selectedNames]);

  const handleCutoverTypeChange = (e) => {
    setCutoverType(e.target.value);
  };

  const handleAddName = (name) => {
    if (!selectedNames.includes(name)) {
      setSelectedNames([...selectedNames, name]);
      setNotification(""); // Clear notification
    }
  };

  const handleRemoveName = (name) => {
    setSelectedNames(selectedNames.filter((item) => item !== name));
    setNotification(""); // Clear notification
  };

  const handleSelectedContainerChange = (e) => {
    setSelectedContainer(e.target.value);
    setPointType("");
    setNotification(""); // Clear notification
  };

  const handlePointTypeChange = (e) => {
    setPointType(e.target.value);
    setNotification(""); // Clear notification
  };

  const handleAddTpsItem = (item) => {
    if (!tpsSelected.includes(item)) {
      setTpsSelected([...tpsSelected, item]);
      setTpsAvailable(
        tpsAvailable.filter(
          (i) => (i.controllerName || i) !== (item.controllerName || item)
        )
      );
      setNotification(""); // Clear notification
    }
  };

  const handleRemoveTpsItem = (item) => {
    if (
      !tpsAvailable.find(
        (i) => (i.controllerName || i) === (item.controllerName || item)
      )
    ) {
      setTpsAvailable([...tpsAvailable, item]);
      setTpsSelected(
        tpsSelected.filter(
          (i) => (i.controllerName || i) !== (item.controllerName || item)
        )
      );
      setNotification(""); // Clear notification
    }
  };

  const handleAddCutoverItem = (item) => {
    if (!cutoverSelected.includes(item)) {
      setCutoverSelected([...cutoverSelected, item]);
      setNotification(""); // Clear notification
    }
  };

  const handleRemoveCutoverItem = (item) => {
    setCutoverSelected(cutoverSelected.filter((i) => i !== item));
    setNotification(""); // Clear notification
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleNextStep = () => {
    if (activeStep === 0 && selectedNames.length === 0) {
      setNotification("Please select at least one controller.");
      return;
    }
    
    if (activeStep === 1) {
      if (selectedContainer === "") {
        setNotification("Please select a Controller.");
        return;
      }
      
      if (pointType === "") {
        setNotification("Please select a point type.");
        return;
      }
      
      if (tpsSelected.length === 0) {
        setNotification("Please select at least one TPS controller.");
        return;
      }
    }
  
    if (activeStep === 2) {
      if (cutoverSelected.length === 0) {
        setNotification("Please select at least one cutover item.");
        return;
      }
    }

    setNotification("");
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="cutover-container">
      <div
        className="step-container"
        style={{
          "--progress-width": progressWidth,
          "--progress-left": progressLeft,
        }}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-wrapper ${
              index === activeStep ? "active-step" : ""
            } ${index < activeStep ? "completed-step" : ""}`}
          >
            <div className="circle">{index + 1}</div>
            <div className="label">{step}</div>
          </div>
        ))}
      </div>

      {activeStep === 0 && (
      <>
        <div className="cutover-type-container">
          <strong htmlFor="cutoverType">Cutover Type:&nbsp;</strong>
          <select
            id="cutoverType"
            value={cutoverType}
            onChange={handleCutoverTypeChange}
          >
            <option value="single">Single Loop</option>
            <option value="multiple">Multiple Loop</option>
          </select>
        </div>
        <div className="names-section">
          <div className="names-container">
            <div className="controller-container">
              <div className="container-header">
                <span>Controller</span>
              </div>
              <div className="list-container">
                {controllerTypes.map((item) => (
                  <div key={item.id} className="list-item">
                    <span>{item.controllerName}</span>
                    <button
                      className="window-control window-add"
                      onClick={() => handleAddName(item.controllerName)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M6 1v10M1 6h10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="selected-container">
              <div className="container-header">
                <span>Selected</span>
              </div>
              <div className="list-container">
                {selectedNames.length > 0 ? (
                  selectedNames.map((name, index) => (
                    <div key={index} className="list-item">
                      <span>{name}</span>
                      <button
                        className="window-control window-remove"
                        onClick={() => handleRemoveName(name)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 12 12"
                          width="20"
                          height="20"
                        >
                          <path
                            d="M2 2l8 8M10 2L2 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No names selected</p>
                )}
              </div>
            </div>
          </div>
          {notification && (
            <div className="notification">{notification}</div>
          )}
        </div>
      </>
      )}

      {activeStep === 1 && (
        <div className="tps-container">
          <div className="display-dropdowns">
            <div className="selected-container-dropdown">
              <strong htmlFor="selectedContainer">
                Selected Controller:&nbsp;
              </strong>
              <select
                id="selectedContainer"
                value={selectedContainer}
                onChange={handleSelectedContainerChange}
              >
                {selectedNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="point-type-dropdown">
              <strong htmlFor="pointType">Point type:&nbsp;</strong>
              <select
                id="pointType"
                value={pointType}
                onChange={handlePointTypeChange}
              >
                <option value="">Select Point Type</option>
                <option value="point1">All</option>
                <option value="point1">Point 1</option>
                <option value="point2">Point 2</option>
              </select>
            </div>
          </div>
          {notification && <div className="notification">{notification}</div>}
          {pointType && (
            <div className="point-containers">
              <div className="controller-container">
                <div className="container-header">
                  <span>TPS Points</span>
                </div>
                <div className="list-container">
                  {paginatedItems.map((item, index) => (
                    <div key={index} className="list-item">
                      <span>{item.controllerName || item}</span>
                      <button
                        className="window-control window-add"
                        onClick={() =>
                          handleAddTpsItem(item.controllerName || item)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 12 12"
                          width="20"
                          height="20"
                        >
                          <path
                            d="M6 1v10M1 6h10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="selected-container">
                <div className="container-header">
                  <span>Selected Points</span>
                </div>
                <div className="list-container">
                  {tpsSelected.length > 0 ? (
                    tpsSelected.map((item, index) => (
                      <div key={index} className="list-item">
                        <span>{item.controllerName || item}</span>
                        <button
                          className="window-control window-remove"
                          onClick={() =>
                            handleRemoveTpsItem(item.controllerName || item)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 12 12"
                            width="20"
                            height="20"
                          >
                            <path
                              d="M2 2l8 8M10 2L2 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No Points selected</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeStep === 2 && (
        <div className="cutover-display-container">
          <div className="display-dropdowns">
            <div className="selected-container-dropdown">
              <strong>Selected Controller:&nbsp;</strong>
              <select disabled value={selectedContainer}>
                <option value={selectedContainer}>{selectedContainer}</option>
              </select>
            </div>
            <div className="point-type-dropdown">
              <strong>Loops:&nbsp;</strong>
              <select
                value={pointType}
                onChange={(e) => setPointType(e.target.value)}
              >
                <option value="">Select Loop</option>
                {tpsSelected.length > 0 ? (
                  tpsSelected.map((item, index) => (
                    <option key={index} value={item.controllerName || item}>
                      {item.controllerName || item}
                    </option>
                  ))
                ) : (
                  <option value="">No loops selected</option>
                )}
              </select>
            </div>
          </div>
          {notification && <div className="notification">{notification}</div>}
          {pointType && (
            <div className="point-containers">
              <div className="controller-container">
                <div className="container-header">
                  <span>Control Modules</span>
                </div>
                <div className="list-container">
                  {cutoverContent.length > 0 ? (
                    cutoverContent.map((item, index) => (
                      <div key={index} className="list-item">
                        <span>{item.controllerName || item}</span>
                        <button
                          className="window-control window-add"
                          onClick={() =>
                            handleAddCutoverItem(item.controllerName || item)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 12 12"
                            width="20"
                            height="20"
                          >
                            <path
                              d="M6 1v10M1 6h10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                        </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No content available</p>
                  )}
                </div>
              </div>
              <div className="selected-container">
                <div className="container-header">
                  <span>Selected Control Modules</span>
                </div>
                <div className="list-container">
                  {cutoverSelected.length > 0 ? (
                    cutoverSelected.map((item, index) => (
                      <div key={index} className="list-item">
                        <span>{item}</span>
                        <button
                          className="window-control window-remove"
                          onClick={() => handleRemoveCutoverItem(item)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 12 12"
                            width="20"
                            height="20"
                          >
                            <path
                              d="M2 2l8 8M10 2L2 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No items selected</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeStep === 3 && (
        <div className="report-container">
          <h2>Report</h2>
        </div>
      )}

      <div className="button-container">
        <button
          className="back-button"
          onClick={handleBackStep}
          disabled={activeStep === 0}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={handleNextStep}
          disabled={activeStep >= steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CutoverSelection;