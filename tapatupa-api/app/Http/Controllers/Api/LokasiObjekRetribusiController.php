<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LokasiObjekRetribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class LokasiObjekRetribusiController extends Controller
{
    public function index(Request $request)
    {
        Log::info('LOKASI OBJEK RETRIBUSI - INDEX');
        $data = LokasiObjekRetribusi::orderBy('lokasiObjekRetribusi', 'asc')->get();
        // Jika ingin paginasi:
        // $data = LokasiObjekRetribusi::orderBy('lokasiObjekRetribusi', 'asc')->paginate($request->input('per_page', 10));
        return response()->json(['data' => $data]); // Untuk get all
        // return response()->json($data); // Untuk paginasi
    }

    public function store(Request $request)
    {
        Log::info('LOKASI OBJEK RETRIBUSI - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'lokasiObjekRetribusi' => 'required|string|max:255|unique:lokasi_objek_retribusi,lokasiObjekRetribusi',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('LOKASI OBJEK RETRIBUSI - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('LOKASI OBJEK RETRIBUSI - STORE VALIDATED', $validatedData);

        try {
            $item = LokasiObjekRetribusi::create($validatedData);
            Log::info('LOKASI OBJEK RETRIBUSI - STORE SUCCESS', ['id' => $item->idLokasiObjekRetribusi]);
            return response()->json(['data' => $item, 'message' => 'Data berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('LOKASI OBJEK RETRIBUSI - STORE EXCEPTION', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(LokasiObjekRetribusi $lokasiObjekRetribusi)
    {
        Log::info('LOKASI OBJEK RETRIBUSI - SHOW', ['id' => $lokasiObjekRetribusi->idLokasiObjekRetribusi]);
        return response()->json(['data' => $lokasiObjekRetribusi]);
    }

    public function update(Request $request, LokasiObjekRetribusi $lokasiObjekRetribusi)
    {
        Log::info('LOKASI OBJEK RETRIBUSI - UPDATE PAYLOAD', ['id' => $lokasiObjekRetribusi->idLokasiObjekRetribusi, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'lokasiObjekRetribusi' => 'required|string|max:255|unique:lokasi_objek_retribusi,lokasiObjekRetribusi,' . $lokasiObjekRetribusi->idLokasiObjekRetribusi . ',idLokasiObjekRetribusi',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('LOKASI OBJEK RETRIBUSI - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('LOKASI OBJEK RETRIBUSI - UPDATE VALIDATED', $validatedData);

        try {
            $lokasiObjekRetribusi->update($validatedData);
            Log::info('LOKASI OBJEK RETRIBUSI - UPDATE SUCCESS', ['id' => $lokasiObjekRetribusi->idLokasiObjekRetribusi]);
            return response()->json(['data' => $lokasiObjekRetribusi, 'message' => 'Data berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('LOKASI OBJEK RETRIBUSI - UPDATE EXCEPTION', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(LokasiObjekRetribusi $lokasiObjekRetribusi)
    {
        Log::info('LOKASI OBJEK RETRIBUSI - DESTROY', ['id' => $lokasiObjekRetribusi->idLokasiObjekRetribusi]);
        try {
            // Tambahkan pengecekan relasi jika diperlukan sebelum delete
            // if ($lokasiObjekRetribusi->objekRetribusis()->exists()) {
            //     Log::warning('LOKASI OBJEK RETRIBUSI - DELETE FAILED, HAS RELATED DATA', ['id' => $lokasiObjekRetribusi->idLokasiObjekRetribusi]);
            //     return response()->json(['message' => 'Tidak dapat menghapus, lokasi masih digunakan oleh Objek Retribusi.'], 409); // 409 Conflict
            // }
            $lokasiObjekRetribusi->delete();
            Log::info('LOKASI OBJEK RETRIBUSI - DESTROY SUCCESS', ['id' => $lokasiObjekRetribusi->idLokasiObjekRetribusi]);
            return response()->json(['message' => 'Data berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('LOKASI OBJEK RETRIBUSI - DESTROY EXCEPTION', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}