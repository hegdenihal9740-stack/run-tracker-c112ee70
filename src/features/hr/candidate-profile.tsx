import { useState, type FormEvent } from 'react';
import { UserPlus, MessageSquarePlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useHR } from './context';
import { canConvert, type Candidate, type Stage, stages } from './recruitment-data';

export function CandidateProfile({ candidate, onClose, onHire }: { candidate: Candidate; onClose: () => void; onHire: (candidate: Candidate) => void }) {
  const { jobs, setCandidates } = useHR();
  const [draft, setDraft] = useState(candidate);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const update = <K extends keyof Candidate>(key: K, value: Candidate[K]) => setDraft(old => ({ ...old, [key]: value }));
  function save(event: FormEvent) {
    event.preventDefault();
    if (draft.stage === 'Rejected' && !draft.rejection.trim()) { setError('Add a rejection reason.'); return; }
    setCandidates(old => old.map(c => c.id === draft.id ? draft : c));
    onClose();
  }
  function addNote() {
    if (!note.trim()) return;
    const next = { ...draft, notes: [...draft.notes, { id: crypto.randomUUID(), text: note.trim(), at: new Date().toISOString() }] };
    setDraft(next);
    setCandidates(old => old.map(c => c.id === next.id ? { ...c, notes: next.notes } : c));
    setNote('');
  }
  return <Sheet open onOpenChange={open => { if (!open) onClose(); }}><SheetContent className="ats-drawer">
    <SheetHeader><SheetTitle>{candidate.name}</SheetTitle><SheetDescription>{jobs.find(j => j.id === candidate.jobId)?.title} · Applied {candidate.applied}</SheetDescription></SheetHeader>
    <form onSubmit={save} className="ats-profile-form">
      <h3>Candidate details</h3><div className="hr-form-grid">
        {(['name', 'email', 'phone', 'portfolio'] as const).map(key => <div className="hr-field" key={key}><label htmlFor={`candidate-${key}`}>{({name:'Full name',email:'Email',phone:'Phone',portfolio:'Portfolio / LinkedIn URL'})[key]}</label><input id={`candidate-${key}`} type={key === 'email' ? 'email' : key === 'portfolio' ? 'url' : 'text'} required={key === 'name' || key === 'email'} value={draft[key]} onChange={e => update(key, e.target.value)} /></div>)}
        <div className="hr-field"><label htmlFor="candidate-job">Job opening</label><select id="candidate-job" disabled={!!draft.employeeId} value={draft.jobId} onChange={e => update('jobId', Number(e.target.value))}>{jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select></div>
        <div className="hr-field"><label htmlFor="candidate-stage">Stage</label><select id="candidate-stage" disabled={!!draft.employeeId} value={draft.stage} onChange={e => update('stage', e.target.value as Stage)}>{stages.filter(s => s !== 'Hired' || draft.employeeId).map(s => <option key={s}>{s}</option>)}</select></div>
        {(['experience', 'notice', 'salary'] as const).map(key => <div className="hr-field" key={key}><label htmlFor={`candidate-${key}`}>{({experience:'Experience (years)',notice:'Notice period (days)',salary:'Agreed monthly basic salary (INR)'})[key]}</label><input id={`candidate-${key}`} type="number" min="0" step={key === 'experience' ? '0.5' : '1'} disabled={!!draft.employeeId && key === 'salary'} value={draft[key]} onChange={e => update(key, Number(e.target.value))} /></div>)}
        <div className="hr-field"><label htmlFor="candidate-offer">Offer status</label><select id="candidate-offer" disabled={!!draft.employeeId} value={draft.offer} onChange={e => update('offer', e.target.value as Candidate['offer'])}>{['Pending','Sent','Accepted'].map(s => <option key={s}>{s}</option>)}</select></div>
      </div>
      <h3>Interview</h3><div className="hr-form-grid"><div className="hr-field"><label htmlFor="interview-date">Interview date & time</label><input id="interview-date" type="datetime-local" value={draft.interview} onChange={e => update('interview', e.target.value)} /></div><div className="hr-field"><label htmlFor="interviewer">Interviewer</label><input id="interviewer" value={draft.interviewer} onChange={e => update('interviewer', e.target.value)} /></div></div>
      <h3>Scorecard</h3><div className="ats-scorecard">{(['technical','communication','culture'] as const).map(key => <div className="hr-field" key={key}><label htmlFor={`rating-${key}`}>{({technical:'Technical',communication:'Communication',culture:'Culture fit'})[key]}</label><select id={`rating-${key}`} value={draft.ratings[key]} onChange={e => update('ratings', {...draft.ratings, [key]: Number(e.target.value)})}><option value="0">Not rated</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></div>)}</div>
      {draft.stage === 'Rejected' && <div className="hr-field"><label htmlFor="rejection">Rejection reason</label><textarea id="rejection" required value={draft.rejection} onChange={e => update('rejection', e.target.value)} /></div>}
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <div className="hr-actions"><Button type="submit"><Save size={16}/> Save changes</Button>{canConvert(draft) && <Button type="button" variant="outline" onClick={() => { onHire(draft); onClose(); }}><UserPlus size={16}/> Convert to Employee</Button>}</div>
      {draft.employeeId && <p className="text-sm text-muted-foreground mt-4">Employee ID: ATS-{draft.id.toUpperCase()}</p>}
    </form>
    <section className="ats-notes"><h3>Interview notes</h3>{draft.notes.map(n => <div className="ats-note" key={n.id}><time>{new Date(n.at).toLocaleString('en-GB')}</time><p>{n.text}</p></div>)}{draft.notes.length === 0 && <p className="text-sm text-muted-foreground">No interview notes yet.</p>}<div className="hr-field"><label htmlFor="interview-note">New note</label><textarea id="interview-note" value={note} onChange={e => setNote(e.target.value)} /></div><Button type="button" variant="outline" disabled={!note.trim()} onClick={addNote}><MessageSquarePlus size={16}/> Add note</Button></section>
  </SheetContent></Sheet>;
}
