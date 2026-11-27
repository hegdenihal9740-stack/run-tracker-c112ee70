import type { Employee } from './db';

export const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'] as const;
export type Stage = (typeof stages)[number];
export type Candidate = {
  id: string; name: string; email: string; phone: string; jobId: number;
  experience: number; notice: number; portfolio: string; stage: Stage;
  applied: string; interview: string; interviewer: string; salary: number;
  offer: 'Pending' | 'Sent' | 'Accepted'; rejection: string;
  ratings: { technical: number; communication: number; culture: number };
  notes: { id: string; text: string; at: string }[]; employeeId: string | null;
};
export function blankCandidate(jobId: number): Candidate {
  return { id: '', name: '', email: '', phone: '', jobId, experience: 0, notice: 0,
    portfolio: '', stage: 'Applied', applied: '', interview: '', interviewer: '', salary: 0,
    offer: 'Pending', rejection: '', ratings: { technical: 0, communication: 0, culture: 0 }, notes: [], employeeId: null };
}
export const initialCandidates: Candidate[] = [
  ['c1', 'Ananya Rao', 1, 'Applied', 3], ['c2', 'Karan Shah', 2, 'Applied', 5],
  ['c3', 'Meera Nair', 1, 'Screening', 4], ['c4', 'Arjun Patel', 2, 'Interview', 6],
  ['c5', 'Priya Desai', 1, 'Interview', 3], ['c6', 'Rohan Kapoor', 1, 'Offer', 5],
  ['c7', 'Neha Joshi', 2, 'Hired', 7], ['c8', 'Vikram Singh', 1, 'Rejected', 2],
].map(([id, name, jobId, stage, experience]) => ({
  ...blankCandidate(Number(jobId)), id: String(id), name: String(name), stage: stage as Stage,
  experience: Number(experience), email: `${String(name).toLowerCase().replace(' ', '.')}@example.com`,
  applied: '2026-11-20', salary: 60000, notice: 30,
  offer: stage === 'Offer' || stage === 'Hired' ? 'Accepted' : 'Pending',
  employeeId: stage === 'Hired' ? 'ats-c7' : null,
  rejection: stage === 'Rejected' ? 'Experience does not match this opening.' : '',
  notes: stage === 'Interview' ? [{ id: 'n1', text: 'Screening completed. Strong communication; assess role-specific skills next.', at: '2026-11-23T10:00:00Z' }] : [],
}));

export function candidateEmployee(candidate: Candidate, role: string, department: string, date: string): Employee {
  return { id: `ats-${candidate.id}`, code: `ATS-${candidate.id.toUpperCase()}`, name: candidate.name,
    email: candidate.email, phone: candidate.phone, department, role, manager: '', joining_date: date,
    basic_salary: candidate.salary, status: 'Active', created_by: null, created_at: `${date}T00:00:00Z` };
}
export function canConvert(candidate: Candidate) {
  return candidate.stage === 'Offer' && candidate.offer === 'Accepted' && candidate.salary > 0 && !candidate.employeeId;
}
