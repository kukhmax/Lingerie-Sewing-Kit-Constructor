<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConstructorAddToCartRequest;
use App\Http\Resources\ConstructorMaterialResource;
use App\Models\Product; // замените на реальную модель товара
use App\Services\ConstructorCart;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Throwable;

class ConstructorController extends Controller
{
    /** Сколько секунд кэшируется каталог. */
    private const CATALOG_TTL = 300;

    /**
     * GET /constructor/materials
     * Каталог материалов, доступных в конструкторе.
     */
    public function materials(): JsonResponse
    {
        try {
            $materials = Cache::remember('constructor.materials', self::CATALOG_TTL, function () {
                $products = Product::query()
                    ->where('is_constructor_compatible', true)
                    ->orderBy('constructor_category')
                    ->orderBy('name')
                    ->get();

                return ConstructorMaterialResource::collection($products)->resolve();
            });

            return response()->json($materials);
        } catch (Throwable $e) {
            // Подробности — только в лог. Клиенту текст исключения не отдаём.
            report($e);

            return response()->json(['message' => 'Nie udało się pobrać materiałów.'], 500);
        }
    }

    /**
     * POST /constructor/cart
     * Тело: { "items": [ { "product_id": 17, "quantity": 0.5 }, ... ] }
     *
     * Формат, количество и существование товаров уже проверены в ConstructorAddToCartRequest.
     * Цена НИКОГДА не берётся из запроса — только из базы.
     */
    public function addToCart(ConstructorAddToCartRequest $request, ConstructorCart $cart): JsonResponse
    {
        $items = collect($request->validated('items'));

        try {
            $products = Product::query()
                ->whereIn('id', $items->pluck('product_id'))
                ->where('is_constructor_compatible', true)
                ->get()
                ->keyBy('id');

            // Проверяем остатки по всем позициям ДО изменения корзины: либо добавляется всё, либо ничего
            $errors = [];
            foreach ($items as $index => $item) {
                $product = $products->get($item['product_id']);
                $available = $cart->availableQuantity($product);
                if ($available !== null && (float) $item['quantity'] > $available) {
                    $errors["items.$index.quantity"] = ["Produkt „{$product->name}” — dostępne tylko {$available} {$product->consumption_unit}."];
                }
            }
            if ($errors !== []) {
                return response()->json([
                    'success' => false,
                    'message' => 'Niektóre materiały nie są dostępne w wybranej ilości.',
                    'errors' => $errors,
                ], 422);
            }

            DB::transaction(function () use ($items, $products, $cart) {
                foreach ($items as $item) {
                    $cart->add($products->get($item['product_id']), (float) $item['quantity']);
                }
            });

            return response()->json([
                'success' => true,
                'added_items_count' => $items->count(),
                'cart_url' => $cart->url(),
            ]);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Nie udało się dodać do koszyka.',
            ], 500);
        }
    }
}
