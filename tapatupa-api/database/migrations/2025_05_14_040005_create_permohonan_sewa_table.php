<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permohonan_sewa', function (Blueprint $table) {
            $table->id('idPermohonanSewa');
            $table->unsignedBigInteger('idJenisPermohonan');
            $table->string('nomorSuratPermohonan')->unique();
            $table->date('tanggalPengajuan');
            $table->unsignedBigInteger('idWajibRetribusi');
            $table->unsignedBigInteger('idPeruntukanSewa');
            $table->unsignedBigInteger('idStatus');
            $table->unsignedBigInteger('createBy')->nullable(); // User yang input/membuat
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('idJenisPermohonan')->references('idJenisPermohonan')->on('jenis_permohonan')->onDelete('restrict');
            $table->foreign('idWajibRetribusi')->references('idWajibRetribusi')->on('wajib_retribusi')->onDelete('restrict');
            $table->foreign('idPeruntukanSewa')->references('idPeruntukanSewa')->on('peruntukan_sewa')->onDelete('restrict');
            $table->foreign('idStatus')->references('idStatus')->on('statuses')->onDelete('restrict');
            $table->foreign('createBy')->references('userId')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permohonan_sewa');
    }
};