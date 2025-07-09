import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export function showToast(message, type = 'success') {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    style: {
      background:
        type === 'success'
          ? 'linear-gradient(to right,rgb(20, 172, 53), #96c93d)'
          : type === 'error'
          ? 'linear-gradient(to right,rgb(235, 17, 35),rgb(185, 28, 28))'
          : 'linear-gradient(to right, #2193b0, #6dd5ed)'
    },
    stopOnFocus: true
  }).showToast()
} 