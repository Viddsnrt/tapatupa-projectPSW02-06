<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peruntukan_sewa', function (Blueprint $table) {
            $table->id('idPeruntukanSewa');
            $table->unsignedBigInteger('idObjekRetribusi');
            $table->unsignedBigInteger('idJenisJangkaWaktu');
            $table->string('jenisKegiatan');
            $table->text('keteranganPeruntukan')->nullable();
            $table->integer('lamaSewa')->nullable()->comment('Durasi sewa, unit tergantung Jenis Jangka Waktu');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('idObjekRetribusi')
                  ->references('idObjekRetribusi') // Pastikan PK di tabel objek_retribusi adalah idObjekRetribusi
                  ->on('objek_retribusi')
                  ->onDelete('cascade');

            $table->foreign('idJenisJangkaWaktu')
                  ->references('idJenisJangkaWaktu')
                  ->on('jenis_jangka_waktu')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peruntukan_sewa');
    }
};