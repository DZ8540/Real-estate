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

import './routes/api'
import './routes/auth'
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'BaseController.index').as('index')

  Route.resource('/news', 'NewsController')

  Route.resource('/banners', 'BannersController').except(['show'])

  Route.resource('/realEstateTypes', 'RealEstates/RealEstateTypesController').except(['create', 'store', 'destroy'])

  Route.resource('/estates', 'RealEstates/EstatesController')

  Route.resource('/labels', 'Services/LabelsController').except(['show'])

  Route.resource('/servicesTypes', 'Services/ServicesTypesController').except(['show'])

  Route.resource('/services', 'Services/ServicesController').except(['create', 'store'])

  Route.resource('/usersReviews', 'Users/UsersReviewsController').except(['create', 'store'])

  Route.resource('/realEstates', 'RealEstates/RealEstatesController').except(['create', 'store'])
  Route.post('/realEstates/block/:id', 'RealEstates/RealEstatesController.block').as('real_estates.block')
  Route.post('/realEstates/unblock/:id', 'RealEstates/RealEstatesController.unblock').as('real_estates.unblock')
  Route.post('/realEstates/makeHot/:id', 'RealEstates/RealEstatesController.makeHot').as('real_estates.makeHot')
  Route.post('/realEstates/unmakeHot/:id', 'RealEstates/RealEstatesController.unmakeHot').as('real_estates.unmakeHot')
  Route.post('/realEstates/makeVip/:id', 'RealEstates/RealEstatesController.makeVip').as('real_estates.makeVip')
  Route.post('/realEstates/unmakeVip/:id', 'RealEstates/RealEstatesController.unmakeVip').as('real_estates.unmakeVip')

  Route.group(() => {

    Route.get('/', 'Users/UsersController.index').as('index')
    Route.get('/:uuid', 'Users/UsersController.show').as('show')
    Route.post('/block/:uuid', 'Users/UsersController.block').as('block')
    Route.post('/unblock/:uuid', 'Users/UsersController.unblock').as('unblock')

  }).prefix('/users').as('users')

  Route.group(() => {

    Route.get('/', 'RealEstates/RealEstatesReportsController.index').as('index')
    Route.delete('/', 'RealEstates/RealEstatesReportsController.destroy').as('destroy')

  }).prefix('/realEstatesReports').as('real_estates_reports')

  Route.group(() => {

    Route.get('/', 'Users/UsersReportsController.index').as('index')
    Route.delete('/:id', 'Users/UsersReportsController.destroy').as('destroy')

  }).prefix('/usersReports').as('users_reports')

  Route.group(() => {

    Route.get('/', 'Users/UsersReviewsReportsController.index').as('index')
    Route.delete('/:id', 'Users/UsersReviewsReportsController.destroy').as('destroy')

  }).prefix('/usersReviewsReports').as('users_reviews_reports')

  Route.group(() => {

    Route.get('/', 'QuestionsController.index').as('index')
    Route.get('/:id', 'QuestionsController.show').as('show')
    Route.delete('/:id', 'QuestionsController.destroy').as('destroy')

  }).prefix('/questions').as('questions')
}).middleware('CheckUserForAdmin')
