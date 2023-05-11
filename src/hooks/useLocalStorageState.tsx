import { useEffect, useState } from 'react'

type useLocalStorageStateReturnType<T> = [
  value: T,
  setValue: React.Dispatch<React.SetStateAction<T>>
]

function useLocalStorageState<T extends string>(
  key: string,
  initialValue: T
): useLocalStorageStateReturnType<T> {
  const reactState = useState<T>(() => (localStorage.getItem(key) as T) || initialValue)

  const [value] = reactState

  // we also update the localstorage
  useEffect(() => {
    if (key) {
      localStorage.setItem(key, value)
    }
  }, [value, key])

  return reactState
}

export default useLocalStorageState
