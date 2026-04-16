import { useMemo, useState } from 'react'

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
const STATUSES = ['Todo', 'InProgress', 'Review', 'Done']

export function TaskForm({ initial, onSubmit, onCancel, apiErrors = {} }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    priority: initial?.priority || 'Medium',
    status: initial?.status || 'Todo',
    dueDate: initial?.dueDate ? initial.dueDate.split('T')[0] : '',
  })
  const [errors, setErrors] = useState({})

  const normalizedApiErrors = useMemo(() => ({
    title: apiErrors.title || apiErrors.Title || apiErrors['dto.Title'],
    description: apiErrors.description || apiErrors.Description,
    dueDate: apiErrors.dueDate || apiErrors.DueDate,
    priority: apiErrors.priority || apiErrors.Priority,
    status: apiErrors.status || apiErrors.Status,
  }), [apiErrors])

  const validate = () => {
    const e = {}
    if (!form.title?.trim()) e.title = 'Task title is required.'
    else if (form.title.trim().length > 150) e.title = 'Task title must be 150 characters or less.'
    if ((form.description || '').length > 1000) e.description = 'Description must be 1000 characters or less.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit({ ...form, title: form.title.trim(), dueDate: form.dueDate || null })
  }

  return (
    <form onSubmit={submit} className="form">
      <input
        required
        maxLength={150}
        placeholder="Task title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      {(errors.title || normalizedApiErrors.title?.[0]) && (
        <p className="error">{errors.title || normalizedApiErrors.title?.[0]}</p>
      )}
      <textarea
        maxLength={1000}
        placeholder="Description (optional)"
        rows={3}
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      {(errors.description || normalizedApiErrors.description?.[0]) && (
        <p className="error">{errors.description || normalizedApiErrors.description?.[0]}</p>
      )}
      <div className="row">
        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <input
          type="date"
          value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value || '' })}
        />
      </div>
      {(errors.dueDate || normalizedApiErrors.dueDate?.[0]) && (
        <p className="error">{errors.dueDate || normalizedApiErrors.dueDate?.[0]}</p>
      )}
      <div className="row">
        <button type="submit">Save Task</button>
        {onCancel && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
