<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jangka_waktu_sewa', function (Blueprint $table) {
            $table->id('idJangkaWaktuSewa');
            $table->unsignedBigInteger('idJenisJangkaWaktu');
            $table->string('jangkaWaktu'); // Misal: "1 Tahun", "6 Bulan", "Harian"
            $table->text('keterangan')->nullable();
            $table->boolean('isDefault')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('idJenisJangkaWaktu')
                  ->references('idJenisJangkaWaktu')
                  ->on('jenis_jangka_waktu') // Pastikan tabel 'jenis_jangka_waktu' sudah ada
                  ->onDelete('cascade'); // Atau onDelete('restrict') sesuai kebutuhan
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jangka_waktu_sewa');
    }
};