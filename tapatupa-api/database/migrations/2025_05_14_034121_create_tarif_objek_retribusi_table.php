<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarif_objek_retribusi', function (Blueprint $table) {
            $table->id('idTarifObjekRetribusi');
            $table->unsignedBigInteger('idObjekRetribusi');
            $table->unsignedBigInteger('idJenisJangkaWaktu');
            $table->date('tanggalDinilai');
            $table->string('namaPenilai')->nullable();
            $table->decimal('nominalTarif', 15, 2);
            $table->string('fileHasilPenilaian')->nullable(); // Path ke file
            $table->text('keterangan')->nullable();
            $table->boolean('isDefault')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('idObjekRetribusi')
                  ->references('idObjekRetribusi')
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
        Schema::dropIfExists('tarif_objek_retribusi');
    }
};