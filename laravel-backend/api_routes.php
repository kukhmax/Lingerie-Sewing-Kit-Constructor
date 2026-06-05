<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConstructorController;

/*
|--------------------------------------------------------------------------
| API Routes for Sewing Kit Constructor
|--------------------------------------------------------------------------
|
| These routes should be registered inside routes/api.php of your Laravel application.
| They handle materials retrieval and cart actions.
|
*/

Route::prefix('constructor')->group(function () {
    // 1. Get all materials available for the constructor
    Route::get('/materials', [ConstructorController::class, 'getMaterials'])->name('api.constructor.materials');
    
    // 2. Add selected kit to the shopping cart
    Route::post('/cart/add', [ConstructorController::class, 'addToCart'])->name('api.constructor.cart.add');
});
