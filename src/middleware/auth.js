export const auth = (req, res, next) => {
  const isLogged = req.cookies.token ? true : false

  res.locals.token = isLogged
  next()
}

export const checkAuth = (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect('/login')
    return
  }

  next()
}

export const checkLogin = (req, res, next) => {
  if (req.cookies.token) {
    res.redirect('/')
    return
  }
  next()
}