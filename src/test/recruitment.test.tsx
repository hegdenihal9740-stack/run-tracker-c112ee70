import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HRProvider } from '@/features/hr/store';
import { RecruitmentBoard } from '@/features/hr/recruitment';
import { EmployeesPage } from '@/features/hr/employees';
import { canConvert, blankCandidate, candidateEmployee } from '@/features/hr/recruitment-data';
import { useHR } from '@/features/hr/context';

vi.mock('@/integrations/supabase/client', () => ({supabase: {from: () => ({select: () => ({order: async () => ({data: [], error: null})})})}}));
afterEach(cleanup);
function StaffSummary() {
  const {sessionEmployees, candidates} = useHR();
  return <output aria-label="Converted staff">{JSON.stringify({staff: sessionEmployees, candidates})}</output>;
}
function renderBoard() {
  return render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><HRProvider><RecruitmentBoard/><StaffSummary/></HRProvider></QueryClientProvider>);
}
describe('Recruitment rules', () => {
  it('requires an accepted offer and positive salary before employee conversion', () => {
    const candidate = {...blankCandidate(1), stage: 'Offer' as const, salary: 60000};
    expect(canConvert(candidate)).toBe(false);
    expect(canConvert({...candidate, offer: 'Accepted'})).toBe(true);
    expect(canConvert({...candidate, offer: 'Accepted', salary: 0})).toBe(false);
    expect(canConvert({...candidate, offer: 'Accepted', stage: 'Interview'})).toBe(false);
  });
  it('does not allow converting an already linked employee twice', () => {
    expect(canConvert({...blankCandidate(1), stage: 'Offer', offer: 'Accepted', salary: 60000, employeeId: 'ats-existing'})).toBe(false);
  });
  it('maps candidate contact, agreed salary, role and department to employee records', () => {
    const candidate = {...blankCandidate(1), id: 'test', name:'Test Candidate', email:'test@example.com', phone:'123456789', salary: 60000};
    const employee = candidateEmployee(candidate, 'Software Engineer', 'IT', '2026-11-27');
    expect(employee).toMatchObject({id:'ats-test',code:'ATS-TEST', name:'Test Candidate',email:'test@example.com',phone:'123456789',basic_salary:60000,role:'Software Engineer',department:'IT',joining_date:'2026-11-27',status:'Active'});
  });
  it('adds a candidate, records feedback and converts the accepted offer into staff', async () => {
    const page = renderBoard();
    fireEvent.click(screen.getByRole('button',{name:'Add Candidate'}));
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Full name'), {target:{value:'Test Candidate'}});
    fireEvent.change(within(dialog).getByLabelText('Email'), {target:{value:'test@example.com'}});
    fireEvent.change(within(dialog).getByLabelText('Initial stage'), {target:{value:'Offer'}});
    fireEvent.click(within(dialog).getByRole('button',{name:'Add Candidate'}));
    const profile = await screen.findByRole('dialog');
    fireEvent.change(within(profile).getByLabelText('New note'), {target:{value:'Interview passed; offer accepted.'}});
    fireEvent.click(within(profile).getByRole('button',{name:'Add note'}));
    fireEvent.change(within(profile).getByLabelText('Agreed monthly basic salary (INR)'), {target:{value:'60000'}});
    fireEvent.change(within(profile).getByLabelText('Offer status'), {target:{value:'Accepted'}});
    fireEvent.click(within(profile).getByRole('button',{name:'Convert to Employee'}));
    expect(screen.getByLabelText('Converted staff')).toHaveTextContent('Interview passed; offer accepted.');
    expect(screen.getByLabelText('Converted staff')).toHaveTextContent('"basic_salary":60000');
    expect(screen.getByLabelText('Converted staff')).toHaveTextContent('"stage":"Hired"');
    page.rerender(<QueryClientProvider client={new QueryClient()}><HRProvider><EmployeesPage/></HRProvider></QueryClientProvider>);
    expect(await screen.findByText('Test Candidate')).toBeInTheDocument();
  });
  it('requires a rejection reason when updating a batch', () => {
    renderBoard();
    fireEvent.click(screen.getByRole('button',{name:'List view'}));
    fireEvent.click(screen.getByLabelText('Select Ananya Rao'));
    fireEvent.change(screen.getByLabelText('Batch stage'), {target:{value:'Rejected'}});
    expect(screen.getByRole('button',{name:'Update stage'})).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Batch rejection reason'), {target:{value:'Role requirements not met'}});
    fireEvent.click(screen.getByRole('button',{name:'Update stage'}));
    expect(screen.getByLabelText('Converted staff')).toHaveTextContent('Role requirements not met');
  });
});
