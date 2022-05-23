import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.post('/questions', 'Api/QuestionsController.create')

  Route.post('/messages/addImages', 'Api/MessagesController.addImages')

  Route.post('/banners', 'Api/BannersController.getAll')

  /**
   * * Auth
   */

  Route.group(() => {

    Route.post('/register', 'Api/AuthController.register')

    Route.post('/activate', 'Api/AuthController.activate')

    Route.post('/login', 'Api/AuthController.login').middleware('CheckUserCredentials')

    Route.post('/refresh', 'Api/AuthController.refresh').middleware(['CheckUserCredentials', 'CheckRefreshToken'])

    Route.post('/logout', 'Api/AuthController.logout').middleware(['CheckUserCredentials', 'CheckRefreshToken'])

    Route.group(() => {

      Route.post('/checkToken', 'Api/AuthController.checkRememberPasswordToken')
      Route.patch('/changePassword', 'Api/AuthController.changePassword')
      Route.post('/:email', 'Api/AuthController.rememberPassword')

    }).prefix('/rememberPassword')

  }).prefix('/auth')

  /**
   * * News
   */

  Route.group(() => {

    Route.post('', 'Api/NewsController.all')
    Route.post('/random', 'Api/NewsController.random')
    Route.post('/:slug', 'Api/NewsController.get')

  }).prefix('/news')

  /**
   * * Real estate
   */

  Route.group(() => {

    Route.post('/paginate/:currentUserId?', 'Api/RealEstates/RealEstatesController.all')
    Route.post('/create', 'Api/RealEstates/RealEstatesController.create').middleware('CheckAccessToken')
    Route.post('/popular/:currentUserId?', 'Api/RealEstates/RealEstatesController.popular')
    Route.post('/recommended/:currentUserId?', 'Api/RealEstates/RealEstatesController.recommended')
    Route.post('/types', 'Api/RealEstates/RealEstateTypesController.all')

    Route.group(() => {

      Route.post('/', 'Api/RealEstates/RealEstatesReportsController.add')
      Route.delete('/', 'Api/RealEstates/RealEstatesReportsController.delete')

    }).prefix('/reports').middleware('CheckAccessToken')

    Route.group(() => {

      Route.post('/', 'Api/RealEstates/RealEstatesWishListsController.add')
      Route.delete('/', 'Api/RealEstates/RealEstatesWishListsController.delete')

    }).prefix('/wishlist').middleware('CheckAccessToken')

    Route.post('/:uuid/:currentUserId?', 'Api/RealEstates/RealEstatesController.get')

  }).prefix('/realEstates')

  /**
   * * User
   */

  Route.group(() => {

    Route.patch('/update/:uuid', 'Api/Users/UsersController.update').middleware('CheckAccessToken')
    Route.delete('/deleteAvatar/:uuid', 'Api/Users/UsersController.deleteAvatar').middleware('CheckAccessToken')
    Route.post('/realEstates/:id/:currentUserId?', 'Api/RealEstates/RealEstatesController.getUserRealEstates').middleware('CheckAccessToken')
    Route.post('/wishlist/:id', 'Api/RealEstates/RealEstatesController.getUserWishlist').middleware('CheckAccessToken')

    Route.group(() => {

      Route.post('/', 'Api/Users/UsersReviewsController.paginate')
      Route.post('/add', 'Api/Users/UsersReviewsController.add').middleware('CheckAccessToken')
      Route.patch(':id', 'Api/Users/UsersReviewsController.update').middleware('CheckAccessToken')
      Route.delete(':id', 'Api/Users/UsersReviewsController.delete').middleware('CheckAccessToken')

    }).prefix('/reviews')

    Route.group(() => {

      Route.post('/', 'Api/Users/UsersReportsController.add')
      Route.delete('/', 'Api/Users/UsersReportsController.delete')

    }).prefix('/reports').middleware('CheckAccessToken')

    Route.group(() => {

      Route.post('/', 'Api/Users/UsersReviewsReportsController.add')
      Route.delete('/', 'Api/Users/UsersReviewsReportsController.delete')

    }).prefix('/reviewsReports').middleware('CheckAccessToken')

    Route.post('/:id', 'Api/Users/UsersController.get')

  }).prefix('/user')

  /**
   * * Service
   */

  Route.group(() => {

    Route.post('/types', 'Api/Services/ServicesTypesController.all')

    Route.post('/', 'Api/Services/ServicesController.all')
    Route.post('/add', 'Api/Services/ServicesController.add').middleware('CheckAccessToken')
    Route.patch('/:id', 'Api/Services/ServicesController.update').middleware('CheckAccessToken')
    Route.delete('/:id', 'Api/Services/ServicesController.delete').middleware('CheckAccessToken')

  }).prefix('/services')

}).prefix('/api')
