<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConstructorFieldsToProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Flag to indicate if product is available in the constructor
            $table->boolean('is_constructor_compatible')->default(false)->after('id');
            
            // Raw material category in constructor: fabric, elastic, hardware, closure
            $table->string('category_constructor_assigned', 50)->nullable()->after('is_constructor_compatible');
            
            // Hex color code for rendering on SVG paths (e.g. #047857)
            $table->string('color_hex', 7)->default('#d1d5db')->after('category_constructor_assigned');
            
            // Unit of measurement: m (meters), pcs (pieces), sets
            $table->string('consumption_unit', 10)->default('m')->after('color_hex');
            
            // Standard consumption needed for 1 garment (e.g. 1.5 meters)
            $table->decimal('standard_consumption_qty', 5, 2)->default(1.00)->after('consumption_unit');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'is_constructor_compatible',
                'category_constructor_assigned',
                'color_hex',
                'consumption_unit',
                'standard_consumption_qty'
            ]);
        });
    }
}
