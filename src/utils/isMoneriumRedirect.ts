const isMoneriumRedirect = () => {
  const authCode = new URLSearchParams(window.location.search).get('code')

  return !!authCode
}

export default isMoneriumRedirect
