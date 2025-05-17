<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JangkaWaktuSewa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'jangka_waktu_sewa';
    protected $primaryKey = 'idJangkaWaktuSewa';

    protected $fillable = [
        'idJenisJangkaWaktu',
        'jangkaWaktu',
        'keterangan',
        'isDefault',
    ];

    protected $casts = [
        'isDefault' => 'boolean',
    ];

    /**
     * Get the jenis jangka waktu that owns the jangka waktu sewa.
     */
    public function jenisJangkaWaktu()
    {
        return $this->belongsTo(JenisJangkaWaktu::class, 'idJenisJangkaWaktu', 'idJenisJangkaWaktu');
    }
}