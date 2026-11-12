<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Поля товара, нужные конструктору. Положить в database/migrations/.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Показывать ли товар в конструкторе
            $table->boolean('is_constructor_compatible')->default(false)->index();

            // Категория: fabric | elastic | underwire | hardware | closure
            $table->string('constructor_category', 20)->nullable();

            // Тип внутри категории: lace | microfiber | mesh | cotton | satin | strap | band | tunnel | wire
            $table->string('constructor_type', 20)->nullable();

            // Цвет для закраски детали на рисунке и его название
            $table->string('color_hex', 7)->default('#d1d5db');
            $table->string('color_name', 60)->nullable();

            // Единица продажи (m | szt | kpl | para) и минимальный шаг (0.10 для метров, 1 для штук)
            $table->string('consumption_unit', 10)->default('m');
            $table->decimal('sale_step', 5, 2)->default(1.00);

            // Необязательно: явный список деталей ["bra.cups", "panties.front"].
            // Если пусто — совместимость определяется по категории и типу.
            $table->json('constructor_parts')->nullable();

            // Необязательно: в какие готовые палитры входит товар ["emerald", "wine"]
            $table->json('constructor_palettes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'is_constructor_compatible',
                'constructor_category',
                'constructor_type',
                'color_hex',
                'color_name',
                'consumption_unit',
                'sale_step',
                'constructor_parts',
                'constructor_palettes',
            ]);
        });
    }
};
