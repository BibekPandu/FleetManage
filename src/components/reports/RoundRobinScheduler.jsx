import React, { useState, useEffect } from "react";
import { useVehicles } from "../../context/VehiclesContext";
import { useStaff } from "../../context/StaffContext";
import "./RoundRobinScheduler.css";

const RoundRobinScheduler = () => {
  const { vehicles } = useVehicles();
  const { staff } = useStaff();
  const [vehicleSchedule, setVehicleSchedule] = useState([]);
  const [staffSchedule, setStaffSchedule] = useState([]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [currentStaffIndex, setCurrentStaffIndex] = useState(0);
  const [scheduleDate, setScheduleDate] = useState("");

  // Initialize schedule date to today
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    setScheduleDate(dateString);
  }, []);

  // Helper function to get today's date string
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

    // Generate schedule for next 30 days
    for (let day = 0; day < 30; day++) {
      try {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);

        // Validate the date
        if (isNaN(currentDate.getTime())) {
          console.error("Invalid date generated for day:", day);
          continue;
        }

        // Skip weekends (Saturday = 6, Sunday = 0)
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

        const vehicleIndex =
          (currentVehicleIndex + day) % activeVehicles.length;
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
        console.error("Error generating vehicle schedule for day:", day, error);
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

    // Generate schedule for next 30 days
    for (let day = 0; day < 30; day++) {
      try {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);

        // Validate the date
        if (isNaN(currentDate.getTime())) {
          console.error("Invalid date generated for day:", day);
          continue;
        }

        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

        const staffIndex = (currentStaffIndex + day) % activeStaff.length;
        const staffMember = activeStaff[staffIndex];

        schedule.push({
          date: formatDateSafely(currentDate),
          staff: staffMember.username || staffMember.name || "Unknown",
          role: staffMember.role || "Unknown",
          task: "Regular Duty Assignment",
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
  }, [vehicles, currentVehicleIndex, scheduleDate]);

  useEffect(() => {
    if (scheduleDate) {
      setStaffSchedule(generateStaffSchedule());
    }
  }, [staff, currentStaffIndex, scheduleDate]);

  const formatDate = (dateString) => {
    try {
      if (!dateString || dateString === "Invalid Date") {
        return "Invalid Date";
      }

      // Parse YYYY-MM-DD format
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date for display:", error);
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

  return (
    <div className="round-robin-scheduler">
      <div className="scheduler-header">
        <h2>Scheduling</h2>
        <div className="scheduler-controls">
          <div className="control-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
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
            {vehicleSchedule.slice(0, 10).map((item, index) => (
              <div key={index} className="schedule-item vehicle">
                <div className="schedule-date">{formatDate(item.date)}</div>
                <div className="schedule-details">
                  <div className="schedule-vehicle">{item.vehicle}</div>
                  <div className="schedule-task">{item.task}</div>
                  <div className="schedule-info">
                    {item.make} {item.model}
                  </div>
                </div>
              </div>
            ))}
            {vehicleSchedule.length === 0 && (
              <div className="no-data">
                No vehicles available for scheduling
              </div>
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
    </div>
  );
};

export default RoundRobinScheduler;
