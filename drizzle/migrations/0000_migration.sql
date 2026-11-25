CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL DEFAULT '',
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  manager text NOT NULL DEFAULT '',
  joining_date date,
  basic_salary numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in staff manage employees" ON public.employees FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type text NOT NULL DEFAULT 'Casual',
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_requests TO authenticated;
GRANT ALL ON public.leave_requests TO service_role;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in staff manage leave" ON public.leave_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.payroll_sheets (
  month text PRIMARY KEY,
  rows jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_sheets TO authenticated;
GRANT ALL ON public.payroll_sheets TO service_role;
ALTER TABLE public.payroll_sheets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in staff manage payroll" ON public.payroll_sheets FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.employees (code, name, email, department, role, joining_date, basic_salary) VALUES
('EMP001','John Doe','john@example.com','IT','Software Engineer','2023-04-01',45000),
('EMP002','Jane Smith','jane@example.com','Marketing','Marketing Manager','2022-08-15',52000),
('EMP003','Bob Johnson','bob@example.com','Finance','Accountant','2024-01-10',38000);