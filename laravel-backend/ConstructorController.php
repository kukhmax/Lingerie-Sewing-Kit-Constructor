<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product; // Adjust to your actual Product model namespace
use Illuminate\Support\Facades\Log;

class ConstructorController extends Controller
{
    /**
     * Get all constructor-compatible products from the database.
     * Accessible via GET /api/constructor/materials
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMaterials()
    {
        try {
            // Retrieve only products flagged as constructor-compatible
            $materials = Product::where('is_constructor_compatible', true)
                ->select([
                    'id',
                    'name',
                    'category_constructor_assigned as category', // fabric, elastic, hardware, closure
                    'color_hex as colorHex',                     // e.g. #047857
                    'price',                                     // base price per unit
                    'consumption_unit as unit',                  // m, pcs, set
                    'standard_consumption_qty as standard_qty',  // default qty needed
                    'image_path'                                 // path to catalog image
                ])
                ->get();

            return response()->json($materials, 200);
        } catch (\Exception $e) {
            Log::error('Constructor materials fetch failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Nie udało się pobrać materiałów.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add the custom-assembled kit items to the cart.
     * Accessible via POST /api/constructor/cart/add
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addToCart(Request $request)
    {
        // Validate payload format
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        try {
            $itemsToAdd = $request->input('items');
            $addedCount = 0;

            foreach ($itemsToAdd as $item) {
                // Fetch the product to verify active status and price
                $product = Product::find($item['product_id']);
                
                if (!$product) {
                    return response()->json([
                        'error' => "Produkt o ID {$item['product_id']} nie istnieje."
                    ], 422);
                }

                // Add to your custom cart system
                // (e.g. Darryldecode Cart, WooCommerce-like Session, or DB-based Cart)
                
                // Example using a generic Cart manager:
                // \Cart::add([
                //     'id' => $product->id,
                //     'name' => $product->name,
                //     'price' => $product->price,
                //     'quantity' => $item['quantity'],
                //     'attributes' => [
                //         'color' => $product->color_hex,
                //         'constructor' => true
                //     ]
                // ]);

                $addedCount++;
            }

            return response()->json([
                'success' => true,
                'message' => 'Twój zestaw został pomyślnie dodany do koszyka!',
                'added_items_count' => $addedCount,
                'redirect_url' => '/cart' // Path to standard cart page for redirect
            ], 200);

        } catch (\Exception $e) {
            Log::error('Constructor cart add failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Błąd podczas dodawania do koszyka.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
