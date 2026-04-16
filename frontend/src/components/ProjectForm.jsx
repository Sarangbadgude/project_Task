import { useMemo, useState } from 'react'

export function ProjectForm({ initial = { name: '', description: '' }, onSubmit, onCancel, apiErrors = {} }) {
  const [form, setForm] = useState({ name: initial.name || '', description: initial.description || '' })
  const [errors, setErrors] = useState({})

  const normalizedApiErrors = useMemo(() => ({
    name: apiErrors.name || apiErrors.Name || apiErrors['dto.Name'],
    description: apiErrors.description || apiErrors.Description || apiErrors['dto.Description'],
  }), [apiErrors])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Project name is required.'
    else if (form.name.trim().length > 100) e.name = 'Project name must be 100 characters or less.'
    if ((form.description || '').length > 300) e.description = 'Description must be 300 characters or less.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit({ ...form, name: form.name.trim() })
  }

  return (
    <form onSubmit={submit} className="form">
      <input
        placeholder="Project name"
        maxLength={100}
        required
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      {(errors.name || normalizedApiErrors.name?.[0]) && (
        <p className="error">{errors.name || normalizedApiErrors.name?.[0]}</p>
      )}
      <textarea
        placeholder="Description (optional)"
        maxLength={300}
        rows={3}
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      {(errors.description || normalizedApiErrors.description?.[0]) && (
        <p className="error">{errors.description || normalizedApiErrors.description?.[0]}</p>
      )}
      <div className="row">
        <button type="submit">Save</button>
        {onCancel && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
