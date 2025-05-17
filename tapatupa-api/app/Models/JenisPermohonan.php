<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Pastikan ini ada jika menggunakan softDeletes() di migration

class JenisPermohonan extends Model
{
    use HasFactory, SoftDeletes; // Tambahkan SoftDeletes jika belum

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'jenis_permohonan'; // Eksplisit mendefinisikan nama tabel

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'idJenisPermohonan'; // Eksplisit mendefinisikan primary key

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    // public $incrementing = true; // true adalah default untuk integer primary keys

    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    // protected $keyType = 'int'; // 'int' adalah default

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    // public $timestamps = true; // true adalah default jika tabel punya created_at dan updated_at

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'jenisPermohonan',
        'keterangan',
        'parentid', // Pastikan nama kolom ini sesuai dengan yang ada di database dan migration
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    // protected $casts = [
    //     'parentid' => 'integer', // Jika parentid selalu integer
    // ];

    // Definisikan relasi jika ada (misal, ke parent atau child)
    // public function parent()
    // {
    //     return $this->belongsTo(JenisPermohonan::class, 'parentid');
    // }

    // public function children()
    // {
    //     return $this->hasMany(JenisPermohonan::class, 'parentid');
    // }
}