'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SyncLog {
  id: string
  source: string
  status: string
  modelSlug?: string
  changesFound?: unknown
  appliedAt?: string
  error?: string
  createdAt: string
}

interface DiffResult {
  modelSlug: string
  hasChanges: boolean
  changes: Array<{
    field: string
    oldValue: unknown
    newValue: unknown
    type: 'added' | 'removed' | 'modified'
    severity: 'low' | 'medium' | 'high'
  }>
}

interface SyncStatus {
  lastSuccessfulSync: {
    id: string
    date: string
    changesFound: unknown
  } | null
  recentLogs: SyncLog[]
}

export function SyncDashboard() {
  const [status, setStatus] = useState<SyncStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{
    diffs: DiffResult[]
    summary: {
      totalChanges: number
      highSeverity: number
      modelsAffected: number
      summary: string
    }
  } | null>(null)
  const [expandedDiffs, setExpandedDiffs] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  // Fetch sync status on mount
  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/sync/status')
      const data = await response.json()
      if (data.success) {
        setStatus(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch sync status')
    } finally {
      setIsLoading(false)
    }
  }

  const runSyncCheck = async () => {
    try {
      setIsSyncing(true)
      setSyncResult(null)
      setError(null)

      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' }),
      })

      const data = await response.json()
      if (data.success) {
        setSyncResult({
          diffs: data.data.diffs,
          summary: data.data.summary,
        })
        // Refresh status after sync
        fetchStatus()
      } else {
        setError(data.error || 'Sync check failed')
      }
    } catch (err) {
      setError('Failed to run sync check')
    } finally {
      setIsSyncing(false)
    }
  }

  const applyChanges = async () => {
    if (!syncResult) return

    try {
      setIsSyncing(true)
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply',
          diffs: syncResult.diffs,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSyncResult(null)
        fetchStatus()
        alert(`Successfully applied ${data.data.applied} change(s)`)
      } else {
        setError(data.error || 'Failed to apply changes')
      }
    } catch (err) {
      setError('Failed to apply changes')
    } finally {
      setIsSyncing(false)
    }
  }

  const toggleDiff = (modelSlug: string) => {
    setExpandedDiffs((prev) => {
      const next = new Set(prev)
      if (next.has(modelSlug)) {
        next.delete(modelSlug)
      } else {
        next.add(modelSlug)
      }
      return next
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Kia India Sync</h2>
          <p className="text-sm text-gray-500">
            Sync model data from kia.com/in
          </p>
        </div>
        <Button
          onClick={runSyncCheck}
          disabled={isSyncing}
          className="bg-kia-red hover:bg-kia-red-dark"
        >
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check for Updates
            </>
          )}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="h-4 w-4 text-red-400" />
          </button>
        </div>
      )}

      {/* Last Sync Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Clock className="h-4 w-4" />
            Last Successful Sync
          </div>
          <p className="font-semibold">
            {status?.lastSuccessfulSync
              ? formatDate(status.lastSuccessfulSync.date)
              : 'Never'}
          </p>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <RefreshCw className="h-4 w-4" />
            Total Syncs
          </div>
          <p className="font-semibold">{status?.recentLogs.length || 0}</p>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <ExternalLink className="h-4 w-4" />
            Source
          </div>
          <a
            href="https://www.kia.com/in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-kia-red hover:underline"
          >
            kia.com/in
          </a>
        </div>
      </div>

      {/* Sync Results */}
      {syncResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border overflow-hidden"
        >
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold">Sync Results</h3>
            <p className="text-sm text-gray-600">{syncResult.summary.summary}</p>
          </div>

          {syncResult.diffs.filter((d) => d.hasChanges).length > 0 ? (
            <div className="divide-y">
              {syncResult.diffs
                .filter((d) => d.hasChanges)
                .map((diff) => (
                  <div key={diff.modelSlug}>
                    <button
                      onClick={() => toggleDiff(diff.modelSlug)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium capitalize">
                          {diff.modelSlug}
                        </span>
                        <span className="text-sm text-gray-500">
                          {diff.changes.length} change(s)
                        </span>
                        {diff.changes.some((c) => c.severity === 'high') && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            High Priority
                          </span>
                        )}
                      </div>
                      {expandedDiffs.has(diff.modelSlug) ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    {expandedDiffs.has(diff.modelSlug) && (
                      <div className="px-4 pb-4">
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-3 py-2 text-left">Field</th>
                                <th className="px-3 py-2 text-left">Type</th>
                                <th className="px-3 py-2 text-left">Old Value</th>
                                <th className="px-3 py-2 text-left">New Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {diff.changes.map((change, idx) => (
                                <tr key={idx}>
                                  <td className="px-3 py-2 font-mono text-xs">
                                    {change.field}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span
                                      className={cn(
                                        'px-2 py-0.5 rounded text-xs',
                                        change.type === 'added' &&
                                          'bg-green-100 text-green-700',
                                        change.type === 'removed' &&
                                          'bg-red-100 text-red-700',
                                        change.type === 'modified' &&
                                          'bg-yellow-100 text-yellow-700'
                                      )}
                                    >
                                      {change.type}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 font-mono text-xs text-gray-500">
                                    {change.oldValue !== null
                                      ? JSON.stringify(change.oldValue)
                                      : '-'}
                                  </td>
                                  <td className="px-3 py-2 font-mono text-xs">
                                    {change.newValue !== null
                                      ? JSON.stringify(change.newValue)
                                      : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p>All data is up to date!</p>
            </div>
          )}

          {syncResult.summary.totalChanges > 0 && (
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSyncResult(null)}>
                Dismiss
              </Button>
              <Button
                onClick={applyChanges}
                disabled={isSyncing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Apply Changes
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Recent Logs */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Sync Logs</h3>
        </div>
        <div className="divide-y">
          {status?.recentLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No sync logs yet. Run a sync check to get started.
            </div>
          ) : (
            status?.recentLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {log.status === 'success' ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : log.status === 'failed' ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {log.modelSlug
                        ? `${log.modelSlug} sync`
                        : 'Full sync check'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    'px-2 py-1 rounded text-xs font-medium',
                    log.status === 'success' && 'bg-green-100 text-green-700',
                    log.status === 'failed' && 'bg-red-100 text-red-700',
                    log.status === 'partial' && 'bg-yellow-100 text-yellow-700'
                  )}
                >
                  {log.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
