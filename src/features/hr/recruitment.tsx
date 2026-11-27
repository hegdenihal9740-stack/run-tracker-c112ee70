import { useState, type FormEvent } from 'react';
import { ArrowRight, Columns3, List, Plus, Search, Users, BriefcaseBusiness, MessageSquare, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useHR } from './context';
import { blankCandidate, stages, canConvert, candidateEmployee, type Candidate, type Stage } from './recruitment-data';
import { CandidateProfile } from './candidate-profile';

export function RecruitmentBoard() {
  const { candidates, setCandidates, jobs, sessionEmployees, setSessionEmployees } = useHR();
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [view, setView] = useState('board');
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState<Candidate | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [batchStage, setBatchStage] = useState<Stage>('Screening');
  const [batchReason, setBatchReason] = useState('');
  const shown = candidates.filter(c => (jobFilter === 'All' || c.jobId === Number(jobFilter)) && `${c.name} ${c.email} ${jobs.find(j => j.id === c.jobId)?.title ?? ''}`.toLowerCase().includes(search.toLowerCase()));
  const active = candidates.filter(c => !['Hired', 'Rejected'].includes(c.stage));
  const profile = candidates.find(c => c.id === selected);
  const openJobs = jobs.filter(j => j.status !== 'Closed');
  function hire(candidate: Candidate) {
    if (!canConvert(candidate) || sessionEmployees.some(e => e.id === `ats-${candidate.id}`)) return;
    const job = jobs.find(j => j.id === candidate.jobId);
    if (!job) return;
    const employee = candidateEmployee(candidate, job.title, job.department, new Date().toISOString().slice(0,10));
    setSessionEmployees(old => old.some(e => e.id === employee.id) ? old : [...old, employee]);
    setCandidates(old => old.map(c => c.id === candidate.id ? { ...candidate, stage: 'Hired', employeeId: employee.id } : c));
    toast.success(`${candidate.name} added to Employees for this session.`);
  }
  function move(candidate: Candidate) {
    const next = stages[stages.indexOf(candidate.stage) + 1];
    if (!next || next === 'Hired' || next === 'Rejected' || candidate.employeeId) return;
    setCandidates(old => old.map(c => c.id === candidate.id ? { ...c, stage: next } : c));
  }
  function add(event: FormEvent) {
    event.preventDefault();
    if (!creating || !creating.name.trim() || !creating.email.trim() || !openJobs.some(j => j.id === creating.jobId)) return;
    const candidate = { ...creating, name: creating.name.trim(), id: crypto.randomUUID(), applied: new Date().toISOString().slice(0,10) };
    setCandidates(old => [...old, candidate]); setCreating(null); setSelected(candidate.id);
  }
  function applyBatch() {
    if (batchStage === 'Rejected' && !batchReason.trim()) return;
    const ids = shown.filter(c => checked.includes(c.id) && !c.employeeId).map(c => c.id);
    setCandidates(old => old.map(c => ids.includes(c.id) ? { ...c, stage: batchStage, rejection: batchStage === 'Rejected' ? batchReason.trim() : c.rejection } : c));
    setChecked([]); setBatchReason('');
  }
  const card = (candidate: Candidate) => <article className="ats-card" key={candidate.id}>
    <Button variant="ghost" className="ats-card-open" onClick={() => setSelected(candidate.id)} aria-label={`Open ${candidate.name}`}>
      <span className="ats-avatar" aria-hidden="true">{candidate.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
      <span className="ats-person"><strong>{candidate.name}</strong><span>{jobs.find(j => j.id === candidate.jobId)?.title ?? 'Unassigned'}</span></span>
    </Button>
    <div className="ats-card-meta"><span>{candidate.experience} years experience</span><span title="Interview notes"><MessageSquare size={12}/>{candidate.notes.length}</span></div>
    {candidate.interview && <p className="ats-card-date">Interview · {candidate.interview.replace('T',' · ')}</p>}
    <div className="ats-card-footer"><span>{jobs.find(j => j.id === candidate.jobId)?.department}</span>
      {['Applied','Screening','Interview'].includes(candidate.stage) && <Button size="icon" variant="ghost" title={`Move ${candidate.name} to ${stages[stages.indexOf(candidate.stage)+1]}`} aria-label={`Advance ${candidate.name}`} onClick={() => move(candidate)}><ArrowRight size={16}/></Button>}
      {canConvert(candidate) && <Button size="icon" variant="ghost" title={`Hire ${candidate.name}`} aria-label={`Hire ${candidate.name}`} onClick={() => hire(candidate)}><UserPlus size={16}/></Button>}
      {candidate.stage === 'Hired' && <span className="hr-status">Employee</span>}
    </div>
  </article>;
  return <section>
    <div className="ats-heading"><div><span className="ats-eyebrow">TALENT ACQUISITION</span><h2>Recruitment pipeline</h2></div><Button disabled={openJobs.length === 0} onClick={() => setCreating(blankCandidate(openJobs[0]?.id ?? 1))}><Plus size={16}/> Add Candidate</Button></div>
    <div className="ats-metrics"><div><BriefcaseBusiness size={18}/><strong>{openJobs.length}</strong><span>Open positions</span></div><div><Users size={18}/><strong>{active.length}</strong><span>Active candidates</span></div><div><MessageSquare size={18}/><strong>{candidates.filter(c => c.stage === 'Interview').length}</strong><span>In interview</span></div><div><UserPlus size={18}/><strong>{candidates.filter(c => c.stage === 'Hired').length}</strong><span>Hired</span></div></div>
    <div className="hr-filters ats-controls"><div className="hr-search"><Search size={16}/><input aria-label="Search candidates" placeholder="Search candidates…" value={search} onChange={e => setSearch(e.target.value)}/></div><select aria-label="Filter job opening" value={jobFilter} onChange={e => { setJobFilter(e.target.value); setChecked([]); }}><option value="All">All job openings</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select><div className="ats-view-switch" role="group" aria-label="Candidate view"><Button variant={view === 'board' ? 'secondary' : 'ghost'} size="icon" title="Board view" aria-label="Board view" aria-pressed={view === 'board'} onClick={() => setView('board')}><Columns3 size={16}/></Button><Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" title="List view" aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={16}/></Button></div></div>
    {view === 'board' ? <div className="ats-board" aria-label="Recruitment board">{stages.map(stage => <section key={stage} className={`ats-column ats-${stage.toLowerCase()}`} aria-label={`${stage} candidates`}><header><span className="ats-stage-dot"/><h3>{stage}</h3><span className="ats-count">{shown.filter(c => c.stage === stage).length}</span></header><div className="ats-column-body">{shown.filter(c => c.stage === stage).map(card)}{!shown.some(c => c.stage === stage) && <p className="ats-column-empty">No candidates</p>}</div></section>)}</div> : <>
      {checked.length > 0 && <div className="hr-filters ats-batch"><span>{checked.length} selected</span><select aria-label="Batch stage" value={batchStage} onChange={e => setBatchStage(e.target.value as Stage)}>{stages.filter(s => s !== 'Hired').map(s => <option key={s}>{s}</option>)}</select>{batchStage === 'Rejected' && <input className="ats-reason" aria-label="Batch rejection reason" placeholder="Rejection reason" value={batchReason} onChange={e => setBatchReason(e.target.value)}/>}<Button disabled={batchStage === 'Rejected' && !batchReason.trim()} onClick={applyBatch}>Update stage</Button></div>}
      <div className="hr-table-scroll"><table className="hr-table"><thead><tr><th><input type="checkbox" aria-label="Select all candidates" checked={shown.some(c => !c.employeeId) && shown.filter(c => !c.employeeId).every(c => checked.includes(c.id))} onChange={e => setChecked(e.target.checked ? shown.filter(c => !c.employeeId).map(c => c.id) : [])}/></th>{['Candidate','Job opening','Experience','Stage','Applied'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{shown.map(c => <tr key={c.id}><td><input type="checkbox" disabled={!!c.employeeId} aria-label={`Select ${c.name}`} checked={checked.includes(c.id)} onChange={e => setChecked(old => e.target.checked ? [...old,c.id] : old.filter(id => id !== c.id))}/></td><td><Button variant="link" className="ats-name-button" onClick={() => setSelected(c.id)}>{c.name}</Button><small className="block text-muted-foreground">{c.email}</small></td><td>{jobs.find(j => j.id === c.jobId)?.title}</td><td>{c.experience} years</td><td>{c.stage}</td><td>{c.applied}</td></tr>)}{shown.length === 0 && <tr><td colSpan={6} className="hr-empty">No matching candidates.</td></tr>}</tbody></table></div>
    </>}
    {profile && <CandidateProfile key={profile.id} candidate={profile} onClose={() => setSelected(null)} onHire={hire}/>}
    <Dialog open={!!creating} onOpenChange={open => { if (!open) setCreating(null); }}><DialogContent className="ats-create"><DialogHeader><DialogTitle>New candidate</DialogTitle><DialogDescription>Application details</DialogDescription></DialogHeader>{creating && <form onSubmit={add}><div className="hr-form-grid">{(['name','email','phone'] as const).map(key => <div className="hr-field" key={key}><label htmlFor={`new-${key}`}>{({name:'Full name',email:'Email',phone:'Phone'})[key]}</label><input id={`new-${key}`} required={key !== 'phone'} type={key === 'email' ? 'email' : 'text'} value={creating[key]} onChange={e => setCreating({...creating,[key]:e.target.value})}/></div>)}<div className="hr-field"><label htmlFor="new-job">Job opening</label><select id="new-job" value={creating.jobId} onChange={e => setCreating({...creating,jobId:Number(e.target.value)})}>{openJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select></div><div className="hr-field"><label htmlFor="new-experience">Experience (years)</label><input id="new-experience" type="number" min="0" step="0.5" value={creating.experience} onChange={e => setCreating({...creating,experience:Number(e.target.value)})}/></div><div className="hr-field"><label htmlFor="new-stage">Initial stage</label><select id="new-stage" value={creating.stage} onChange={e => setCreating({...creating,stage:e.target.value as Stage})}>{stages.filter(s => s !== 'Hired' && s !== 'Rejected').map(s => <option key={s}>{s}</option>)}</select></div></div><div className="hr-actions"><Button type="button" variant="outline" onClick={() => setCreating(null)}>Cancel</Button><Button type="submit">Add Candidate</Button></div></form>}</DialogContent></Dialog>
  </section>;
}
