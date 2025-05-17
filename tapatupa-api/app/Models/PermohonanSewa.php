<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PermohonanSewa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'permohonan_sewa';
    protected $primaryKey = 'idPermohonanSewa';

    protected $fillable = [
        'idJenisPermohonan',
        'nomorSuratPermohonan',
        'tanggalPengajuan',
        'idWajibRetribusi',
        'idPeruntukanSewa',
        'idStatus',
        'createBy',
    ];

    protected $casts = [
        'tanggalPengajuan' => 'date:Y-m-d', // Penting untuk konsistensi format
    ];

    public function jenisPermohonan()
    {
        return $this->belongsTo(JenisPermohonan::class, 'idJenisPermohonan', 'idJenisPermohonan');
    }

    public function wajibRetribusi()
    {
        return $this->belongsTo(WajibRetribusi::class, 'idWajibRetribusi', 'idWajibRetribusi');
    }

    public function peruntukanSewa()
    {
        // Eager load relasi dari peruntukanSewa agar mudah diakses
        return $this->belongsTo(PeruntukanSewa::class, 'idPeruntukanSewa', 'idPeruntukanSewa')
                    ->with(['objekRetribusi', 'jenisJangkaWaktu']);
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'idStatus', 'idStatus')->with('jenisStatus');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'createBy', 'userId');
    }
}