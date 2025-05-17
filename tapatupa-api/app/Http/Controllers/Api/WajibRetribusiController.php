<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WajibRetribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Storage; // Uncomment jika implementasi file upload

class WajibRetribusiController extends Controller
{
    public function index(Request $request)
    {
        Log::info('WAJIB RETRIBUSI - INDEX');
        $data = WajibRetribusi::orderBy('namaWajibRetribusi', 'asc')->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('WAJIB RETRIBUSI - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'NIK' => 'required|string|max:20|unique:wajib_retribusi,NIK',
            'namaWajibRetribusi' => 'required|string|max:255',
            'Pekerjaan' => 'nullable|string|max:100',
            'alamat' => 'nullable|string',
            'nomorPonsel' => 'nullable|string|max:20',
            'nomorWhatsapp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:wajib_retribusi,email',
            'fileFoto' => 'nullable|string|max:255', // Jika hanya path
            // 'fileFoto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Jika upload file gambar
        ]);

        if ($validator->fails()) {
            Log::error('WAJIB RETRIBUSI - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('WAJIB RETRIBUSI - STORE VALIDATED', $validatedData);

        // Logika untuk file upload (jika diimplementasikan)
        // if ($request->hasFile('fileFoto') && $request->file('fileFoto')->isValid()) {
        //     $path = $request->file('fileFoto')->store('public/wajib_retribusi_foto');
        //     $validatedData['fileFoto'] = Storage::url($path); // Simpan URL publik atau hanya path
        // } else if (isset($validatedData['fileFoto']) && is_string($validatedData['fileFoto'])) {
        //     // Jika dikirim sebagai string (path manual), biarkan saja
        // } else {
        //     $validatedData['fileFoto'] = null; // Atau default jika tidak ada file
        // }


        try {
            $item = WajibRetribusi::create($validatedData);
            Log::info('WAJIB RETRIBUSI - STORE SUCCESS', ['id' => $item->idWajibRetribusi]);
            return response()->json(['data' => $item, 'message' => 'Data Wajib Retribusi berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('WAJIB RETRIBUSI - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(WajibRetribusi $wajibRetribusi)
    {
        Log::info('WAJIB RETRIBUSI - SHOW', ['id' => $wajibRetribusi->idWajibRetribusi]);
        return response()->json(['data' => $wajibRetribusi]);
    }

    public function update(Request $request, WajibRetribusi $wajibRetribusi)
    {
        Log::info('WAJIB RETRIBUSI - UPDATE PAYLOAD', ['id' => $wajibRetribusi->idWajibRetribusi, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'NIK' => 'required|string|max:20|unique:wajib_retribusi,NIK,' . $wajibRetribusi->idWajibRetribusi . ',idWajibRetribusi',
            'namaWajibRetribusi' => 'required|string|max:255',
            'Pekerjaan' => 'nullable|string|max:100',
            'alamat' => 'nullable|string',
            'nomorPonsel' => 'nullable|string|max:20',
            'nomorWhatsapp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:wajib_retribusi,email,' . $wajibRetribusi->idWajibRetribusi . ',idWajibRetribusi',
            'fileFoto' => 'nullable|string|max:255', // Jika hanya path
            // 'fileFoto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Jika upload file gambar
        ]);

        if ($validator->fails()) {
            Log::error('WAJIB RETRIBUSI - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('WAJIB RETRIBUSI - UPDATE VALIDATED', $validatedData);

        // Logika untuk file upload saat update (jika diimplementasikan)
        // if ($request->hasFile('fileFoto') && $request->file('fileFoto')->isValid()) {
        //     // Hapus file lama jika ada dan pathnya tersimpan
        //     if ($wajibRetribusi->fileFoto) {
        //         $oldPath = str_replace(Storage::url(''), '', $wajibRetribusi->fileFoto); // Dapatkan path relatif
        //         if (Storage::exists('public/' . $oldPath)) {
        //             Storage::delete('public/' . $oldPath);
        //         }
        //     }
        //     $path = $request->file('fileFoto')->store('public/wajib_retribusi_foto');
        //     $validatedData['fileFoto'] = Storage::url($path);
        // } else if (isset($validatedData['fileFoto']) && is_string($validatedData['fileFoto'])) {
        //     // Jika dikirim sebagai string (path manual), biarkan saja
        // } else {
        //     // Jika tidak ada file baru dan tidak ada path manual, jangan ubah fileFoto yang sudah ada
        //     unset($validatedData['fileFoto']);
        // }


        try {
            $wajibRetribusi->update($validatedData);
            Log::info('WAJIB RETRIBUSI - UPDATE SUCCESS', ['id' => $wajibRetribusi->idWajibRetribusi]);
            return response()->json(['data' => $wajibRetribusi, 'message' => 'Data Wajib Retribusi berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('WAJIB RETRIBUSI - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(WajibRetribusi $wajibRetribusi)
    {
        Log::info('WAJIB RETRIBUSI - DESTROY', ['id' => $wajibRetribusi->idWajibRetribusi]);
        try {
            // Logika hapus file foto jika ada sebelum delete record
            // if ($wajibRetribusi->fileFoto) {
            //     $oldPath = str_replace(Storage::url(''), '', $wajibRetribusi->fileFoto);
            //     if (Storage::exists('public/' . $oldPath)) {
            //         Storage::delete('public/' . $oldPath);
            //     }
            // }
            $wajibRetribusi->delete();
            Log::info('WAJIB RETRIBUSI - DESTROY SUCCESS', ['id' => $wajibRetribusi->idWajibRetribusi]);
            return response()->json(['message' => 'Data Wajib Retribusi berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('WAJIB RETRIBUSI - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}