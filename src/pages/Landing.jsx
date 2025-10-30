import React from "react";
import { Link } from "react-router-dom";
import "../styles/Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <section className="landing__hero">
        <div className="landing__hero-overlay" />
        <div className="landing__hero-content">
          <h1 className="landing__title">Smart Vehicle Management, Simplified</h1>
          <p className="landing__subtitle">Track, maintain, and optimize your fleet with real-time analytics.</p>
          <div className="landing__actions">
            <Link className="landing__button landing__button--primary" to="/auth">Get Started</Link>
            <a className="landing__button landing__button--ghost" href="#demo">View Dashboard Demo</a>
          </div>
        </div>
        <img
          className="landing__hero-image"
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600&auto=format&fit=crop"
          alt="Fleet vehicles in a parking lot"
          loading="eager"
        />
      </section>

      <section id="demo" className="landing__demo">
        <div className="landing__demo-inner">
          <img
            className="landing__demo-image"
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop"
            alt="Vehicles on the road"
            loading="lazy"
          />
        </div>
      </section>

      <section id="features" className="landing__features">
        <div className="landing__feature">
          <img
            className="landing__feature-icon"
            src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/outline/truck.svg"
            alt="Vehicles"
          />
          <h3>Real-Time Vehicle Tracking</h3>
          <p>Live status, routes, and utilization at a glance.</p>
        </div>
        <div className="landing__feature">
          <img
            className="landing__feature-icon"
            src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/outline/calendar-event.svg"
            alt="Maintenance"
          />
          <h3>Maintenance Scheduling</h3>
          <p>Automated reminders and logs keep vehicles road-ready.</p>
        </div>
        <div className="landing__feature">
          <img
            className="landing__feature-icon"
            src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/outline/calendar-stats.svg"
            alt="Analytics"
          />
          <h3>Fuel Management & Analytics</h3>
          <p>Predict consumption and reduce costs with data-driven insights.</p>
        </div>
        <div className="landing__feature">
          <img
            className="landing__feature-icon"
            src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/outline/id.svg"
            alt="Drivers"
          />
          <h3>Driver & Fleet Management</h3>
          <p>Assign trips, enforce policies, and audit activity securely.</p>
        </div>
        <div className="landing__feature">
          <img
            className="landing__feature-icon"
            src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/outline/report-analytics.svg"
            alt="Reports"
          />
          <h3>Automated Reports</h3>
          <p>Share weekly KPIs and compliance reports with one click.</p>
        </div>
        <div className="landing__feature">
          <img
            className="landing__feature-icon"
            src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/outline/shield-lock.svg"
            alt="Security"
          />
          <h3>Secure & Cloud-Based</h3>
          <p>Role-based access, JWT auth, and reliable uptime.</p>
        </div>
      </section>

      {/* Stats section removed per request */}

      <section className="landing__cta-wide">
        <h2>Ready to modernize your fleet?</h2>
        <p>Start now and experience streamlined operations from day one.</p>
        <div className="landing__actions">
          <Link className="landing__button landing__button--primary" to="/auth">Get Started</Link>
          <a className="landing__button landing__button--ghost" href="#demo">View Dashboard Demo</a>
        </div>
      </section>

      <footer className="landing__footer">© {new Date().getFullYear()} FleetFox. All rights reserved.</footer>
    </div>
  );
}


