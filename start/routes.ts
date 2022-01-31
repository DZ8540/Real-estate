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
}).middleware('CheckUserForAdmin')
