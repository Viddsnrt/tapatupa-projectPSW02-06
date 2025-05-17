<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you can configure the settings for Cross-Origin Resource Sharing
    | or "CORS". This determines crucial security headers to Prevent
    | browser access to your API from Kknown Origins.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Pastikan 'api/*' ada di sini

    'allowed_methods' => ['*'], // Mengizinkan semua method (GET, POST, PUT, DELETE, OPTIONS, dll.)

    'allowed_origins' => [
        'http://localhost:5173', // <-- TAMBAHKAN URL FRONTEND REACTMU DI SINI
        // 'http://localhost:3000', // Jika kamu juga pakai port 3000
        // 'http://127.0.0.1:5173', // Mungkin perlu ini juga
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Mengizinkan semua header

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // <-- SET INI KE TRUE jika kamu menggunakan Sanctum dengan cookie

];