import React, { useState, useEffect } from "react";
import "../../App.css";

function CutoverSelection() {
  const steps = ["Select", "Configure", "Cutover", "Report"];
  const [activeStep, setActiveStep] = useState(0);
  const progressWidth = activeStep * (100 / steps.length) + "%";
  const progressLeft = 100 / (steps.length * 2) + "%";
  const [cutoverType, setCutoverType] = useState("");
  const [selectedNames, setSelectedNames] = useState([]);
  const [controllerTypes, setControllerTypes] = useState([]);

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

  const handleCutoverTypeChange = (e) => {
    setCutoverType(e.target.value);
  };

  const handleAddName = (name) => {
    if (!selectedNames.includes(name)) {
      setSelectedNames([...selectedNames, name]);
    }
  };

  const handleRemoveName = (name) => {
    setSelectedNames(selectedNames.filter((item) => item !== name));
  };

  const handleNextStep = () => {
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
            className={`step-wrapper ${
              index === activeStep ? "active-step" : ""
            } ${index < activeStep ? "completed-step" : ""}`}
            key={index}
          >
            <div className="circle">{index + 1}</div>
            <div className="label">{step}</div>
          </div>
        ))}
      </div>

      {activeStep === 0 && cutoverType && (
        <>
          <div className="cutover-type-container">
            <label htmlFor="cutoverType">Cutover Type</label>
            <select
              id="cutoverType"
              value={cutoverType}
              onChange={handleCutoverTypeChange}
            >
              <option value="">Select Type</option>
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
                    <div className="list-item" key={item.id}>
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
                      <div className="list-item" key={index}>
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
          </div>
        </>
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
