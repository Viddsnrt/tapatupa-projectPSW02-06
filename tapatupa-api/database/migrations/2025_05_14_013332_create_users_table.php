<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('userId'); // Primary Key sesuai ERD
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('token')->nullable();
            $table->text('keterangan')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes(); // Jika ingin menggunakan soft delete untuk user
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};