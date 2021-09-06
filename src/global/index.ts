import { App } from 'vue'
import registerElement from './register-elemet'

export function globalRegister(app: App) {
  app.use(registerElement)
}
