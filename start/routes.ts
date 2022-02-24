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
    Route.get('/', 'Users/UsersController.index').as('users.index')
    Route.get('/:uuid', 'Users/UsersController.show').as('users.show')
    Route.post('/block/:uuid', 'Users/UsersController.block').as('users.block')
    Route.post('/unblock/:uuid', 'Users/UsersController.unblock').as('users.unblock')
  }).prefix('/users')

  Route.resource('/news', 'NewsController')

  Route.resource('/realEstateTypes', 'RealEstates/RealEstateTypesController')

  Route.resource('/estates', 'RealEstates/EstatesController')

  Route.resource('/labels', 'Services/LabelsController').except(['show'])

  Route.resource('/servicesTypes', 'Services/ServicesTypesController').except(['show'])

  Route.resource('/services', 'Services/ServicesController').except(['create', 'store'])

  Route.resource('/realEstates', 'RealEstates/RealEstatesController').except(['create', 'store'])
  Route.post('/realEstates/block/:id', 'RealEstates/RealEstatesController.block').as('real_estates.block')
  Route.post('/realEstates/unblock/:id', 'RealEstates/RealEstatesController.unblock').as('real_estates.unblock')

  Route.get('/realEstatesReports', 'RealEstates/RealEstatesReportsController.index').as('real_estates_reports.index')
  Route.delete('/realEstatesReports', 'RealEstates/RealEstatesReportsController.destroy').as('real_estates_reports.destroy')

  Route.get('/usersReports', 'Users/UsersReportsController.index').as('users_reports.index')
  Route.delete('/usersReports/:id', 'Users/UsersReportsController.destroy').as('users_reports.destroy')

  Route.resource('/usersReviews', 'Users/UsersReviewsController').except(['create', 'store'])

  Route.get('/usersReviewsReports', 'Users/UsersReviewsReportsController.index').as('users_reviews_reports.index')
  Route.delete('/usersReviewsReports/:id', 'Users/UsersReviewsReportsController.destroy').as('users_reviews_reports.destroy')
}).middleware('CheckUserForAdmin')

// * Api
Route.group(() => {
  Route.group(() => {

    Route.post('/register', 'Api/AuthController.register')
    Route.post('/activate', 'Api/AuthController.activate')
    Route.post('/login', 'Api/AuthController.login').middleware('CheckUserCredentials')
    Route.post('/refresh', 'Api/AuthController.refresh').middleware(['CheckUserCredentials', 'CheckRefreshToken'])
    Route.post('/logout', 'Api/AuthController.logout').middleware(['CheckUserCredentials', 'CheckRefreshToken', 'CheckAccessToken'])

  }).prefix('/auth')

  Route.group(() => {
    Route.group(() => {

      Route.post('', 'Api/NewsController.all')
      Route.post('/random', 'Api/NewsController.random')
      Route.post('/:slug', 'Api/NewsController.get')

    }).prefix('/news')

    Route.group(() => {

      Route.post('/', 'Api/RealEstates/RealEstatesController.all')
      Route.post('/create', 'Api/RealEstates/RealEstatesController.create')
      Route.post('/:uuid', 'Api/RealEstates/RealEstatesController.get')

    }).prefix('/realEstates')

    Route.group(() => {

      Route.post('/', 'Api/RealEstates/RealEstatesReportsController.add')
      Route.delete('/', 'Api/RealEstates/RealEstatesReportsController.delete')

    }).prefix('/realEstatesReports')

    Route.group(() => {

      Route.post('/', 'Api/RealEstates/RealEstatesWishListsController.add')
      Route.delete('/', 'Api/RealEstates/RealEstatesWishListsController.delete')

    }).prefix('/realEstatesWishLists')

    Route.post('/realEstateTypes', 'Api/RealEstates/RealEstateTypesController.all')
  }).middleware('CheckAccessToken')

  Route.post('/messages/addImages', 'Api/MessagesController.addImages')
}).prefix('/api')
// * Api
