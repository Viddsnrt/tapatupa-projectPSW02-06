<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash; // Untuk hashing password

class UserController extends Controller
{
    public function index(Request $request)
    {
        Log::info('USERS - INDEX');
        $query = User::orderBy('username', 'asc');

        if ($request->get('all') === 'true') {
            return response()->json(['data' => $query->get()]);
        }
        $data = $query->get(); // atau $query->paginate();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        Log::info('USERS - STORE PAYLOAD', $request->all());
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' butuh field 'password_confirmation'
            'keterangan' => 'nullable|string',
            'token' => 'nullable|string|max:100', // Jika token diisi manual
        ]);

        if ($validator->fails()) {
            Log::error('USERS - STORE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        // Password sudah otomatis di-hash oleh $casts['password' => 'hashed'] di Model
        // Jika tidak menggunakan $casts, hash manual:
        // $validatedData['password'] = Hash::make($validatedData['password']);
        Log::info('USERS - STORE VALIDATED (password will be hashed by model cast)', $validatedData);


        try {
            $user = User::create($validatedData);
            Log::info('USERS - STORE SUCCESS', ['id' => $user->userId]);
            // Jangan kirim password kembali, bahkan yang sudah di-hash
            $user->makeHidden('password'); // Pastikan password tidak ikut dalam respons
            return response()->json(['data' => $user, 'message' => 'User berhasil ditambahkan'], 201);
        } catch (\Exception $e) {
            Log::critical('USERS - STORE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menyimpan data user.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function show(User $user)
    {
        Log::info('USERS - SHOW', ['id' => $user->userId]);
        $user->makeHidden('password');
        return response()->json(['data' => $user]);
    }

    public function update(Request $request, User $user)
    {
        Log::info('USERS - UPDATE PAYLOAD', ['id' => $user->userId, 'payload' => $request->all()]);
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users,username,' . $user->userId . ',userId',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->userId . ',userId',
            'password' => 'nullable|string|min:8|confirmed', // Password opsional saat update
            'keterangan' => 'nullable|string',
            'token' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            Log::error('USERS - UPDATE VALIDATION FAILED', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        Log::info('USERS - UPDATE VALIDATED', $validatedData);

        // Hanya update password jika diisi
        if (!empty($validatedData['password'])) {
            // Password akan di-hash otomatis oleh $casts di Model
            // Jika tidak, hash manual: $validatedData['password'] = Hash::make($validatedData['password']);
        } else {
            unset($validatedData['password']); // Jangan update password jika field dikosongkan
        }

        try {
            $user->update($validatedData);
            Log::info('USERS - UPDATE SUCCESS', ['id' => $user->userId]);
            $user->makeHidden('password');
            return response()->json(['data' => $user, 'message' => 'User berhasil diperbarui']);
        } catch (\Exception $e) {
            Log::critical('USERS - UPDATE EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat memperbarui data user.', 'error_detail' => $e->getMessage()], 500);
        }
    }

    public function destroy(User $user)
    {
        Log::info('USERS - DESTROY', ['id' => $user->userId]);
        try {
            // Tambahkan logika jika user ini tidak boleh dihapus (misal, admin utama)
            // if ($user->isAdmin() && Auth::id() === $user->userId) {
            //     return response()->json(['message' => 'Anda tidak dapat menghapus akun sendiri.'], 403);
            // }
            $user->delete(); // Akan soft delete jika model menggunakan SoftDeletes
            Log::info('USERS - DESTROY SUCCESS', ['id' => $user->userId]);
            return response()->json(['message' => 'User berhasil dihapus']);
        } catch (\Exception $e) {
            Log::critical('USERS - DESTROY EXCEPTION', ['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
            return response()->json(['message' => 'Server error saat menghapus user.', 'error_detail' => $e->getMessage()], 500);
        }
    }
}