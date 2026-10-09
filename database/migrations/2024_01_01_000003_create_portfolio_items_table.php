<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('client')->default('[CLIENT_NAME]');
            $table->string('category'); // e.g. 'Scripting Review', 'Game Concept'
            $table->string('accent_color')->default('peach'); // tailwind token name
            $table->text('summary');     // short card description
            $table->text('problem');     // detail page
            $table->text('approach');    // detail page
            $table->text('outcome');     // detail page with [PROJECT_RESULT] placeholders
            $table->json('tools_used');  // array of tool names
            $table->boolean('is_featured')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_items');
    }
};
