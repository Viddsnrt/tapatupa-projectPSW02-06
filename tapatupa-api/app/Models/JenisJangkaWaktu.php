<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JenisJangkaWaktu extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'jenis_jangka_waktu';
    protected $primaryKey = 'idJenisJangkaWaktu';

    protected $fillable = [
        'jenisJangkaWaktu',
        'keterangan',
    ];

    // Definisikan relasi jika ada (misal, ke PeruntukanSewa, JangkaWaktuSewa, TarifObjekRetribusi)
    // public function peruntukanSewas() { return $this->hasMany(PeruntukanSewa::class, 'idJenisJangkaWaktu'); }
    // public function jangkaWaktuSewas() { return $this->hasMany(JangkaWaktuSewa::class, 'idJenisJangkaWaktu'); }
    // public function tarifObjekRetribusis() { return $this->hasMany(TarifObjekRetribusi::class, 'idJenisJangkaWaktu'); }
}