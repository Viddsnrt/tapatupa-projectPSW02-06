<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Status extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'statuses'; // Nama tabel di database
    protected $primaryKey = 'idStatus';

    protected $fillable = [
        'idJenisStatus',
        'namaStatus',
        'keteranganStatus',
        'createBy',
    ];

    /**
     * Get the jenis status associated with the status.
     */
    public function jenisStatus()
    {
        return $this->belongsTo(JenisStatus::class, 'idJenisStatus', 'idJenisStatus');
    }

    /**
     * Get the user who created/updated the status.
     */
    public function creator()
    {
        // Pastikan model User ada dan PK-nya 'userId'
        return $this->belongsTo(User::class, 'createBy', 'userId');
    }

    /**
     * Get the permohonan sewa that use this status.
     */
    public function permohonanSewas()
    {
        return $this->hasMany(PermohonanSewa::class, 'idStatus', 'idStatus');
    }
}