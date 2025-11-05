<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('full_name');
            $table->string('email')->unique('email');
            $table->string('password');
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->boolean('email_verified')->nullable()->default(false);
            $table->string('verification_token')->nullable();
            $table->dateTime('token_expires_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
