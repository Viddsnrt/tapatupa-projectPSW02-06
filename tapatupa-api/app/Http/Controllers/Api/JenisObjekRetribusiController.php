<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JenisObjekRetribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class JenisObjekRetribusiController extends Controller
{
    public function index(Request $request)
    {
        Log::info('JENIS OBJEK RETRIBUSI - INDEX');
        $data = JenisObjekRetribusi::orderBy('jenisObjekRetribusi', 'asc')->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('JENIS OBJEK RETRIBUSI - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'jenisObjekRetribusi' => 'required|string|max:255|unique:jenis_objek_retribusi,jenisObjekRetribusi',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('JENIS OBJEK RETRIBUSI - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('JENIS OBJEK RETRIBUSI - STORE VALIDATED', $validatedData);

        try {
            $item = JenisObjekRetribusi::create($validatedData);
            Log::info('JENIS OBJEK RETRIBUSI - STORE SUCCESS', ['id' => $item->idJenisObjekRetribusi]);
            return response()->json(['data' => $item, 'message' => 'Data berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('JENIS OBJEK RETRIBUSI - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(JenisObjekRetribusi $jenisObjekRetribusi)
    {
        Log::info('JENIS OBJEK RETRIBUSI - SHOW', ['id' => $jenisObjekRetribusi->idJenisObjekRetribusi]);
        return response()->json(['data' => $jenisObjekRetribusi]);
    }

    public function update(Request $request, JenisObjekRetribusi $jenisObjekRetribusi)
    {
        Log::info('JENIS OBJEK RETRIBUSI - UPDATE PAYLOAD', ['id' => $jenisObjekRetribusi->idJenisObjekRetribusi, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'jenisObjekRetribusi' => 'required|string|max:255|unique:jenis_objek_retribusi,jenisObjekRetribusi,' . $jenisObjekRetribusi->idJenisObjekRetribusi . ',idJenisObjekRetribusi',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('JENIS OBJEK RETRIBUSI - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('JENIS OBJEK RETRIBUSI - UPDATE VALIDATED', $validatedData);

        try {
            $jenisObjekRetribusi->update($validatedData);
            Log::info('JENIS OBJEK RETRIBUSI - UPDATE SUCCESS', ['id' => $jenisObjekRetribusi->idJenisObjekRetribusi]);
            return response()->json(['data' => $jenisObjekRetribusi, 'message' => 'Data berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('JENIS OBJEK RETRIBUSI - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(JenisObjekRetribusi $jenisObjekRetribusi)
    {
        Log::info('JENIS OBJEK RETRIBUSI - DESTROY', ['id' => $jenisObjekRetribusi->idJenisObjekRetribusi]);
        try {
            $jenisObjekRetribusi->delete();
            Log::info('JENIS OBJEK RETRIBUSI - DESTROY SUCCESS', ['id' => $jenisObjekRetribusi->idJenisObjekRetribusi]);
            return response()->json(['message' => 'Data berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('JENIS OBJEK RETRIBUSI - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}