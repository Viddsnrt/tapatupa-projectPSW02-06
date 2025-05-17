<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ObjekRetribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Storage; // Jika implementasi file upload

class ObjekRetribusiController extends Controller
{
    public function index(Request $request)
    {
        Log::info('OBJEK RETRIBUSI - INDEX');
        $query = ObjekRetribusi::with(['lokasiObjekRetribusi', 'jenisObjekRetribusi'])
                                ->orderBy('namaObjekRetribusi', 'asc');

        if ($request->get('all') === 'true') { // Untuk dropdown di form lain
            return response()->json(['data' => $query->get()]);
        }
        $data = $query->get(); // atau $query->paginate();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('OBJEK RETRIBUSI - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'idLokasiObjekRetribusi' => 'required|integer|exists:lokasi_objek_retribusi,idLokasiObjekRetribusi',
            'idJenisObjekRetribusi' => 'required|integer|exists:jenis_objek_retribusi,idJenisObjekRetribusi',
            'kodeObjekRetribusi' => 'nullable|string|max:50|unique:objek_retribusi,kodeObjekRetribusi',
            'namaObjekRetribusi' => 'required|string|max:255',
            'noBangunan' => 'nullable|string|max:50',
            'jumlahLantai' => 'nullable|integer|min:0',
            'panjangTanah' => 'nullable|numeric|min:0',
            'lebarTanah' => 'nullable|numeric|min:0',
            'luasTanah' => 'nullable|numeric|min:0',
            'panjangBangunan' => 'nullable|numeric|min:0',
            'lebarBangunan' => 'nullable|numeric|min:0',
            'luasBangunan' => 'nullable|numeric|min:0',
            'alamatObjek' => 'required|string',
            'latitute' => 'nullable|string|max:50',
            'longitude' => 'nullable|string|max:50',
            'keteranganObjek' => 'nullable|string',
            'gambarDenahTanah' => 'nullable|string|max:255', // Untuk path manual
            // 'gambarDenahTanah' => 'nullable|image|mimes:jpg,png,jpeg|max:2048', // Untuk file upload
        ]);

        if ($validator->fails()) {
            Log::error('OBJEK RETRIBUSI - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        // Hitung luas otomatis jika panjang dan lebar diisi
        if (isset($validatedData['panjangTanah']) && isset($validatedData['lebarTanah'])) {
            $validatedData['luasTanah'] = $validatedData['panjangTanah'] * $validatedData['lebarTanah'];
        }
        if (isset($validatedData['panjangBangunan']) && isset($validatedData['lebarBangunan'])) {
            $validatedData['luasBangunan'] = $validatedData['panjangBangunan'] * $validatedData['lebarBangunan'];
        }

        // Handle file upload (jika diimplementasikan)
        // if ($request->hasFile('gambarDenahTanah') && $request->file('gambarDenahTanah')->isValid()) {
        //     $path = $request->file('gambarDenahTanah')->store('public/denah_objek');
        //     $validatedData['gambarDenahTanah'] = Storage::url($path);
        // }

        Log::info('OBJEK RETRIBUSI - STORE VALIDATED', $validatedData);

        try {
            $item = ObjekRetribusi::create($validatedData);
            $item->load(['lokasiObjekRetribusi', 'jenisObjekRetribusi']);
            Log::info('OBJEK RETRIBUSI - STORE SUCCESS', ['id' => $item->idObjekRetribusi]);
            return response()->json(['data' => $item, 'message' => 'Objek Retribusi berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('OBJEK RETRIBUSI - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(ObjekRetribusi $objekRetribusi)
    {
        Log::info('OBJEK RETRIBUSI - SHOW', ['id' => $objekRetribusi->idObjekRetribusi]);
        $objekRetribusi->load(['lokasiObjekRetribusi', 'jenisObjekRetribusi']);
        return response()->json(['data' => $objekRetribusi]);
    }

    public function update(Request $request, ObjekRetribusi $objekRetribusi)
    {
        Log::info('OBJEK RETRIBUSI - UPDATE PAYLOAD', ['id' => $objekRetribusi->idObjekRetribusi, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'idLokasiObjekRetribusi' => 'required|integer|exists:lokasi_objek_retribusi,idLokasiObjekRetribusi',
            'idJenisObjekRetribusi' => 'required|integer|exists:jenis_objek_retribusi,idJenisObjekRetribusi',
            'kodeObjekRetribusi' => 'nullable|string|max:50|unique:objek_retribusi,kodeObjekRetribusi,' . $objekRetribusi->idObjekRetribusi . ',idObjekRetribusi',
            'namaObjekRetribusi' => 'required|string|max:255',
            'noBangunan' => 'nullable|string|max:50',
            'jumlahLantai' => 'nullable|integer|min:0',
            'panjangTanah' => 'nullable|numeric|min:0',
            'lebarTanah' => 'nullable|numeric|min:0',
            'luasTanah' => 'nullable|numeric|min:0',
            'panjangBangunan' => 'nullable|numeric|min:0',
            'lebarBangunan' => 'nullable|numeric|min:0',
            'luasBangunan' => 'nullable|numeric|min:0',
            'alamatObjek' => 'required|string',
            'latitute' => 'nullable|string|max:50',
            'longitude' => 'nullable|string|max:50',
            'keteranganObjek' => 'nullable|string',
            'gambarDenahTanah' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            Log::error('OBJEK RETRIBUSI - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        if (isset($validatedData['panjangTanah']) && isset($validatedData['lebarTanah'])) {
            $validatedData['luasTanah'] = $validatedData['panjangTanah'] * $validatedData['lebarTanah'];
        } else { // Jika salah satu kosong, luas bisa di-null-kan atau biarkan
            $validatedData['luasTanah'] = $validatedData['luasTanah'] ?? null;
        }
        if (isset($validatedData['panjangBangunan']) && isset($validatedData['lebarBangunan'])) {
            $validatedData['luasBangunan'] = $validatedData['panjangBangunan'] * $validatedData['lebarBangunan'];
        } else {
            $validatedData['luasBangunan'] = $validatedData['luasBangunan'] ?? null;
        }

        // Handle file upload saat update (jika diimplementasikan)
        // ... (logika hapus file lama, simpan file baru) ...

        Log::info('OBJEK RETRIBUSI - UPDATE VALIDATED', $validatedData);


        try {
            $objekRetribusi->update($validatedData);
            $objekRetribusi->load(['lokasiObjekRetribusi', 'jenisObjekRetribusi']);
            Log::info('OBJEK RETRIBUSI - UPDATE SUCCESS', ['id' => $objekRetribusi->idObjekRetribusi]);
            return response()->json(['data' => $objekRetribusi, 'message' => 'Objek Retribusi berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('OBJEK RETRIBUSI - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(ObjekRetribusi $objekRetribusi)
    {
        Log::info('OBJEK RETRIBUSI - DESTROY', ['id' => $objekRetribusi->idObjekRetribusi]);
        try {
            // Hapus file terkait jika ada
            // if ($objekRetribusi->gambarDenahTanah && Storage::exists(str_replace(Storage::url(''), 'public/', $objekRetribusi->gambarDenahTanah))) {
            //    Storage::delete(str_replace(Storage::url(''), 'public/', $objekRetribusi->gambarDenahTanah));
            // }
            $objekRetribusi->delete();
            Log::info('OBJEK RETRIBUSI - DESTROY SUCCESS', ['id' => $objekRetribusi->idObjekRetribusi]);
            return response()->json(['message' => 'Objek Retribusi berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('OBJEK RETRIBUSI - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}