<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        for($i = 1; $i < 11; $i++) {
            DB::table('users')->insert([
                'username' => Str::random(10),
                'password' => Str::random(10),
                'date_birth' => "2002-12-19",
                'company' => 'vnu',
                'avatar' => 'http://127.0.0.1:8000/images/blank-avatar.jpg',
                'email' => Str::random(10).'@gmail.com',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }
    }
}
