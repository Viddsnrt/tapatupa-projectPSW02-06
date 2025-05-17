<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JangkaWaktuSewa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class JangkaWaktuSewaController extends Controller
{
    public function index(Request $request)
    {
        Log::info('JANGKA WAKTU SEWA - INDEX');
        // Eager load relasi untuk ditampilkan di tabel
        $query = JangkaWaktuSewa::with('jenisJangkaWaktu')->orderBy('jangkaWaktu', 'asc');

        if ($request->get('all')) { // Untuk dropdown di halaman lain jika perlu
            return response()->json(['data' => $query->get()]);
        }

        $data = $query->get(); // atau $query->paginate(); jika ingin paginasi
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('JANGKA WAKTU SEWA - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'idJenisJangkaWaktu' => 'required|integer|exists:jenis_jangka_waktu,idJenisJangkaWaktu',
            'jangkaWaktu' => 'required|string|max:100',
            'keterangan' => 'nullable|string',
            'isDefault' => 'nullable|boolean', // Validator boolean akan handle true, false, 1, 0, "1", "0"
        ]);

        if ($validator->fails()) {
            Log::error('JANGKA WAKTU SEWA - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        // Pastikan isDefault benar-benar boolean
        $validatedData['isDefault'] = filter_var($request->input('isDefault', false), FILTER_VALIDATE_BOOLEAN);
        Log::info('JANGKA WAKTU SEWA - STORE VALIDATED', $validatedData);


        try {
            $item = JangkaWaktuSewa::create($validatedData);
            $item->load('jenisJangkaWaktu'); // Muat relasi untuk respons
            Log::info('JANGKA WAKTU SEWA - STORE SUCCESS', ['id' => $item->idJangkaWaktuSewa]);
            return response()->json(['data' => $item, 'message' => 'Data Jangka Waktu Sewa berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('JANGKA WAKTU SEWA - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(JangkaWaktuSewa $jangkaWaktuSewa)
    {
        Log::info('JANGKA WAKTU SEWA - SHOW', ['id' => $jangkaWaktuSewa->idJangkaWaktuSewa]);
        $jangkaWaktuSewa->load('jenisJangkaWaktu'); // Muat relasi
        return response()->json(['data' => $jangkaWaktuSewa]);
    }

    public function update(Request $request, JangkaWaktuSewa $jangkaWaktuSewa)
    {
        Log::info('JANGKA WAKTU SEWA - UPDATE PAYLOAD', ['id' => $jangkaWaktuSewa->idJangkaWaktuSewa, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'idJenisJangkaWaktu' => 'required|integer|exists:jenis_jangka_waktu,idJenisJangkaWaktu',
            'jangkaWaktu' => 'required|string|max:100',
            'keterangan' => 'nullable|string',
            'isDefault' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            Log::error('JANGKA WAKTU SEWA - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $validatedData['isDefault'] = filter_var($request->input('isDefault', false), FILTER_VALIDATE_BOOLEAN);
        Log::info('JANGKA WAKTU SEWA - UPDATE VALIDATED', $validatedData);


        try {
            $jangkaWaktuSewa->update($validatedData);
            $jangkaWaktuSewa->load('jenisJangkaWaktu'); // Muat relasi untuk respons
            Log::info('JANGKA WAKTU SEWA - UPDATE SUCCESS', ['id' => $jangkaWaktuSewa->idJangkaWaktuSewa]);
            return response()->json(['data' => $jangkaWaktuSewa, 'message' => 'Data Jangka Waktu Sewa berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('JANGKA WAKTU SEWA - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(JangkaWaktuSewa $jangkaWaktuSewa)
    {
        Log::info('JANGKA WAKTU SEWA - DESTROY', ['id' => $jangkaWaktuSewa->idJangkaWaktuSewa]);
        try {
            $jangkaWaktuSewa->delete();
            Log::info('JANGKA WAKTU SEWA - DESTROY SUCCESS', ['id' => $jangkaWaktuSewa->idJangkaWaktuSewa]);
            return response()->json(['message' => 'Data Jangka Waktu Sewa berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('JANGKA WAKTU SEWA - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}