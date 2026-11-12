<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Форма одного материала в ответе GET /constructor/materials.
 * Положить в app/Http/Resources/ConstructorMaterialResource.php
 *
 * Имена ключей — контракт с фронтендом (frontend/src/api.js → normalizeProduct).
 */
class ConstructorMaterialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->constructor_category,           // fabric | elastic | underwire | hardware | closure
            'type' => $this->constructor_type,                   // lace | microfiber | mesh | cotton | satin | strap | band | tunnel | wire | null
            'colorName' => $this->color_name,
            'colorHex' => $this->color_hex,                      // "#047857"
            'price' => (float) $this->price,                     // цена за единицу, число
            'unit' => $this->consumption_unit,                   // m | szt | kpl | para
            'step' => (float) $this->sale_step,                  // минимальный шаг продажи
            'description' => $this->short_description,
            'image' => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'url' => route('products.show', $this->slug),        // замените на маршрут карточки товара
            'inStock' => (bool) $this->is_in_stock,              // замените на свою проверку остатков
            'parts' => $this->constructor_parts,                 // ["bra.cups", ...] или null — тогда правило категория+тип
            'palettes' => $this->constructor_palettes,           // ["emerald", ...] или null
        ];
    }
}
