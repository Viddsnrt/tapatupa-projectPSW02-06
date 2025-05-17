<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LokasiObjekRetribusi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'lokasi_objek_retribusi';
    protected $primaryKey = 'idLokasiObjekRetribusi';

    protected $fillable = [
        'lokasiObjekRetribusi',
        'keterangan',
    ];

    // Relasi ke ObjekRetribusi (jika diperlukan nanti)
    public function objekRetribusis()
    {
        return $this->hasMany(ObjekRetribusi::class, 'idLokasiObjekRetribusi', 'idLokasiObjekRetribusi');
    }
}