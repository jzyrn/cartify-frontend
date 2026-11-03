import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import axios from 'axios'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import { ActionLoader } from '../Layout/Loader'
import { API_BASE_URL } from '../Utils/Helpers'
import loginImage from '../../assets/cartify_panel.png'

const GREEN = '#1a3329'
const GOLD = '#c9a227'
const fieldSx = { mb: 2, '& label.Mui-focused': { color: GREEN }, '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: GREEN } }

export default function NewPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { token } = useParams()

  const submitHandler = async (event) => {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await axios.put(`${API_BASE_URL}/password/reset/${token}`, { password, confirmPassword })
      toast.success('Password updated. Please sign in.', { position: 'bottom-right' })
      navigate('/login')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Password reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const visibilityAdornment = (shown, toggle) => <InputAdornment position="end"><Button size="small" onClick={toggle} sx={{ color: GREEN, minWidth: 0 }}>{shown ? 'Hide' : 'Show'}</Button></InputAdornment>

  return (
    <>
      <MetaData title="New Password" />
      <section className="auth-page">
        <div className="auth-shell">
          <div className="auth-visual"><img src={loginImage} alt="Cartify" /></div>
          <div className="auth-form-side">
            <h1 className="auth-title">Choose a new password</h1>
            <p className="auth-subtitle">Create a new password for your Cartify account.</p>
            {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={submitHandler}>
              <TextField id="password_field" label="New password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} inputProps={{ minLength: 6 }} required fullWidth sx={fieldSx} InputProps={{ endAdornment: visibilityAdornment(showPassword, () => setShowPassword((shown) => !shown)) }} />
              <TextField id="confirm_password_field" label="Confirm new password" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} inputProps={{ minLength: 6 }} required fullWidth sx={fieldSx} InputProps={{ endAdornment: visibilityAdornment(showConfirm, () => setShowConfirm((shown) => !shown)) }} />
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ bgcolor: GREEN, color: GOLD, fontWeight: 700, letterSpacing: 1, py: 1.5, '&:hover': { bgcolor: '#12241c' } }}>
                {loading ? <><ActionLoader size={18} color={GOLD} />Saving…</> : 'UPDATE PASSWORD'}
              </Button>
            </form>
            <p className="auth-subtitle" style={{ marginTop: 20 }}><Link to="/login">Back to sign in</Link></p>
          </div>
        </div>
      </section>
    </>
  )
}
