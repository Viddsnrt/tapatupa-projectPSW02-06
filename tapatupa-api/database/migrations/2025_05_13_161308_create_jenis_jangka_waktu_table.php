<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('jenis_jangka_waktu', function (Blueprint $table) {
        $table->id('idJenisJangkaWaktu');
        $table->string('jenisJangkaWaktu');
        $table->text('keterangan')->nullable();
        $table->timestamps();
        $table->softDeletes();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_jangka_waktu_tables');
    }
};
