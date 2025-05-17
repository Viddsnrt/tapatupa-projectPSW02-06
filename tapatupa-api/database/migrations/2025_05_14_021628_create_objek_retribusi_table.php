<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('objek_retribusi', function (Blueprint $table) {
            $table->id('idObjekRetribusi');
            $table->unsignedBigInteger('idLokasiObjekRetribusi');
            $table->unsignedBigInteger('idJenisObjekRetribusi');
            $table->string('kodeObjekRetribusi')->unique()->nullable();
            $table->string('namaObjekRetribusi');
            $table->string('noBangunan')->nullable();
            $table->integer('jumlahLantai')->nullable();
            $table->decimal('panjangTanah', 10, 2)->nullable();
            $table->decimal('lebarTanah', 10, 2)->nullable();
            $table->decimal('luasTanah', 12, 2)->nullable();
            $table->decimal('panjangBangunan', 10, 2)->nullable();
            $table->decimal('lebarBangunan', 10, 2)->nullable();
            $table->decimal('luasBangunan', 12, 2)->nullable();
            $table->text('alamatObjek');
            $table->string('latitute')->nullable();
            $table->string('longitude')->nullable();
            $table->text('keteranganObjek')->nullable();
            $table->string('gambarDenahTanah')->nullable(); // Path ke gambar
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('idLokasiObjekRetribusi')
                  ->references('idLokasiObjekRetribusi')
                  ->on('lokasi_objek_retribusi')
                  ->onDelete('cascade');

            $table->foreign('idJenisObjekRetribusi')
                  ->references('idJenisObjekRetribusi')
                  ->on('jenis_objek_retribusi')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('objek_retribusi');
    }
};