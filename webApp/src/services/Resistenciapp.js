import axios from 'axios'
import router from '@/router'
import NProgress from 'nprogress'

let apiClient = axios.create({
  //baseURL: `http://127.0.0.1:5000`,
  baseURL: `https://api-sckuuuierq-uc.a.run.app/`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 20000
})

const setHeaderAuthorization = () =>
  (apiClient.defaults.headers.common['Authorization'] = localStorage.getItem(
    'token'
  ))

const redirect = toRouteName => {
  if (router.currentRoute.name != toRouteName)
    router.push({ name: toRouteName })
  else NProgress.done()
}

const handleError = error => {
  console.log(error)
  if (error.response && error.response.status == 404) redirect('404')
  else if (error.response && error.response.status == 401) redirect('login')
  else redirect('network-issue')
}

const postRequest = (route, data) => {
  setHeaderAuthorization()
  return apiClient.post(`/undersive/${route}`, data).catch(handleError)
}

const getRequest = route => {
  setHeaderAuthorization()
  return apiClient.get(`/undersive/${route}`).catch(handleError)
}

export { postRequest, getRequest }
