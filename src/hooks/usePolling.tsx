import { useEffect, useState } from 'react'

type callbackType<T> = () => Promise<T>

type usePollingHookReturnValue<T> = T | undefined

const DEFAULT_POLLING_TIME = 3_000 // 3 secs as default polling

function usePolling<T>(
  callback: callbackType<T>,
  pollingTime = DEFAULT_POLLING_TIME
): usePollingHookReturnValue<T> {
  const [data, setData] = useState<T>()

  useEffect(() => {
    async function performCall() {
      try {
        const data = await callback()
        setData(data)
      } catch (exception) {
        console.log('polling error: ', exception)
      }
    }

    // perform the call
    performCall()

    // set the inteval to perform the polling
    const intervalId = setInterval(() => {
      performCall()
    }, pollingTime)

    return () => {
      clearInterval(intervalId)
    }
  }, [callback, pollingTime])

  return data
}

export default usePolling
