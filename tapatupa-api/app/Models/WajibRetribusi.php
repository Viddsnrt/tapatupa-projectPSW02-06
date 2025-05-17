<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WajibRetribusi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'wajib_retribusi';
    protected $primaryKey = 'idWajibRetribusi';

    protected $fillable = [
        'NIK',
        'namaWajibRetribusi',
        'Pekerjaan',
        'alamat',
        'nomorPonsel',
        'nomorWhatsapp',
        'email',
        'fileFoto', // Jika hanya menyimpan path
    ];

    public function permohonanSewas()
    {
        return $this->hasMany(PermohonanSewa::class, 'idWajibRetribusi', 'idWajibRetribusi');
    }
}