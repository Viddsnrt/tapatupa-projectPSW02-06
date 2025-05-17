<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JenisStatus extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'jenis_status';
    protected $primaryKey = 'idJenisStatus';

    protected $fillable = [
        'jenisStatus',
        'keterangan',
    ];

    // Relasi ke tabel 'statuses' (Model Status)
    public function statuses()
    {
        // Asumsi nama foreign key di tabel 'statuses' adalah 'idJenisStatus'
        return $this->hasMany(Status::class, 'idJenisStatus', 'idJenisStatus');
    }
}