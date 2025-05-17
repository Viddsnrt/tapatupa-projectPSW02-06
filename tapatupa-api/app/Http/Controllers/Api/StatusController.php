<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Status; // Model yang benar
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Auth; // Jika ingin otomatis mengisi createBy

class StatusController extends Controller
{
    public function index(Request $request)
    {
        Log::info('STATUSES - INDEX');
        // Eager load relasi untuk ditampilkan di tabel
        $query = Status::with(['jenisStatus', 'creator'])->orderBy('namaStatus', 'asc');

        if ($request->get('all')) { // Untuk dropdown di halaman lain jika perlu
            return response()->json(['data' => $query->get()]);
        }
        $data = $query->get(); // atau $query->paginate();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('STATUSES - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'idJenisStatus' => 'required|integer|exists:jenis_status,idJenisStatus',
            'namaStatus' => 'required|string|max:255',
            'keteranganStatus' => 'nullable|string',
            'createBy' => 'nullable|integer|exists:users,userId', // Jika admin memilih
        ]);

        if ($validator->fails()) {
            Log::error('STATUSES - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        // Jika createBy ingin diisi otomatis oleh user yang login (misal via Sanctum)
        // if (Auth::check() && !isset($validatedData['createBy'])) {
        //     $validatedData['createBy'] = Auth::id();
        // }
        Log::info('STATUSES - STORE VALIDATED', $validatedData);

        try {
            $item = Status::create($validatedData);
            $item->load(['jenisStatus', 'creator']); // Muat relasi untuk respons
            Log::info('STATUSES - STORE SUCCESS', ['id' => $item->idStatus]);
            return response()->json(['data' => $item, 'message' => 'Status berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('STATUSES - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(Status $status) // Route model binding dengan nama var $status
    {
        Log::info('STATUSES - SHOW', ['id' => $status->idStatus]);
        $status->load(['jenisStatus', 'creator']);
        return response()->json(['data' => $status]);
    }

    public function update(Request $request, Status $status)
    {
        Log::info('STATUSES - UPDATE PAYLOAD', ['id' => $status->idStatus, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'idJenisStatus' => 'required|integer|exists:jenis_status,idJenisStatus',
            'namaStatus' => 'required|string|max:255',
            'keteranganStatus' => 'nullable|string',
            'createBy' => 'nullable|integer|exists:users,userId',
        ]);

        if ($validator->fails()) {
            Log::error('STATUSES - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        // Jika createBy ingin diisi otomatis oleh user yang login saat update (biasanya tidak, hanya saat create)
        // if (Auth::check() && !isset($validatedData['createBy'])) {
        //     $validatedData['createBy'] = Auth::id(); // Atau user yang melakukan update
        // }
        Log::info('STATUSES - UPDATE VALIDATED', $validatedData);

        try {
            $status->update($validatedData);
            $status->load(['jenisStatus', 'creator']);
            Log::info('STATUSES - UPDATE SUCCESS', ['id' => $status->idStatus]);
            return response()->json(['data' => $status, 'message' => 'Status berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('STATUSES - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(Status $status)
    {
        Log::info('STATUSES - DESTROY', ['id' => $status->idStatus]);
        try {
            // if ($status->permohonanSewas()->exists()) {
            //    return response()->json(['message' => 'Tidak dapat menghapus, status masih digunakan oleh Permohonan Sewa.'], 409);
            // }
            $status->delete();
            Log::info('STATUSES - DESTROY SUCCESS', ['id' => $status->idStatus]);
            return response()->json(['message' => 'Status berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('STATUSES - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus data.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}