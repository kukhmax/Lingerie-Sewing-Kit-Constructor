<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/**
 * Проверка запроса POST /constructor/cart.
 * Положить в app/Http/Requests/ConstructorAddToCartRequest.php
 */
class ConstructorAddToCartRequest extends FormRequest
{
    /** Максимум позиций в одном запросе (3 изделия × до 9 деталей). */
    public const MAX_ITEMS = 30;

    /** Максимальное количество одной позиции (метров / штук). */
    public const MAX_QUANTITY = 50;

    public function authorize(): bool
    {
        // Корзина доступна и гостям. Если покупать могут только вошедшие — верните auth()->check().
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1', 'max:' . self::MAX_ITEMS],
            'items.*' => ['required', 'array:product_id,quantity'],
            'items.*.product_id' => [
                'required',
                'integer',
                'distinct',
                // товар существует И разрешён в конструкторе
                Rule::exists('products', 'id')->where('is_constructor_compatible', true),
            ],
            'items.*.quantity' => ['required', 'numeric', 'gt:0', 'max:' . self::MAX_QUANTITY],
        ];
    }

    /**
     * Количество должно быть кратно шагу продажи товара:
     * метры — по 0.1, штуки / комплекты / пары — только целые.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $items = $this->input('items', []);
            $steps = Product::query()
                ->whereIn('id', array_column($items, 'product_id'))
                ->pluck('sale_step', 'id');

            foreach ($items as $index => $item) {
                $step = (float) ($steps[$item['product_id']] ?? 1);
                $ratio = (float) $item['quantity'] / ($step > 0 ? $step : 1);

                if (abs($ratio - round($ratio)) > 1e-6) {
                    $validator->errors()->add(
                        "items.$index.quantity",
                        "Ilość musi być wielokrotnością {$step}."
                    );
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Zestaw jest pusty.',
            'items.max' => 'Zbyt wiele pozycji w jednym zestawie.',
            'items.*.product_id.exists' => 'Wybrany materiał nie jest już dostępny w konstruktorze.',
            'items.*.product_id.distinct' => 'Ten sam materiał występuje na liście więcej niż raz.',
            'items.*.quantity.max' => 'Zbyt duża ilość jednego materiału.',
        ];
    }
}
