<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JenisPermohonanController;
use App\Http\Controllers\Api\JenisJangkaWaktuController; 
use App\Http\Controllers\Api\LokasiObjekRetribusiController;
use App\Http\Controllers\Api\JenisObjekRetribusiController;
use App\Http\Controllers\Api\JenisStatusController;
use App\Http\Controllers\Api\WajibRetribusiController;
use App\Http\Controllers\Api\JangkaWaktuSewaController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PeruntukanSewaController;
use App\Http\Controllers\Api\ObjekRetribusiController; 
use App\Http\Controllers\Api\TarifObjekRetribusiController;
use App\Http\Controllers\Api\PermohonanSewaController;
// Import controller lainnya di sini

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Contoh untuk Jenis Permohonan
Route::apiResource('jenis-permohonan', JenisPermohonanController::class);
Route::apiResource('jenis-jangka-waktu', JenisJangkaWaktuController::class);
Route::apiResource('lokasi-objek-retribusi', LokasiObjekRetribusiController::class);
Route::apiResource('jenis-objek-retribusi', JenisObjekRetribusiController::class);
Route::apiResource('jenis-status', JenisStatusController::class);
Route::apiResource('wajib-retribusi', WajibRetribusiController::class);
Route::apiResource('jangka-waktu-sewa', JangkaWaktuSewaController::class);
Route::apiResource('statuses', StatusController::class); 
Route::apiResource('users', UserController::class);
Route::apiResource('peruntukan-sewa', PeruntukanSewaController::class); 
Route::apiResource('objek-retribusi', ObjekRetribusiController::class);
Route::apiResource('tarif-objek-retribusi', TarifObjekRetribusiController::class);
Route::apiResource('permohonan-sewa', PermohonanSewaController::class);

// Tambahkan apiResource untuk model lainnya:
// Route::apiResource('users', UserController::class); // Hati-hati dengan user, mungkin perlu auth
// Route::apiResource('permohonan-sewa', PermohonanSewaController::class);
// ... dan seterusnya untuk semua model yang akan di-CRUD dari admin panel