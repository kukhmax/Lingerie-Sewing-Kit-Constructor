<?php

namespace App\Services;

use App\Models\Product;

/**
 * Пример реализации: корзина в сессии Laravel.
 * Если в магазине уже есть своя корзина (пакет или таблица в БД) —
 * напишите такой же класс, который вызывает её методы, и привяжите его вместо этого.
 */
class SessionConstructorCart implements ConstructorCart
{
    private const KEY = 'cart.items';

    public function add(Product $product, float $quantity): void
    {
        $items = session(self::KEY, []);
        $current = (float) ($items[$product->id]['quantity'] ?? 0);

        $items[$product->id] = [
            'product_id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'unit' => $product->consumption_unit,
            'quantity' => round($current + $quantity, 2),
            'from_constructor' => true,
        ];

        session([self::KEY => $items]);
    }

    public function availableQuantity(Product $product): ?float
    {
        // Замените на реальную колонку остатков. null = не ограничиваем.
        return isset($product->stock_quantity) ? (float) $product->stock_quantity : null;
    }

    public function url(): string
    {
        return url('/cart');
    }
}
