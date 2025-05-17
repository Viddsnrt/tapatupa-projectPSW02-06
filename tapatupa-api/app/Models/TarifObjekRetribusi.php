<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TarifObjekRetribusi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tarif_objek_retribusi';
    protected $primaryKey = 'idTarifObjekRetribusi';

    protected $fillable = [
        'idObjekRetribusi',
        'idJenisJangkaWaktu',
        'tanggalDinilai',
        'namaPenilai',
        'nominalTarif',
        'fileHasilPenilaian', // Untuk path manual dulu
        'keterangan',
        'isDefault',
    ];

    protected $casts = [
        'tanggalDinilai' => 'date:Y-m-d', // Format saat mengambil dan menyimpan
        'nominalTarif' => 'decimal:2',
        'isDefault' => 'boolean',
    ];

    public function objekRetribusi()
    {
        return $this->belongsTo(ObjekRetribusi::class, 'idObjekRetribusi', 'idObjekRetribusi');
    }

    public function jenisJangkaWaktu()
    {
        return $this->belongsTo(JenisJangkaWaktu::class, 'idJenisJangkaWaktu', 'idJenisJangkaWaktu');
    }
}