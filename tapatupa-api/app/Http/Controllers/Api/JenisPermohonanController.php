<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JenisPermohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; // Pastikan ini di-import
use Illuminate\Support\Facades\Log;      // Pastikan ini di-import untuk logging

class JenisPermohonanController extends Controller
{
    public function index(Request $request)
    {
        Log::info('JENIS PERMOHONAN - INDEX METHOD CALLED');
        $data = JenisPermohonan::orderBy('jenisPermohonan', 'asc')->get();
        // Untuk paginasi:
        // $data = JenisPermohonan::orderBy('jenisPermohonan', 'asc')->paginate($request->input('per_page', 10));
        Log::info('JENIS PERMOHONAN - DATA FETCHED FOR INDEX', ['count' => $data->count()]);
        return response()->json(['data' => $data]); // Jika tidak paginasi
        // return response()->json($data); // Jika paginasi
    }

    public function store(Request $request)
    {
        Log::info('JENIS PERMOHONAN - STORE METHOD START');
        Log::info('Request Payload:', $request->all());

        $validator = Validator::make($request->all(), [
            'jenisPermohonan' => 'required|string|max:255|unique:jenis_permohonan,jenisPermohonan',
            'keterangan' => 'nullable|string',
            'parentid' => 'nullable|integer|exists:jenis_permohonan,idJenisPermohonan'
        ]);

        if ($validator->fails()) {
            Log::error('JENIS PERMOHONAN - VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('JENIS PERMOHONAN - VALIDATED DATA', $validatedData);

        if (array_key_exists('parentid', $validatedData) && $validatedData['parentid'] === '') {
            $validatedData['parentid'] = null;
            Log::info('JENIS PERMOHONAN - ParentID set to null because it was empty string.');
        } else if (array_key_exists('parentid', $validatedData) && $validatedData['parentid'] !== null) {
            $validatedData['parentid'] = (int) $validatedData['parentid'];
            Log::info('JENIS PERMOHONAN - ParentID cast to int.');
        }

        try {
            Log::info('JENIS PERMOHONAN - ATTEMPTING CREATE', $validatedData);
            $item = JenisPermohonan::create($validatedData);
            Log::info('JENIS PERMOHONAN - CREATE SUCCESS', ['item_id' => $item->idJenisPermohonan, 'item_data' => $item->toArray()]);
            return response()->json(['data' => $item, 'message' => 'Data berhasil ditambahkan'], 201); // Kembalikan 201 Created
        } catch (\Exception $e) {
            Log::critical('JENIS PERMOHONAN - EXCEPTION DURING CREATE', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(JenisPermohonan $jenisPermohonan)
    {
        Log::info('JENIS PERMOHONAN - SHOW METHOD CALLED', ['id' => $jenisPermohonan->idJenisPermohonan]);
        // $jenisPermohonan->load('parent', 'children'); // Jika ingin load relasi
        return response()->json(['data' => $jenisPermohonan]);
    }

    public function update(Request $request, JenisPermohonan $jenisPermohonan)
    {
        Log::info('JENIS PERMOHONAN - UPDATE METHOD START', ['id' => $jenisPermohonan->idJenisPermohonan]);
        Log::info('Request Payload for Update:', $request->all());

        $validator = Validator::make($request->all(), [
            'jenisPermohonan' => 'required|string|max:255|unique:jenis_permohonan,jenisPermohonan,' . $jenisPermohonan->idJenisPermohonan . ',idJenisPermohonan',
            'keterangan' => 'nullable|string',
            'parentid' => 'nullable|integer|exists:jenis_permohonan,idJenisPermohonan'
        ]);

        if ($validator->fails()) {
            Log::error('JENIS PERMOHONAN - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('JENIS PERMOHONAN - VALIDATED DATA FOR UPDATE', $validatedData);

        if (array_key_exists('parentid', $validatedData) && $validatedData['parentid'] === '') {
            $validatedData['parentid'] = null;
            Log::info('JENIS PERMOHONAN - ParentID set to null in update.');
        } else if (array_key_exists('parentid', $validatedData) && $validatedData['parentid'] !== null) {
            $validatedData['parentid'] = (int) $validatedData['parentid'];
             Log::info('JENIS PERMOHONAN - ParentID cast to int in update.');
        }

        try {
            Log::info('JENIS PERMOHONAN - ATTEMPTING UPDATE', $validatedData);
            $jenisPermohonan->update($validatedData);
            Log::info('JENIS PERMOHONAN - UPDATE SUCCESS', ['item_id' => $jenisPermohonan->idJenisPermohonan, 'item_data' => $jenisPermohonan->toArray()]);
            return response()->json(['data' => $jenisPermohonan, 'message' => 'Data berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('JENIS PERMOHONAN - EXCEPTION DURING UPDATE', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(JenisPermohonan $jenisPermohonan)
    {
        Log::info('JENIS PERMOHONAN - DESTROY METHOD CALLED', ['id' => $jenisPermohonan->idJenisPermohonan]);
        try {
            // if ($jenisPermohonan->children()->exists()) { // Contoh cek relasi
            //    Log::warning('JENIS PERMOHONAN - DELETE FAILED, HAS CHILDREN', ['id' => $jenisPermohonan->idJenisPermohonan]);
            //    return response()->json(['message' => 'Tidak dapat menghapus, masih memiliki data turunan.'], 409);
            // }
            $jenisPermohonan->delete(); // Soft delete
            Log::info('JENIS PERMOHONAN - DELETE SUCCESS (SOFT DELETE)', ['id' => $jenisPermohonan->idJenisPermohonan]);
            return response()->json(['message' => 'Data berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('JENIS PERMOHONAN - EXCEPTION DURING DESTROY', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}