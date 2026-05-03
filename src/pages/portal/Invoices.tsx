import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format((cents || 0) / 100);
}

export default function PortalInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getPortalInvoices()
      .then(setInvoices)
      .catch((err) => setError(err.message || 'Failed to load invoices'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Invoices</h1>
        <p className="text-gray-500 mt-1">View and pay your outstanding invoices.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No invoices yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Invoice</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Due</th>
                <th className="text-right px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-charcoal">
                    <div className="font-medium">#{inv.id}</div>
                    {inv.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{inv.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal text-right font-semibold">
                    {formatCents(inv.amount_cents)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.status !== 'paid' && inv.hosted_invoice_url ? (
                      <a
                        href={inv.hosted_invoice_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-orange hover:bg-orange-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        Pay invoice
                      </a>
                    ) : inv.status === 'paid' ? (
                      <span className="text-xs text-gray-400">
                        Paid{' '}
                        {inv.paid_at
                          ? new Date(inv.paid_at).toLocaleDateString()
                          : ''}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
