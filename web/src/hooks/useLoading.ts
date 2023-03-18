import { ref, type Ref } from 'vue'

type LoadingDispatcher = {
  loading: () => void
  loaded: () => void
}

const useLoading = (defaultStatus: boolean = false): [Ref<boolean>, LoadingDispatcher] => {
  const loading = ref(defaultStatus)

  const dispatcher: LoadingDispatcher = {
    loading: () => {
      loading.value = true
    },
    loaded: () => {
      loading.value = false
    }
  }

  return [loading, dispatcher]
}

export default useLoading
