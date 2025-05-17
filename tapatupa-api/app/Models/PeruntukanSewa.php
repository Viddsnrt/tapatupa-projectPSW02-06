<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PeruntukanSewa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'peruntukan_sewa';
    protected $primaryKey = 'idPeruntukanSewa';

    protected $fillable = [
        'idObjekRetribusi',
        'idJenisJangkaWaktu',
        'jenisKegiatan',
        'keteranganPeruntukan',
        'lamaSewa',
    ];

    protected $casts = [
        'lamaSewa' => 'integer',
    ];

    public function objekRetribusi()
    {
        // Pastikan model ObjekRetribusi ada dan PK-nya 'idObjekRetribusi'
        return $this->belongsTo(ObjekRetribusi::class, 'idObjekRetribusi', 'idObjekRetribusi');
    }

    public function jenisJangkaWaktu()
    {
        return $this->belongsTo(JenisJangkaWaktu::class, 'idJenisJangkaWaktu', 'idJenisJangkaWaktu');
    }

    public function permohonanSewas()
    {
        return $this->hasMany(PermohonanSewa::class, 'idPeruntukanSewa', 'idPeruntukanSewa');
    }
}