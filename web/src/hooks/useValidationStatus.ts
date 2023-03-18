import { ref, type Ref } from 'vue'
import type { ValidationStatus, WithUndefined } from '@/types'

type ValidationStatusDispatcher = {
  clear: () => void
  setSuccess: () => void
  setError: () => void
  setWarning: () => void
}

const useValidationStatus = (
  defaultStatus: WithUndefined<ValidationStatus> = undefined
): [Ref<WithUndefined<ValidationStatus>>, ValidationStatusDispatcher] => {
  const status = ref<WithUndefined<ValidationStatus>>(defaultStatus)

  const dispatcher: ValidationStatusDispatcher = {
    clear: () => {
      status.value = undefined
    },
    setSuccess: () => {
      status.value = 'success'
    },
    setError: () => {
      status.value = 'error'
    },
    setWarning: () => {
      status.value = 'warning'
    }
  }

  return [status, dispatcher]
}

export default useValidationStatus
