<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wajib_retribusi', function (Blueprint $table) {
            $table->id('idWajibRetribusi');
            $table->string('NIK')->unique();
            $table->string('namaWajibRetribusi');
            $table->string('Pekerjaan')->nullable();
            $table->text('alamat')->nullable();
            $table->string('nomorPonsel')->nullable();
            $table->string('nomorWhatsapp')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('fileFoto')->nullable(); // Path ke foto
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wajib_retribusi');
    }
};