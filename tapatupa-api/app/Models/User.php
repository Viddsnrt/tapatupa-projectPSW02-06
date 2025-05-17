<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail; // Jika menggunakan verifikasi email
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Untuk Sanctum API tokens
use Illuminate\Database\Eloquent\SoftDeletes; // Jika pakai soft delete

class User extends Authenticatable // implements MustVerifyEmail (jika perlu)
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes; // Tambahkan SoftDeletes

    protected $primaryKey = 'userId'; // Sesuaikan Primary Key

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'token',
        'keterangan',
        // 'name', // Jika ada field nama terpisah dari username
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Otomatis hash jika di-assign langsung di Laravel 10+
    ];

    // Definisikan relasi lain jika ada, contoh:
    // public function createdStatuses()
    // {
    //     return $this->hasMany(Status::class, 'createBy', 'userId');
    // }
}