<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ObjekRetribusi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'objek_retribusi';
    protected $primaryKey = 'idObjekRetribusi';

    protected $fillable = [
        'idLokasiObjekRetribusi',
        'idJenisObjekRetribusi',
        'kodeObjekRetribusi',
        'namaObjekRetribusi',
        'noBangunan',
        'jumlahLantai',
        'panjangTanah',
        'lebarTanah',
        'luasTanah',
        'panjangBangunan',
        'lebarBangunan',
        'luasBangunan',
        'alamatObjek',
        'latitute',
        'longitude',
        'keteranganObjek',
        'gambarDenahTanah', // Untuk path manual dulu
    ];

    protected $casts = [
        'jumlahLantai' => 'integer',
        'panjangTanah' => 'decimal:2',
        'lebarTanah' => 'decimal:2',
        'luasTanah' => 'decimal:2',
        'panjangBangunan' => 'decimal:2',
        'lebarBangunan' => 'decimal:2',
        'luasBangunan' => 'decimal:2',
    ];

    public function lokasiObjekRetribusi()
    {
        return $this->belongsTo(LokasiObjekRetribusi::class, 'idLokasiObjekRetribusi', 'idLokasiObjekRetribusi');
    }

    public function jenisObjekRetribusi()
    {
        return $this->belongsTo(JenisObjekRetribusi::class, 'idJenisObjekRetribusi', 'idJenisObjekRetribusi');
    }

    public function peruntukanSewas()
    {
        return $this->hasMany(PeruntukanSewa::class, 'idObjekRetribusi', 'idObjekRetribusi');
    }

    public function tarifObjekRetribusis()
    {
        return $this->hasMany(TarifObjekRetribusi::class, 'idObjekRetribusi', 'idObjekRetribusi');
    }
}