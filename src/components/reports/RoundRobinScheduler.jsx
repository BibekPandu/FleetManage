import React, { useState, useEffect, useMemo } from "react";
import { useVehicles } from "../../context/VehiclesContext";
import { useStaff } from "../../context/StaffContext";
import { useSchedules } from "../../context/SchedulesContext";
import "./RoundRobinScheduler.css";

const RoundRobinScheduler = () => {
  const { vehicles } = useVehicles();
  const { staff } = useStaff();
  const { schedules, fetchSchedules } = useSchedules();
  const [fetchedSchedules, setFetchedSchedules] = useState([]);
  const [vehicleSchedule, setVehicleSchedule] = useState([]);
  const [staffSchedule, setStaffSchedule] = useState([]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [currentStaffIndex, setCurrentStaffIndex] = useState(0);
  const [scheduleDate, setScheduleDate] = useState("");
  const [numDays, setNumDays] = useState(7);
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [defaultTask, setDefaultTask] = useState("Regular Duty Assignment");
  // No saving from Reports

  // Initialize schedule date to today
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    setScheduleDate(dateString);
  }, []);

  // Ensure latest schedules are loaded when Reports opens
  useEffect(() => {
    fetchSchedules && fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Reports: schedules loaded:", Array.isArray(schedules) ? schedules.length : 0);
    }
  }, [schedules]);

  // Fallback: directly fetch schedules if context has none
  useEffect(() => {
    const run = async () => {
      try {
        if (Array.isArray(schedules) && schedules.length > 0) {
          setFetchedSchedules([]);
          return;
        }
        const token = localStorage.getItem('fleetfox_token');
        if (!token) return;
        const base = process.env.REACT_APP_API_BASE_URL || '/api';
        const resp = await fetch(`${base}/schedules`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!resp.ok) return;
        const data = await resp.json();
        if (Array.isArray(data.schedules)) setFetchedSchedules(data.schedules);
      } catch (_) {}
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

  // Helper function to get today's date string
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Persisted schedules from backend (display all, sorted by date)
  const persistedServicing = useMemo(() => {
    const source = Array.isArray(schedules) && schedules.length > 0 ? schedules : fetchedSchedules;
    if (!Array.isArray(source)) return [];
    const list = [...source];
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
    return list;
  }, [schedules, fetchedSchedules]);

  // Helper function to safely create dates
  const createSafeDate = (dateString) => {
    if (!dateString || dateString === "") {
      dateString = getTodayString();
    }

    try {
      // Create date from YYYY-MM-DD format
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date;
    } catch (error) {
      console.error("Invalid date:", dateString, error);
      return new Date(); // Fallback to today
    }
  };

  // Helper function to format date safely
  const formatDateSafely = (date) => {
    try {
      if (!date || isNaN(date.getTime())) {
        return getTodayString();
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return getTodayString();
    }
  };

  // Round-robin algorithm for vehicle servicing
  const generateVehicleSchedule = () => {
    if (vehicles.length === 0) return [];

    const activeVehicles = vehicles.filter((v) => v.status === "active");
    if (activeVehicles.length === 0) return [];

    const schedule = [];
    const startDate = createSafeDate(scheduleDate);

    // Generate servicing schedule at 3-month intervals (next 4 occurrences)
    const occurrences = 4;
    for (let i = 0; i < occurrences; i++) {
      try {
        const currentDate = new Date(startDate);
        // Add i * 3 months to the start date
        currentDate.setMonth(startDate.getMonth() + i * 3);

        // Validate the date
        if (isNaN(currentDate.getTime())) {
          console.error("Invalid date generated for occurrence:", i);
          continue;
        }

        const vehicleIndex =
          (currentVehicleIndex + i) % activeVehicles.length;
        const vehicle = activeVehicles[vehicleIndex];

        schedule.push({
          date: formatDateSafely(currentDate),
          vehicle: vehicle.vehicle_number || vehicle.license_plate || "Unknown",
          make: vehicle.make || "Unknown",
          model: vehicle.model || "Unknown",
          task: "Regular Maintenance Service",
          type: "servicing",
        });
      } catch (error) {
        console.error("Error generating vehicle schedule for occurrence:", i, error);
        continue;
      }
    }

    return schedule;
  };

  // Round-robin algorithm for staff scheduling
  const generateStaffSchedule = () => {
    if (staff.length === 0) return [];

    const activeStaff = staff.filter((s) => s.status === "active");
    if (activeStaff.length === 0) return [];

    const schedule = [];
    const startDate = createSafeDate(scheduleDate);

    // Generate schedule for requested days
    for (let day = 0; day < Math.max(1, Number(numDays) || 0); day++) {
      try {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);

        // Validate the date
        if (isNaN(currentDate.getTime())) {
          console.error("Invalid date generated for day:", day);
          continue;
        }

        // Skip weekends when opted out
        if (
          !includeWeekends &&
          (currentDate.getDay() === 0 || currentDate.getDay() === 6)
        )
          continue;

        const staffIndex = (currentStaffIndex + day) % activeStaff.length;
        const staffMember = activeStaff[staffIndex];

        schedule.push({
          date: formatDateSafely(currentDate),
          staff: staffMember.username || staffMember.name || "Unknown",
          role: staffMember.role || "Unknown",
          task: defaultTask,
          type: "duty",
        });
      } catch (error) {
        console.error("Error generating staff schedule for day:", day, error);
        continue;
      }
    }

    return schedule;
  };

  // Update schedules when vehicles, staff, or date changes
  useEffect(() => {
    if (scheduleDate) {
      setVehicleSchedule(generateVehicleSchedule());
    }
  }, [vehicles, currentVehicleIndex, scheduleDate, numDays, includeWeekends]);

  useEffect(() => {
    if (scheduleDate) {
      setStaffSchedule(generateStaffSchedule());
    }
  }, [
    staff,
    currentStaffIndex,
    scheduleDate,
    numDays,
    includeWeekends,
    defaultTask,
  ]);

  const formatDate = (value) => {
    try {
      if (!value) return "Invalid Date";
      let date;
      if (value instanceof Date) {
        date = value;
      } else if (typeof value === "string") {
        // Handle pure YYYY-MM-DD safely in local time
        const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) {
          const [_, y, mo, d] = m;
          date = new Date(Number(y), Number(mo) - 1, Number(d));
        } else {
          // Fallback to native parser for full ISO strings
          date = new Date(value);
        }
      } else {
        return "Invalid Date";
      }

      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date for display:", e);
      return "Invalid Date";
    }
  };

  const getNextVehicle = () => {
    setCurrentVehicleIndex((prev) => (prev + 1) % Math.max(vehicles.length, 1));
  };

  const getNextStaff = () => {
    setCurrentStaffIndex((prev) => (prev + 1) % Math.max(staff.length, 1));
  };

  const resetSchedules = () => {
    setCurrentVehicleIndex(0);
    setCurrentStaffIndex(0);
  };

  const buildAssignments = () => {
    // Pair by date; only include dates present in both lists
    const byDateVehicle = vehicleSchedule.reduce((acc, item) => {
      acc[item.date] = item;
      return acc;
    }, {});
    const byDateStaff = staffSchedule.reduce((acc, item) => {
      acc[item.date] = item;
      return acc;
    }, {});
    const allDates = Object.keys(byDateVehicle).filter((d) => byDateStaff[d]);
    allDates.sort();
    return allDates.map((date) => {
      const v = byDateVehicle[date];
      const s = byDateStaff[date];
      return {
        date,
        vehicle: v.vehicle,
        driver: s.staff,
        task: defaultTask,
        status: "scheduled",
      };
    });
  };

  const assignments = useMemo(
    () => buildAssignments(),
    [vehicleSchedule, staffSchedule, defaultTask]
  );

  // Removed saveAssignments functionality

  return (
    <div className="round-robin-scheduler">
      <div className="scheduler-header">
        <div>
          <h2>Round Robin Scheduler</h2>
          <p className="scheduler-subtitle">
            Assign vehicles and drivers evenly over a date range.
          </p>
        </div>
        <div className="scheduler-controls">
          <div className="control-group">
            <label>Start Date</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Days</label>
            <input
              type="number"
              min="1"
              max="60"
              value={numDays}
              onChange={(e) => setNumDays(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Include Weekends</label>
            <input
              type="checkbox"
              checked={includeWeekends}
              onChange={(e) => setIncludeWeekends(e.target.checked)}
            />
          </div>
          <div className="control-group">
            <label>Task</label>
            <select
              value={defaultTask}
              onChange={(e) => setDefaultTask(e.target.value)}
            >
              <option value="Regular Duty Assignment">
                Regular Duty Assignment
              </option>
              <option value="Route Coverage">Route Coverage</option>
              <option value="Maintenance Support">Maintenance Support</option>
            </select>
          </div>
          <div className="control-buttons">
            <button onClick={getNextVehicle} className="control-btn">
              Next Vehicle
            </button>
            <button onClick={getNextStaff} className="control-btn">
              Next Staff
            </button>
            <button onClick={resetSchedules} className="control-btn reset">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="scheduler-grid">
        {/* Vehicle Servicing Schedule */}
        <div className="schedule-section">
          <div className="section-header">
            <h3>🚗 Vehicle Servicing Schedule</h3>
            <span className="current-index">
              Current:{" "}
              {vehicles[currentVehicleIndex]?.vehicle_number ||
                vehicles[currentVehicleIndex]?.license_plate ||
                "None"}
            </span>
          </div>
          <div className="schedule-list">
            {persistedServicing.slice(0, 10).map((s) => (
              <div key={s.id} className="schedule-item vehicle">
                <div className="schedule-date">{formatDate(s.date)}</div>
                <div className="schedule-details">
                  <div className="schedule-vehicle">{s.vehicle}</div>
                  <div className="schedule-task">{s.task}</div>
                  <div className="schedule-info">{s.driver}</div>
                  <div className="schedule-info">{s.status?.replace("_", " ")}</div>
                </div>
              </div>
            ))}
            {persistedServicing.length === 0 && (
              <div className="no-data">No servicing schedules found</div>
            )}
          </div>
        </div>

        {/* Staff Duty Schedule */}
        <div className="schedule-section">
          <div className="section-header">
            <h3>👥 Staff Duty Schedule</h3>
            <span className="current-index">
              Current:{" "}
              {staff[currentStaffIndex]?.username ||
                staff[currentStaffIndex]?.name ||
                "None"}
            </span>
          </div>
          <div className="schedule-list">
            {staffSchedule.slice(0, 10).map((item, index) => (
              <div key={index} className="schedule-item staff">
                <div className="schedule-date">{formatDate(item.date)}</div>
                <div className="schedule-details">
                  <div className="schedule-staff">{item.staff}</div>
                  <div className="schedule-task">{item.task}</div>
                  <div className="schedule-info">{item.role}</div>
                </div>
              </div>
            ))}
            {staffSchedule.length === 0 && (
              <div className="no-data">No staff available for scheduling</div>
            )}
          </div>
        </div>
      </div>
      {/* Combined preview */}
      <div className="combined-preview">
        <div className="section-header">
          <h3>🧩 Combined Assignments Preview</h3>
          <span className="current-index">{assignments.length} items</span>
        </div>
        <div className="schedule-list">
          {assignments.slice(0, 12).map((a, idx) => (
            <div key={idx} className="schedule-item combined">
              <div className="schedule-date">{formatDate(a.date)}</div>
              <div className="schedule-details">
                <div className="schedule-vehicle">{a.vehicle}</div>
                <div className="schedule-staff">{a.driver}</div>
                <div className="schedule-task">{a.task}</div>
              </div>
            </div>
          ))}
          {assignments.length === 0 && (
            <div className="no-data">No paired assignments to preview</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundRobinScheduler;
