<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jenis_permohonan', function (Blueprint $table) {
            $table->id('idJenisPermohonan'); // Primary Key
            $table->unsignedBigInteger('parentid')->nullable(); // Jika ada relasi parent-child
            $table->string('jenisPermohonan');
            $table->text('keterangan')->nullable();
            $table->timestamps(); // Untuk created_at dan updated_at
            $table->softDeletes(); // Untuk isDeleted (akan membuat kolom deleted_at)

            // Jika parentid adalah foreign key ke tabel ini sendiri (self-referencing)
            // $table->foreign('parentid')->references('idJenisPermohonan')->on('jenis_permohonan')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('jenis_permohonan');
    }
};