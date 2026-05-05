import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Sequence {
  id: number;
  name: string;
  trigger: string;
  active: number | boolean;
  step_count?: number;
  enrollment_count?: number;
  created_at: string;
  steps?: Step[];
}

interface Step {
  id: number;
  sequence_id: number;
  subject: string;
  body_html: string;
  delay_hours: number;
  step_order: number;
}

const triggers = ['contact_form', 'intake_submitted', 'lead_qualified', 'manual'];

export default function EmailSequences() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [stepsById, setStepsById] = useState<Record<number, Step[]>>({});
  const [loadingSteps, setLoadingSteps] = useState<number | null>(null);

  // Create sequence form
  const [showCreate, setShowCreate] = useState(false);
  const [seqName, setSeqName] = useState('');
  const [seqTrigger, setSeqTrigger] = useState('contact_form');
  const [savingSeq, setSavingSeq] = useState(false);

  // Add step form (per sequence)
  const [stepFormFor, setStepFormFor] = useState<number | null>(null);
  const [stepSubject, setStepSubject] = useState('');
  const [stepBody, setStepBody] = useState('');
  const [stepDelay, setStepDelay] = useState('0');
  const [savingStep, setSavingStep] = useState(false);
  const [error, setError] = useState('');

  // Send-to-clients modal
  const [sendModalSeq, setSendModalSeq] = useState<Sequence | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set());
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    successes: number;
    failures: number;
    errors: string[];
  } | null>(null);

  const load = () => {
    setLoading(true);
    api
      .getEmailSequences()
      .then(setSequences)
      .catch(() => setSequences([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleExpand = async (seq: Sequence) => {
    if (expandedId === seq.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(seq.id);
    if (!stepsById[seq.id]) {
      setLoadingSteps(seq.id);
      try {
        const detail: any = await api.getEmailSequence(seq.id);
        setStepsById((prev) => ({ ...prev, [seq.id]: detail.steps || [] }));
      } catch {
        setStepsById((prev) => ({ ...prev, [seq.id]: [] }));
      } finally {
        setLoadingSteps(null);
      }
    }
  };

  const handleCreateSequence = async () => {
    if (!seqName.trim()) return;
    setSavingSeq(true);
    setError('');
    try {
      await api.createEmailSequence({ name: seqName, trigger: seqTrigger, active: 1 });
      setSeqName('');
      setSeqTrigger('contact_form');
      setShowCreate(false);
      load();
    } catch (e: any) {
      setError(e?.message || 'Failed to create sequence');
    } finally {
      setSavingSeq(false);
    }
  };

  const resetStepForm = () => {
    setStepFormFor(null);
    setStepSubject('');
    setStepBody('');
    setStepDelay('0');
  };

  const handleAddStep = async (sequenceId: number) => {
    if (!stepSubject.trim() || !stepBody.trim()) {
      setError('Subject and body are required');
      return;
    }
    setSavingStep(true);
    setError('');
    try {
      const existing = stepsById[sequenceId] || [];
      await api.addEmailSequenceStep(sequenceId, {
        subject: stepSubject,
        body_html: stepBody,
        delay_hours: Number(stepDelay) || 0,
        step_order: existing.length + 1,
      });
      const detail: any = await api.getEmailSequence(sequenceId);
      setStepsById((prev) => ({ ...prev, [sequenceId]: detail.steps || [] }));
      setSequences((prev) =>
        prev.map((s) =>
          s.id === sequenceId ? { ...s, step_count: (s.step_count || 0) + 1 } : s
        )
      );
      resetStepForm();
    } catch (e: any) {
      setError(e?.message || 'Failed to add step');
    } finally {
      setSavingStep(false);
    }
  };

  const openSendModal = async (seq: Sequence) => {
    setSendModalSeq(seq);
    setSelectedClientIds(new Set());
    setSendResult(null);
    if (clients.length === 0) {
      setClientsLoading(true);
      try {
        const list = await api.getClients();
        setClients(list || []);
      } catch {
        setClients([]);
      } finally {
        setClientsLoading(false);
      }
    }
  };

  const closeSendModal = () => {
    setSendModalSeq(null);
    setSelectedClientIds(new Set());
    setSendResult(null);
  };

  const toggleClient = (id: number) => {
    setSelectedClientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendToClients = async () => {
    if (!sendModalSeq || selectedClientIds.size === 0) return;
    setSending(true);
    setSendResult(null);
    let successes = 0;
    let failures = 0;
    const errors: string[] = [];
    for (const clientId of selectedClientIds) {
      const client = clients.find((c) => c.id === clientId);
      if (!client?.email) {
        failures++;
        errors.push(`Client #${clientId} has no email`);
        continue;
      }
      try {
        await api.enrollInSequence({
          sequence_id: sendModalSeq.id,
          email: client.email,
          client_id: clientId,
        });
        successes++;
      } catch (e: any) {
        failures++;
        errors.push(`${client.email}: ${e?.message || 'failed'}`);
      }
    }
    setSendResult({ successes, failures, errors });
    setSending(false);
  };

  const toggleActive = async (seq: Sequence) => {
    const newActive = seq.active ? 0 : 1;
    try {
      await api.updateEmailSequence(seq.id, { active: newActive });
      setSequences((prev) =>
        prev.map((s) => (s.id === seq.id ? { ...s, active: newActive } : s))
      );
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Email Drips</h1>
          <p className="text-sm text-gray-500 mt-1">
            Automated email sequences triggered by form submissions and lead events.
          </p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {showCreate ? 'Cancel' : '+ New Sequence'}
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-surface-100 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            New Sequence
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={seqName}
                onChange={(e) => setSeqName(e.target.value)}
                placeholder="Welcome drip"
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Trigger</label>
              <select
                value={seqTrigger}
                onChange={(e) => setSeqTrigger(e.target.value)}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange/30"
              >
                {triggers.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCreateSequence}
              disabled={savingSeq || !seqName.trim()}
              className="bg-orange hover:bg-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {savingSeq ? 'Saving...' : 'Create Sequence'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sequences.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-100 p-12 text-center text-gray-400">
          No email sequences yet. Create one to start sending drips.
        </div>
      ) : (
        <div className="space-y-3">
          {sequences.map((seq) => {
            const expanded = expandedId === seq.id;
            const steps = stepsById[seq.id] || [];
            return (
              <div
                key={seq.id}
                className="bg-white rounded-xl border border-surface-100 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 hover:bg-surface/30 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleExpand(seq)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-charcoal truncate">{seq.name}</h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        {seq.trigger?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span>
                        <span className="font-semibold text-charcoal">{seq.step_count ?? 0}</span> steps
                      </span>
                      <span>
                        <span className="font-semibold text-charcoal">
                          {seq.enrollment_count ?? 0}
                        </span>{' '}
                        enrolled
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => openSendModal(seq)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-white transition-colors"
                  >
                    Send to clients
                  </button>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                      seq.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {seq.active ? 'Active' : 'Paused'}
                  </span>
                </div>

                {expanded && (
                  <div className="border-t border-surface-100 bg-surface/20 p-4 space-y-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => toggleActive(seq)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 text-charcoal hover:bg-white transition-colors"
                      >
                        {seq.active ? 'Pause' : 'Activate'}
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Steps
                      </h4>
                      {loadingSteps === seq.id ? (
                        <div className="text-xs text-gray-400 py-2">Loading...</div>
                      ) : steps.length === 0 ? (
                        <p className="text-xs text-gray-400">No steps yet. Add the first one below.</p>
                      ) : (
                        <ol className="space-y-2">
                          {steps.map((step) => (
                            <li
                              key={step.id}
                              className="bg-white rounded-lg border border-surface-100 p-3 flex items-start gap-3"
                            >
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange/10 text-orange text-xs font-bold flex-shrink-0">
                                {step.step_order}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-charcoal truncate">
                                  {step.subject}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  Send after {step.delay_hours}h
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>

                    {/* Add step form */}
                    {stepFormFor === seq.id ? (
                      <div className="bg-white rounded-lg border border-surface-100 p-4 space-y-3">
                        <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                          Add Step
                        </h4>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Subject
                            </label>
                            <input
                              type="text"
                              value={stepSubject}
                              onChange={(e) => setStepSubject(e.target.value)}
                              placeholder="Welcome aboard"
                              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Delay (hours)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={stepDelay}
                              onChange={(e) => setStepDelay(e.target.value)}
                              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Body (HTML)
                          </label>
                          <textarea
                            value={stepBody}
                            onChange={(e) => setStepBody(e.target.value)}
                            rows={5}
                            placeholder="<p>Hi {{name}},</p>"
                            className="w-full text-sm font-mono border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange/30 resize-y"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={resetStepForm}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-charcoal hover:bg-surface transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddStep(seq.id)}
                            disabled={savingStep}
                            className="bg-orange hover:bg-orange-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {savingStep ? 'Saving...' : 'Add Step'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => {
                            resetStepForm();
                            setStepFormFor(seq.id);
                          }}
                          className="text-xs font-semibold text-orange hover:text-orange-dark"
                        >
                          + Add step
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sendModalSeq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-4"
          onClick={closeSendModal}
        >
          <div
            className="bg-white rounded-xl border border-surface-100 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-charcoal">
                  Send "{sendModalSeq.name}" to clients
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Selected clients will be enrolled in this sequence.
                </p>
              </div>
              <button
                onClick={closeSendModal}
                className="text-gray-400 hover:text-charcoal text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {clientsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin" />
                </div>
              ) : clients.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No clients yet.</p>
              ) : (
                <ul className="space-y-1">
                  {clients.map((c) => (
                    <li key={c.id}>
                      <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface/40 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedClientIds.has(c.id)}
                          onChange={() => toggleClient(c.id)}
                          className="rounded border-surface-200 text-orange focus:ring-orange/30"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal truncate">
                            {c.company_name || c.company || c.contact_name || c.email}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{c.email}</p>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {sendResult && (
                <div className="mt-4 rounded-lg border border-surface-100 bg-surface/40 p-3 text-xs">
                  <p className="font-semibold text-charcoal mb-1">
                    {sendResult.successes} sent, {sendResult.failures} failed
                  </p>
                  {sendResult.errors.length > 0 && (
                    <ul className="text-red-700 space-y-0.5 mt-1">
                      {sendResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-surface-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {selectedClientIds.size} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={closeSendModal}
                  className="text-xs font-semibold px-3 py-2 rounded-lg text-charcoal hover:bg-surface transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSendToClients}
                  disabled={sending || selectedClientIds.size === 0}
                  className="bg-orange hover:bg-orange-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
