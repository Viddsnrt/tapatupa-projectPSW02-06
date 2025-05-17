<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JenisJangkaWaktu; // Ganti Model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class JenisJangkaWaktuController extends Controller // Ganti NamaController
{
    public function index(Request $request)
    {
        Log::info('JENIS JANGKA WAKTU - INDEX');
        // Ganti orderBy jika perlu
        $data = JenisJangkaWaktu::orderBy('jenisJangkaWaktu', 'asc')->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('JENIS JANGKA WAKTU - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            // Ganti aturan validasi
            'jenisJangkaWaktu' => 'required|string|max:255|unique:jenis_jangka_waktu,jenisJangkaWaktu',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('JENIS JANGKA WAKTU - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('JENIS JANGKA WAKTU - STORE VALIDATED', $validatedData);

        try {
            $item = JenisJangkaWaktu::create($validatedData); // Ganti Model
            Log::info('JENIS JANGKA WAKTU - STORE SUCCESS', ['id' => $item->idJenisJangkaWaktu]);
            return response()->json(['data' => $item, 'message' => 'Data berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('JENIS JANGKA WAKTU - STORE EXCEPTION', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error saat menyimpan data.'], 500);
        }
    }

    public function show(JenisJangkaWaktu $jenisJangkaWaktu) // Ganti Model Instance
    {
        Log::info('JENIS JANGKA WAKTU - SHOW', ['id' => $jenisJangkaWaktu->idJenisJangkaWaktu]);
        return response()->json(['data' => $jenisJangkaWaktu]);
    }

    public function update(Request $request, JenisJangkaWaktu $jenisJangkaWaktu) // Ganti Model Instance
    {
        Log::info('JENIS JANGKA WAKTU - UPDATE PAYLOAD', ['id' => $jenisJangkaWaktu->idJenisJangkaWaktu, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            // Ganti aturan validasi
            'jenisJangkaWaktu' => 'required|string|max:255|unique:jenis_jangka_waktu,jenisJangkaWaktu,' . $jenisJangkaWaktu->idJenisJangkaWaktu . ',idJenisJangkaWaktu',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('JENIS JANGKA WAKTU - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('JENIS JANGKA WAKTU - UPDATE VALIDATED', $validatedData);

        try {
            $jenisJangkaWaktu->update($validatedData);
            Log::info('JENIS JANGKA WAKTU - UPDATE SUCCESS', ['id' => $jenisJangkaWaktu->idJenisJangkaWaktu]);
            return response()->json(['data' => $jenisJangkaWaktu, 'message' => 'Data berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('JENIS JANGKA WAKTU - UPDATE EXCEPTION', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error saat memperbarui data.'], 500);
        }
    }

    public function destroy(JenisJangkaWaktu $jenisJangkaWaktu) // Ganti Model Instance
    {
        Log::info('JENIS JANGKA WAKTU - DESTROY', ['id' => $jenisJangkaWaktu->idJenisJangkaWaktu]);
        try {
            $jenisJangkaWaktu->delete();
            Log::info('JENIS JANGKA WAKTU - DESTROY SUCCESS', ['id' => $jenisJangkaWaktu->idJenisJangkaWaktu]);
            return response()->json(['message' => 'Data berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('JENIS JANGKA WAKTU - DESTROY EXCEPTION', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error saat menghapus data.'], 500);
        }
    }
}