/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

// * Auth
Route.group(() => {
  Route.on('/').redirect('login')

  Route.get('/login', 'AuthController.login').as('login')
  Route.post('/login', 'AuthController.loginAction').as('login.action')

  Route.get('/logout', 'AuthController.logout').as('logout')
}).prefix('/auth')
// * Auth

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('pages/index')
  }).as('index')

  Route.group(() => {
    Route.get('/', 'UsersController.index').as('users.index')
    Route.get('/:id', 'UsersController.show').as('users.show')
    Route.post('/block/:id', 'UsersController.block').as('users.block')
    Route.post('/unblock/:id', 'UsersController.unblock').as('users.unblock')
  }).prefix('/users')

  Route.resource('/news', 'NewsController')

  Route.resource('/realEstateTypes', 'RealEstateTypesController')

  Route.resource('/estates', 'EstatesController')

  Route.resource('/labels', 'LabelsController').except(['show'])

  Route.resource('/servicesTypes', 'ServicesTypesController').except(['show'])

  Route.resource('/services', 'ServicesController').except(['create', 'store'])

  Route.resource('/realEstates', 'RealEstatesController').except(['create', 'store'])
  Route.post('/realEstates/block/:id', 'RealEstatesController.block').as('real_estates.block')
  Route.post('/realEstates/unblock/:id', 'RealEstatesController.unblock').as('real_estates.unblock')

  Route.get('/realEstatesReports', 'RealEstatesReportsController.index').as('real_estates_reports.index')
  Route.delete('/realEstatesReports/:id', 'RealEstatesReportsController.destroy').as('real_estates_reports.destroy')
}).middleware('CheckUserForAdmin')

// * Api
Route.group(() => {
  Route.group(() => {

    Route.post('/register', 'Api/AuthController.register')
    Route.post('/login', 'Api/AuthController.login').middleware('CheckUserCredentials')
    Route.post('/refresh', 'Api/AuthController.refresh').middleware(['CheckUserCredentials', 'CheckToken'])
    Route.post('/logout', 'Api/AuthController.logout').middleware(['CheckUserCredentials', 'CheckToken'])
    Route.post('/activate', 'Api/AuthController.activate')

  }).prefix('/auth')
}).prefix('/api')
// * Api
