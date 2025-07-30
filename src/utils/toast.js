import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export function showToast(message, type = 'success') {
  let background = '#22c55e' // verde padrão para sucesso
  if (type === 'error') background = '#dc2626' // vermelho para erro/acesso negado
  else if (type === 'warning') background = '#FFD600' // amarelo para aviso

  Toastify({
    text: message,
    duration: 3200,
    gravity: 'bottom',
    position: 'right',
    className: `sop-toasty sop-toasty-${type}`,
    style: {
      background,
      color: type === 'warning' ? '#18181b' : '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.92rem',
      fontWeight: 500,
      padding: '0.35rem 1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      minWidth: '120px',
      maxWidth: '70vw',
      textAlign: 'center',
      letterSpacing: '0.01em',
      zIndex: 9999
    },
    stopOnFocus: true
  }).showToast()
} 