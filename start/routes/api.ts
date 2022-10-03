import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/checkServer', 'Api/IndexController.checkServer')

  Route.post('/questions', 'Api/QuestionsController.create')

  Route.post('/banners', 'Api/BannersController.getAll')

  Route.post('/cities', 'Api/CitiesController.getAll')

  Route.post('/districts/:city', 'Api/DistrictsController.getAll')

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

    Route.post('/create', 'Api/RealEstates/RealEstatesController.create').middleware('CheckAccessToken')
    Route.patch('/update/:uuid', 'Api/RealEstates/RealEstatesController.update').middleware('CheckAccessToken')
    Route.delete('/delete/:uuid', 'Api/RealEstates/RealEstatesController.delete').middleware('CheckAccessToken')

    Route.post('/getForMap/:city', 'Api/RealEstates/RealEstatesController.getForMap')
    Route.post('/getFromMap/:currentUserId?', 'Api/RealEstates/RealEstatesController.getFromMap')
    Route.post('/paginate/:city/:currentUserId?', 'Api/RealEstates/RealEstatesController.all')
    Route.post('/popular/:city/:currentUserId?', 'Api/RealEstates/RealEstatesController.popular')
    Route.post('/recommended/:city/:currentUserId?', 'Api/RealEstates/RealEstatesController.recommended')

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

      Route.post('/add', 'Api/Users/UsersReviewsController.add').middleware('CheckAccessToken')
      Route.patch('/:id', 'Api/Users/UsersReviewsController.update').middleware('CheckAccessToken')
      Route.delete('/:id', 'Api/Users/UsersReviewsController.delete').middleware('CheckAccessToken')

      Route.post('/:currentUserId?', 'Api/Users/UsersReviewsController.paginate')

    }).prefix('/reviews')

    Route.group(() => {

      Route.post('/', 'Api/Users/UsersReportsController.add')
      Route.delete('/', 'Api/Users/UsersReportsController.delete')

    }).prefix('/reports').middleware('CheckAccessToken')

    Route.group(() => {

      Route.post('/', 'Api/Users/UsersReviewsReportsController.add')
      Route.delete('/', 'Api/Users/UsersReviewsReportsController.delete')

    }).prefix('/reviewsReports').middleware('CheckAccessToken')

    Route.post('/:id/:currentUserId?', 'Api/Users/UsersController.get')

  }).prefix('/user')

  /**
   * * Service
   */

  Route.group(() => {

    Route.post('/types', 'Api/Services/ServicesTypesController.all')
    Route.post('/subServicesTypes/:serviceTypeId', 'Api/Services/ServicesTypesController.getAllSubServicesTypes')
    Route.post('/attributesTypes/:serviceTypeId', 'Api/Services/ServicesTypesController.getAllAttributesTypes')

    Route.post('/', 'Api/Services/ServicesController.all')
    Route.get('/:id', 'Api/Services/ServicesController.get')
    Route.post('/add', 'Api/Services/ServicesController.add').middleware('CheckAccessToken')
    Route.patch('/:id', 'Api/Services/ServicesController.update').middleware('CheckAccessToken')
    Route.delete('/:id', 'Api/Services/ServicesController.delete').middleware('CheckAccessToken')

  }).prefix('/services')

  /**
   * * Response
   */

  Route.group(() => {

    Route.post('/realEstate/:realEstateId', 'Api/ResponsesController.paginateRealEstateResponses')

    Route.post('/incumings/:userId', 'Api/ResponsesController.paginateIncumings')
    Route.post('/outgoings/:userId', 'Api/ResponsesController.paginateOutgoings')

    Route.post('/completed/:userId', 'Api/ResponsesController.paginateCompleted')

    Route.group(() => {

      Route.post('/owner/:userId', 'Api/ResponsesController.paginateOwnerInProcess')

      Route.post('/executor/:userId', 'Api/ResponsesController.paginateExecutorInProcess')

    }).prefix('/inProcess')

    Route.group(() => {

      Route.post('/realEstate', 'Api/ResponsesController.createRealEstateResponse')
      Route.post('/service', 'Api/ResponsesController.createServiceResponse')

    }).prefix('/create')

    Route.patch('/accept/:id', 'Api/ResponsesController.accept')
    Route.patch('/complete/:id', 'Api/ResponsesController.complete')
    Route.delete('/:id', 'Api/ResponsesController.reject')

  }).prefix('/responses').middleware('CheckAccessToken')

}).prefix('/api')
