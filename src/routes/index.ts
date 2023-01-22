import { Express } from 'express'

import authRoute from './auth.route'
import carRoute from './car.route'
import publicRoute from './public.route'
import contactRoute from './contact.route'

const setupRouter = (app: Express) => {

    app.use('/v1/auth', authRoute)
    app.use('/v1/car', carRoute)
    app.use('/v1/public', publicRoute)
    app.use('/v1/contact', contactRoute)

}

export { setupRouter }