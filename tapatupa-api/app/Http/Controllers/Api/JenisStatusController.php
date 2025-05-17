<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JenisStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class JenisStatusController extends Controller
{
    public function index(Request $request)
    {
        Log::info('JENIS STATUS - INDEX');
        $data = JenisStatus::orderBy('jenisStatus', 'asc')->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('JENIS STATUS - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'jenisStatus' => 'required|string|max:255|unique:jenis_status,jenisStatus',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('JENIS STATUS - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('JENIS STATUS - STORE VALIDATED', $validatedData);

        try {
            $item = JenisStatus::create($validatedData);
            Log::info('JENIS STATUS - STORE SUCCESS', ['id' => $item->idJenisStatus]);
            return response()->json(['data' => $item, 'message' => 'Data berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('JENIS STATUS - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(JenisStatus $jenisStatus)
    {
        Log::info('JENIS STATUS - SHOW', ['id' => $jenisStatus->idJenisStatus]);
        return response()->json(['data' => $jenisStatus]);
    }

    public function update(Request $request, JenisStatus $jenisStatus)
    {
        Log::info('JENIS STATUS - UPDATE PAYLOAD', ['id' => $jenisStatus->idJenisStatus, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'jenisStatus' => 'required|string|max:255|unique:jenis_status,jenisStatus,' . $jenisStatus->idJenisStatus . ',idJenisStatus',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('JENIS STATUS - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('JENIS STATUS - UPDATE VALIDATED', $validatedData);

        try {
            $jenisStatus->update($validatedData);
            Log::info('JENIS STATUS - UPDATE SUCCESS', ['id' => $jenisStatus->idJenisStatus]);
            return response()->json(['data' => $jenisStatus, 'message' => 'Data berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('JENIS STATUS - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(JenisStatus $jenisStatus)
    {
        Log::info('JENIS STATUS - DESTROY', ['id' => $jenisStatus->idJenisStatus]);
        try {
            // Tambahkan pengecekan relasi jika diperlukan sebelum delete
            // if ($jenisStatus->statuses()->exists()) {
            //     Log::warning('JENIS STATUS - DELETE FAILED, HAS RELATED STATUSES', ['id' => $jenisStatus->idJenisStatus]);
            //     return response()->json(['message' => 'Tidak dapat menghapus, jenis status masih digunakan.'], 409);
            // }
            $jenisStatus->delete();
            Log::info('JENIS STATUS - DESTROY SUCCESS', ['id' => $jenisStatus->idJenisStatus]);
            return response()->json(['message' => 'Data berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('JENIS STATUS - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}