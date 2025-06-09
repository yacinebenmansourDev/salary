# Salary Adjustment Tool

This is a React-based tool that helps calculate the adjusted monthly salary of a worker based on:

- Their monthly salary
- The number of working days
- Required working hours per day
- Actual clock-in and clock-out times for each day

It automatically calculates penalties for missing work hours or full days and bonuses for overtime.

## 🧮 Features

- Input monthly salary, working days, and required hours per day.
- For each day:
  - Mark if the worker worked that day.
  - Enter start and end times for the day (if worked).
- Calculates:
  - Total missing minutes (lateness or absence)
  - Total overtime minutes
  - Penalty and bonus based on salary per minute
  - Adjusted salary
- Reset button to clear all inputs

## 📸 Example

If a worker starts at 08:30 and ends at 16:30 for 8 required hours:

- It's considered a full day (no penalty).
  If a worker works only 6 hours:
- The difference (2 hours) is subtracted from the salary.
  If the worker works 10 hours:
- The extra 2 hours are added as a bonus.

If the worker does **not work at all**:

- A full 8-hour penalty is applied.
