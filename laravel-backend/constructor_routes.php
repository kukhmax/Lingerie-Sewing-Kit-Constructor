<?php

use App\Http\Controllers\ConstructorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Маршруты конструктора наборов — подключать в routes/web.php
|--------------------------------------------------------------------------
|
| ВАЖНО: именно web.php, а не api.php. Корзина магазина живёт в сессии,
| а группа "web" даёт сессию, cookies и проверку CSRF-токена.
| В api.php сессии нет — корзина не привязалась бы к покупателю.
|
|   require base_path('routes/constructor_routes.php');   // в конце routes/web.php
|
*/

Route::prefix('constructor')->name('constructor.')->group(function () {
    // Страница с конструктором (Blade-шаблон resources/views/constructor.blade.php)
    Route::view('/', 'constructor')->name('page');

    // Каталог материалов: только чтение, 60 запросов в минуту с одного IP
    Route::get('/materials', [ConstructorController::class, 'materials'])
        ->middleware('throttle:60,1')
        ->name('materials');

    // Добавление в корзину: 20 запросов в минуту, CSRF проверяется группой "web"
    Route::post('/cart', [ConstructorController::class, 'addToCart'])
        ->middleware('throttle:20,1')
        ->name('cart.add');
});
