-- Run this in Supabase SQL editor
create extension if not exists "pgcrypto";

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text CHECK (role IN ('operario', 'administrativo')) NOT NULL,
  project_id uuid NULL REFERENCES projects(id),
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  employee_id uuid REFERENCES employees(id),
  meal_type text CHECK (meal_type IN ('cafe', 'almoco')) NOT NULL,
  present boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for performance when scaling to hundreds/thousands
CREATE INDEX idx_attendance_date ON attendance (date);
CREATE INDEX idx_attendance_employee ON attendance (employee_id);
