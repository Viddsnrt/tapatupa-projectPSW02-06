<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TarifObjekRetribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Storage; // Jika implementasi file upload

class TarifObjekRetribusiController extends Controller
{
    public function index(Request $request)
    {
        Log::info('TARIF OBJEK RETRIBUSI - INDEX');
        $query = TarifObjekRetribusi::with(['objekRetribusi', 'jenisJangkaWaktu'])
                                     ->orderBy('tanggalDinilai', 'desc');

        if ($request->get('all') === 'true') {
            return response()->json(['data' => $query->get()]);
        }
        $data = $query->get(); // atau $query->paginate();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('TARIF OBJEK RETRIBUSI - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'idObjekRetribusi' => 'required|integer|exists:objek_retribusi,idObjekRetribusi',
            'idJenisJangkaWaktu' => 'required|integer|exists:jenis_jangka_waktu,idJenisJangkaWaktu',
            'tanggalDinilai' => 'required|date_format:Y-m-d',
            'namaPenilai' => 'nullable|string|max:255',
            'nominalTarif' => 'required|numeric|min:0',
            'fileHasilPenilaian' => 'nullable|string|max:255', // Untuk path manual
            // 'fileHasilPenilaian' => 'nullable|file|mimes:pdf,jpg,png|max:2048', // Untuk file upload
            'keterangan' => 'nullable|string',
            'isDefault' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            Log::error('TARIF OBJEK RETRIBUSI - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $validatedData['isDefault'] = filter_var($request->input('isDefault', false), FILTER_VALIDATE_BOOLEAN);

        // Handle file upload (jika diimplementasikan)
        // if ($request->hasFile('fileHasilPenilaian') && $request->file('fileHasilPenilaian')->isValid()) {
        //     $path = $request->file('fileHasilPenilaian')->store('public/hasil_penilaian_tarif');
        //     $validatedData['fileHasilPenilaian'] = Storage::url($path); // Simpan URL publik atau hanya path
        // }

        Log::info('TARIF OBJEK RETRIBUSI - STORE VALIDATED', $validatedData);

        try {
            $item = TarifObjekRetribusi::create($validatedData);
            $item->load(['objekRetribusi', 'jenisJangkaWaktu']);
            Log::info('TARIF OBJEK RETRIBUSI - STORE SUCCESS', ['id' => $item->idTarifObjekRetribusi]);
            return response()->json(['data' => $item, 'message' => 'Tarif Objek Retribusi berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('TARIF OBJEK RETRIBUSI - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(TarifObjekRetribusi $tarifObjekRetribusi)
    {
        Log::info('TARIF OBJEK RETRIBUSI - SHOW', ['id' => $tarifObjekRetribusi->idTarifObjekRetribusi]);
        $tarifObjekRetribusi->load(['objekRetribusi', 'jenisJangkaWaktu']);
        return response()->json(['data' => $tarifObjekRetribusi]);
    }

    public function update(Request $request, TarifObjekRetribusi $tarifObjekRetribusi)
    {
        Log::info('TARIF OBJEK RETRIBUSI - UPDATE PAYLOAD', ['id' => $tarifObjekRetribusi->idTarifObjekRetribusi, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'idObjekRetribusi' => 'required|integer|exists:objek_retribusi,idObjekRetribusi',
            'idJenisJangkaWaktu' => 'required|integer|exists:jenis_jangka_waktu,idJenisJangkaWaktu',
            'tanggalDinilai' => 'required|date_format:Y-m-d',
            'namaPenilai' => 'nullable|string|max:255',
            'nominalTarif' => 'required|numeric|min:0',
            'fileHasilPenilaian' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string',
            'isDefault' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            Log::error('TARIF OBJEK RETRIBUSI - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $validatedData['isDefault'] = filter_var($request->input('isDefault', false), FILTER_VALIDATE_BOOLEAN);

        // Handle file upload saat update (jika diimplementasikan)
        // ...

        Log::info('TARIF OBJEK RETRIBUSI - UPDATE VALIDATED', $validatedData);

        try {
            $tarifObjekRetribusi->update($validatedData);
            $tarifObjekRetribusi->load(['objekRetribusi', 'jenisJangkaWaktu']);
            Log::info('TARIF OBJEK RETRIBUSI - UPDATE SUCCESS', ['id' => $tarifObjekRetribusi->idTarifObjekRetribusi]);
            return response()->json(['data' => $tarifObjekRetribusi, 'message' => 'Tarif Objek Retribusi berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('TARIF OBJEK RETRIBUSI - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(TarifObjekRetribusi $tarifObjekRetribusi)
    {
        Log::info('TARIF OBJEK RETRIBUSI - DESTROY', ['id' => $tarifObjekRetribusi->idTarifObjekRetribusi]);
        try {
            // Hapus file terkait jika ada
            // ...
            $tarifObjekRetribusi->delete();
            Log::info('TARIF OBJEK RETRIBUSI - DESTROY SUCCESS', ['id' => $tarifObjekRetribusi->idTarifObjekRetribusi]);
            return response()->json(['message' => 'Tarif Objek Retribusi berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('TARIF OBJEK RETRIBUSI - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}