import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import React, { useState } from "react";
import { addDays, isValid } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { createEvent } from "../../data/getData";

export default function CreateEventElem({ hideCreateEvent, groupId, creator }) {
  const [date, setDate] = useState(addDays(new Date(), 1));
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("10:00");

  const handleDateChange = (selectedDate) => {
    // Check if the selected date is valid, if not, set it to tomorrow
    if (isValid(selectedDate)) {
      setDate(selectedDate);
    } else {
      setDate(addDays(new Date(), 1));
    }
  };

  async function handleSubmit() {
    console.log("firstTime: ", time)
    const timeParts = time.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    console.log("hours: ", hours, " minutes: ", minutes)
    // Set the hours and minutes of the date object
    date.setUTCHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0)
    let newDate = date.toISOString().slice(0, 19).replace('T', ' ');
    console.log(title, desc, newDate, groupId, creator);
    await createEvent(title, desc, newDate, groupId, creator);
    hideCreateEvent();
  }

  return (
    <div>
      <div className="overlay" onClick={() => hideCreateEvent()}></div>
      <div id="create-event-container">
        <div>
          <div
            style={{
              position: "absolute",
              left: -10,
              top: 30,
              width: 500,
              backgroundColor: "rgb(188, 216, 250)",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3
              style={{
                textAlign: "center",
              }}
            >
              Create Event
            </h3>
          </div>
          <div
            style={{
              margin: "20px",
              position: "absolute",
              top: 80,
            }}
          >
            <label
              htmlFor="event-header"
              style={{
                marginRight: "10px",
              }}
            >
              Set a title:
            </label>
            <input
              type="text"
              id="event-header"
              maxLength={34}
              style={{
                width: "200px",
              }}
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div
            style={{
              margin: "20px",
            }}
          >
            <label
              htmlFor="event-description"
              style={{
                position: "absolute",
                left: 180,
                top: 150,
              }}
            >
              Add a description:
            </label>
            <textarea
              type="text"
              id="event-description"
              maxLength={300}
              style={{
                position: "absolute",
                left: 50,
                top: 200,
                width: 400,
                maxWidth: 400,
                minWidth: 400,
                maxHeight: 100,
                height: 100,
                resize: "none",
              }}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>
          <div
            style={{
              position: "absolute",
              top: 350,
            }}
          >
            <label
              style={{
                marginRight: "10px",
              }}
              htmlFor="d-p"
            >
              Set a date:
            </label>
            <DatePicker
              id="d-p"
              selected={date}
              onChange={handleDateChange} // Use the handleDateChange function
              dateFormat="dd/MM/yyyy" // Customize date format if needed
              minDate={addDays(new Date(), 1)} // Minimum date is tomorrow
            />
            <div style={{ position: "absolute", left: 89, top: 30 }}>
              <TimePicker
                onChange={(t) => {
                  if (t == null) {
                    setTime("10:00");
                  } else {
                    setTime(t);
                  }
                }}
                value={time}
              />
            </div>
          </div>
          <button
            id="add-event-container-button"
            style={{
              position: "absolute",
              left: 180,
              top: 450,
            }}
            onClick={() => handleSubmit()}
          >
            Add event
          </button>
        </div>
      </div>
    </div>
  );
}
