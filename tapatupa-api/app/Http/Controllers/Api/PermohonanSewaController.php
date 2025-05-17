<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PermohonanSewa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Auth;

class PermohonanSewaController extends Controller
{
    public function index(Request $request)
    {
        Log::info('PERMOHONAN SEWA - INDEX');
        $query = PermohonanSewa::with([
            'jenisPermohonan',
            'wajibRetribusi',
            'peruntukanSewa', // Ini sudah otomatis with objekRetribusi & jenisJangkaWaktu dari model
            'status',         // Ini sudah otomatis with jenisStatus dari model
            'creator'
        ])->orderBy('tanggalPengajuan', 'desc');

        // Jika ada parameter search atau filter, bisa ditambahkan di sini
        // Contoh filter by status:
        // if ($request->has('status_id')) {
        //    $query->where('idStatus', $request->status_id);
        // }

        $data = $query->get(); // atau $query->paginate(10);
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('PERMOHONAN SEWA - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'idJenisPermohonan' => 'required|integer|exists:jenis_permohonan,idJenisPermohonan',
            'nomorSuratPermohonan' => 'required|string|max:100|unique:permohonan_sewa,nomorSuratPermohonan',
            'tanggalPengajuan' => 'required|date_format:Y-m-d',
            'idWajibRetribusi' => 'required|integer|exists:wajib_retribusi,idWajibRetribusi',
            'idPeruntukanSewa' => 'required|integer|exists:peruntukan_sewa,idPeruntukanSewa',
            'idStatus' => 'required|integer|exists:statuses,idStatus',
            'createBy' => 'nullable|integer|exists:users,userId',
        ]);

        if ($validator->fails()) {
            Log::error('PERMOHONAN SEWA - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        // if (Auth::check() && !isset($validatedData['createBy'])) { // Otomatis isi createBy jika login
        //     $validatedData['createBy'] = Auth::id();
        // }
        Log::info('PERMOHONAN SEWA - STORE VALIDATED', $validatedData);

        try {
            $item = PermohonanSewa::create($validatedData);
            // Load semua relasi untuk respons yang lengkap
            $item->load(['jenisPermohonan', 'wajibRetribusi', 'peruntukanSewa', 'status', 'creator']);
            Log::info('PERMOHONAN SEWA - STORE SUCCESS', ['id' => $item->idPermohonanSewa]);
            return response()->json(['data' => $item, 'message' => 'Permohonan Sewa berhasil diajukan'], 201);
        } catch (\Exception $e) {
            Log::critical('PERMOHONAN SEWA - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat mengajukan permohonan.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(PermohonanSewa $permohonanSewa)
    {
        Log::info('PERMOHONAN SEWA - SHOW', ['id' => $permohonanSewa->idPermohonanSewa]);
        $permohonanSewa->load(['jenisPermohonan', 'wajibRetribusi', 'peruntukanSewa', 'status', 'creator']);
        return response()->json(['data' => $permohonanSewa]);
    }

    public function update(Request $request, PermohonanSewa $permohonanSewa)
    {
        Log::info('PERMOHONAN SEWA - UPDATE PAYLOAD', ['id' => $permohonanSewa->idPermohonanSewa, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'idJenisPermohonan' => 'required|integer|exists:jenis_permohonan,idJenisPermohonan',
            'nomorSuratPermohonan' => 'required|string|max:100|unique:permohonan_sewa,nomorSuratPermohonan,' . $permohonanSewa->idPermohonanSewa . ',idPermohonanSewa',
            'tanggalPengajuan' => 'required|date_format:Y-m-d',
            'idWajibRetribusi' => 'required|integer|exists:wajib_retribusi,idWajibRetribusi',
            'idPeruntukanSewa' => 'required|integer|exists:peruntukan_sewa,idPeruntukanSewa',
            'idStatus' => 'required|integer|exists:statuses,idStatus',
            'createBy' => 'nullable|integer|exists:users,userId',
        ]);

        if ($validator->fails()) {
            Log::error('PERMOHONAN SEWA - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('PERMOHONAN SEWA - UPDATE VALIDATED', $validatedData);

        try {
            $permohonanSewa->update($validatedData);
            $permohonanSewa->load(['jenisPermohonan', 'wajibRetribusi', 'peruntukanSewa', 'status', 'creator']);
            Log::info('PERMOHONAN SEWA - UPDATE SUCCESS', ['id' => $permohonanSewa->idPermohonanSewa]);
            return response()->json(['data' => $permohonanSewa, 'message' => 'Permohonan Sewa berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('PERMOHONAN SEWA - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui permohonan.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(PermohonanSewa $permohonanSewa)
    {
        Log::info('PERMOHONAN SEWA - DESTROY', ['id' => $permohonanSewa->idPermohonanSewa]);
        try {
            $permohonanSewa->delete();
            Log::info('PERMOHONAN SEWA - DESTROY SUCCESS', ['id' => $permohonanSewa->idPermohonanSewa]);
            return response()->json(['message' => 'Permohonan Sewa berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('PERMOHONAN SEWA - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus permohonan.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}