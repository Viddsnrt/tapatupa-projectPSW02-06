<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PeruntukanSewa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PeruntukanSewaController extends Controller
{
    public function index(Request $request)
    {
        Log::info('PERUNTUKAN SEWA - INDEX');
        $query = PeruntukanSewa::with(['objekRetribusi', 'jenisJangkaWaktu'])
                                ->orderBy('jenisKegiatan', 'asc');

        if ($request->get('all') === 'true') {
            return response()->json(['data' => $query->get()]);
        }
        $data = $query->get(); // atau $query->paginate();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('PERUNTUKAN SEWA - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'idObjekRetribusi' => 'required|integer|exists:objek_retribusi,idObjekRetribusi',
            'idJenisJangkaWaktu' => 'required|integer|exists:jenis_jangka_waktu,idJenisJangkaWaktu',
            'jenisKegiatan' => 'required|string|max:255',
            'keteranganPeruntukan' => 'nullable|string',
            'lamaSewa' => 'nullable|integer|min:0', // Bisa 0 jika unitnya misal "per event"
        ]);

        if ($validator->fails()) {
            Log::error('PERUNTUKAN SEWA - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('PERUNTUKAN SEWA - STORE VALIDATED', $validatedData);

        try {
            $item = PeruntukanSewa::create($validatedData);
            $item->load(['objekRetribusi', 'jenisJangkaWaktu']);
            Log::info('PERUNTUKAN SEWA - STORE SUCCESS', ['id' => $item->idPeruntukanSewa]);
            return response()->json(['data' => $item, 'message' => 'Data Peruntukan Sewa berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('PERUNTUKAN SEWA - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(PeruntukanSewa $peruntukanSewa)
    {
        Log::info('PERUNTUKAN SEWA - SHOW', ['id' => $peruntukanSewa->idPeruntukanSewa]);
        $peruntukanSewa->load(['objekRetribusi', 'jenisJangkaWaktu']);
        return response()->json(['data' => $peruntukanSewa]);
    }

    public function update(Request $request, PeruntukanSewa $peruntukanSewa)
    {
        Log::info('PERUNTUKAN SEWA - UPDATE PAYLOAD', ['id' => $peruntukanSewa->idPeruntukanSewa, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'idObjekRetribusi' => 'required|integer|exists:objek_retribusi,idObjekRetribusi',
            'idJenisJangkaWaktu' => 'required|integer|exists:jenis_jangka_waktu,idJenisJangkaWaktu',
            'jenisKegiatan' => 'required|string|max:255',
            'keteranganPeruntukan' => 'nullable|string',
            'lamaSewa' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            Log::error('PERUNTUKAN SEWA - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('PERUNTUKAN SEWA - UPDATE VALIDATED', $validatedData);

        try {
            $peruntukanSewa->update($validatedData);
            $peruntukanSewa->load(['objekRetribusi', 'jenisJangkaWaktu']);
            Log::info('PERUNTUKAN SEWA - UPDATE SUCCESS', ['id' => $peruntukanSewa->idPeruntukanSewa]);
            return response()->json(['data' => $peruntukanSewa, 'message' => 'Data Peruntukan Sewa berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('PERUNTUKAN SEWA - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(PeruntukanSewa $peruntukanSewa)
    {
        Log::info('PERUNTUKAN SEWA - DESTROY', ['id' => $peruntukanSewa->idPeruntukanSewa]);
        try {
            // if ($peruntukanSewa->permohonanSewas()->exists()) {
            //    return response()->json(['message' => 'Tidak dapat menghapus, data masih digunakan oleh Permohonan Sewa.'], 409);
            // }
            $peruntukanSewa->delete();
            Log::info('PERUNTUKAN SEWA - DESTROY SUCCESS', ['id' => $peruntukanSewa->idPeruntukanSewa]);
            return response()->json(['message' => 'Data Peruntukan Sewa berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('PERUNTUKAN SEWA - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}