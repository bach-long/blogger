<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use App\Models\Category;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/signup', [AuthController::class, 'signup']);

Route::get('/user/{id}/articles', [UserController::class, 'getArticles']);
Route::get('/user/{id}/info', [UserController::class, 'getInfo']);
Route::get('/user/{id}/bookmark', [UserController::class, 'getBookmark']);
Route::get('/user/{id}/statistic', [UserController::class, 'statistic']);

Route::middleware('auth:sanctum')->group( function () {
    Route::post('/article/create', [ArticleController::class, 'createArticle']);
    Route::get('/me', [UserController::class, 'me']);
    Route::post('/bookmark', [UserController::class, 'toggleBookmark']);
    Route::post('/follow', [UserController::class, 'toggleFollow']);
    Route::post('/react', [UserController::class, 'toggleLike']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user/edit', [UserController::class, 'editProfile']);
    Route::post('/article/edit', [ArticleController::class, 'editArticle']);
    Route::post('/upload', [UploadController::class, 'handleUpload']);
    Route::post('/comment', [UserController::class, 'comment']);
    Route::post('/comment/edit', [UserController::class, 'editComment']);
    Route::post('/image/delete', [UploadController::class, 'deleteImage']);
    Route::post('/notification/send', [NotificationController::class, 'notify']);
    Route::get('/notification/all', [UserController::class, 'getAllNotifications']);
});

Route::get('/article/all', [ArticleController::class, 'getAll']);
Route::get('/category/{categoryId}/articles', [CategoryController::class, 'getArticlesByCategoryId']);
Route::get('/article/mostviewed', [ArticleController::class, 'getMostViewedArticles']);
Route::get('/article/recent', [ArticleController::class, 'getRecentArticles']);
Route::get('/article/related/{categoryId}', [ArticleController::class, 'getRelatedArticles']); 
Route::get('/article/{id}', [ArticleController::class, 'getById']);
Route::get('/article/{articleId}/comments', [ArticleController::class, 'getComments']);

Route::post('/search', [SearchController::class, 'search']);

Route::get('/category/all', [CategoryController::class, 'getAll']);

Route::get('/test-recursive', function() {
    dump(Category::find(1)->articles()->paginate(10));
});
