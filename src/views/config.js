export const apiDomain = 'http://localhost:8000'
export const apiUrl = 'http://localhost:8000/api/'

export const getHeader = function () {
  return {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + window.localStorage.getItem('authUser')
  }
}

export const logout = function () {
  window.localStorage.clear();
  window.location = '/'
}

export const getHeaderFile = function () {
  return {
    'Accept': 'application/json, image/*, file/*, .avi, video/*, application/octet-stream, application/*, .zip, .rar, .csv',
    'Authorization': 'Bearer ' + window.localStorage.getItem('authUser')
  }
}

export const maskPhone = function (param) {
  let phone = param.replace(/\D/g, '')
  phone = phone.replace(/^0/, '')

  if (phone.length > 11) {
      phone = phone.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else if (phone.length > 7) {
      phone = phone.replace(/^(\d\d)(\d{5})(\d{0,4}).*/, '($1) $2-$3')
  } else if (phone.length > 2) {
      phone = phone.replace(/^(\d\d)(\d{0,5})/, '($1) $2')
  }
  return phone
}