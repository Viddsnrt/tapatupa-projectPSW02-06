<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pastikan tabel 'users' dan 'jenis_status' sudah ada sebelum menjalankan migrasi ini
        Schema::create('statuses', function (Blueprint $table) {
            $table->id('idStatus');
            $table->unsignedBigInteger('idJenisStatus');
            $table->string('namaStatus');
            $table->text('keteranganStatus')->nullable();
            $table->unsignedBigInteger('createBy')->nullable(); // User yang membuat/mengupdate status
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('idJenisStatus')
                  ->references('idJenisStatus')
                  ->on('jenis_status')
                  ->onDelete('cascade'); // atau restrict

            $table->foreign('createBy')
                  ->references('userId') // Pastikan primary key di tabel 'users' adalah 'userId'
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('statuses');
    }
};