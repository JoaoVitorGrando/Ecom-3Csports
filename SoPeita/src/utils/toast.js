import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export function showToast(message, type = 'success') {
  Toastify({
    text: message,
    duration: 3200,
    gravity: 'bottom',
    position: 'right',
    className: `sop-toasty sop-toasty-${type}`,
    style: {
      background: type === 'error' ? '#dc2626' : type === 'success' ? '#22c55e' : '#fbbf24',
      color: '#fff',
      border: 'none',
      borderRadius: '14px',
      fontSize: '1rem',
      fontWeight: 600,
      padding: '0.7rem 1.5rem',
      boxShadow: '0 4px 24px rgba(37,99,235,0.10)',
      minWidth: '180px',
      maxWidth: '90vw',
      textAlign: 'center',
      letterSpacing: '0.01em',
      zIndex: 9999
    },
    stopOnFocus: true
  }).showToast()
} 