<?php

namespace App\Services;

use App\Models\Product;

/**
 * Мост между конструктором и корзиной магазина.
 * Положить в app/Services/ConstructorCart.php и привязать реализацию в AppServiceProvider:
 *
 *   $this->app->bind(\App\Services\ConstructorCart::class, \App\Services\SessionConstructorCart::class);
 *
 * Контроллер ничего не знает об устройстве корзины — только этот интерфейс.
 */
interface ConstructorCart
{
    /** Добавить товар в корзину текущего покупателя. Цена берётся из $product, не из запроса. */
    public function add(Product $product, float $quantity): void;

    /** Сколько единиц товара можно купить; null — остатки не отслеживаются. */
    public function availableQuantity(Product $product): ?float;

    /** Адрес страницы корзины (тот же домен). */
    public function url(): string;
}
