<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JenisObjekRetribusi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'jenis_objek_retribusi';
    protected $primaryKey = 'idJenisObjekRetribusi';

    protected $fillable = [
        'jenisObjekRetribusi',
        'keterangan',
    ];

    public function objekRetribusis()
    {
        return $this->hasMany(ObjekRetribusi::class, 'idJenisObjekRetribusi', 'idJenisObjekRetribusi');
    }
}