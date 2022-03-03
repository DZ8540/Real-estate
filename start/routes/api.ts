import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.post('/messages/addImages', 'Api/MessagesController.addImages')

  Route.group(() => {

    Route.post('/register', 'Api/AuthController.register')

    Route.post('/activate', 'Api/AuthController.activate')

    Route.post('/login', 'Api/AuthController.login').middleware('CheckUserCredentials')

    Route.post('/refresh', 'Api/AuthController.refresh').middleware(['CheckUserCredentials', 'CheckRefreshToken'])

    Route.post('/logout', 'Api/AuthController.logout').middleware(['CheckUserCredentials', 'CheckRefreshToken', 'CheckAccessToken'])

    Route.group(() => {

      Route.post('/checkToken', 'Api/AuthController.checkRememberPasswordToken')
      Route.patch('/changePassword', 'Api/AuthController.changePassword')
      Route.post('/:email', 'Api/AuthController.rememberPassword')

    }).prefix('/rememberPassword')

  }).prefix('/auth')

  Route.group(() => {

    Route.post('/questions', 'Api/QuestionsController.create')

    Route.post('/servicesTypes', 'Api/Services/ServicesTypesController.all')

    Route.post('/realEstateTypes', 'Api/RealEstates/RealEstateTypesController.all')

    Route.group(() => {

      Route.post('', 'Api/NewsController.all')
      Route.post('/random', 'Api/NewsController.random')
      Route.post('/:slug', 'Api/NewsController.get')

    }).prefix('/news')

    Route.group(() => {

      Route.post('/', 'Api/RealEstates/RealEstatesController.all')
      Route.post('/create', 'Api/RealEstates/RealEstatesController.create')
      Route.post('/popular', 'Api/RealEstates/RealEstatesController.popular')
      Route.post('/recommended', 'Api/RealEstates/RealEstatesController.recommended')
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

    Route.group(() => {

      Route.post('/', 'Api/Users/UsersReviewsController.paginate')
      Route.post('/add', 'Api/Users/UsersReviewsController.add')
      Route.patch(':id', 'Api/Users/UsersReviewsController.update')
      Route.delete(':id', 'Api/Users/UsersReviewsController.delete')

    }).prefix('/usersReviews')

    Route.group(() => {

      Route.post('/', 'Api/Users/UsersReportsController.add')
      Route.delete('/', 'Api/Users/UsersReportsController.delete')

    }).prefix('/usersReports')

    Route.group(() => {

      Route.post('/', 'Api/Users/UsersReviewsReportsController.add')
      Route.delete('/', 'Api/Users/UsersReviewsReportsController.delete')

    }).prefix('/usersReviewsReports')

    Route.group(() => {

      Route.post('/:id', 'Api/Users/UsersController.get')
      Route.patch('/update/:uuid', 'Api/Users/UsersController.update')
      Route.delete('/deleteAvatar/:uuid', 'Api/Users/UsersController.deleteAvatar')

    }).prefix('/users')

    Route.group(() => {

      Route.post('/', 'Api/Services/ServicesController.all')
      Route.post('/add', 'Api/Services/ServicesController.add')
      Route.patch('/:id', 'Api/Services/ServicesController.update')
      Route.delete('/:id', 'Api/Services/ServicesController.delete')

    }).prefix('/services')

  }).middleware('CheckAccessToken')

}).prefix('/api')
