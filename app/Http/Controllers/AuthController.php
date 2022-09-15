<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    //

    public function signup(Request $request) {
        $avatar = 'http://127.0.0.1:8000/images/blank-avatar.jpg';
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imageName = $image->getClientOriginalName();
                $image->move(public_path('images/'), $imageName);
                $avatar =  asset('images/'.$imageName);
            }
        } 
        if (!User::where('username', $request->username)->orWhere('email', $request->email)->exists()) {
            $user = new User();
            $user->avatar = $avatar;
            $user->username = $request->username;
            $user->password = $request->password;
            $user->email = $request->email;
            $user->company = $request->company;
            $user->date_birth = $request->dateBirth;
            $user->save();

            $token = $user->createToken('secret')->plainTextToken;
            return response()->json([
                'success' => true,
                'message' => 'Sign up Successfully',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Username or Email has been taken, choose another'
            ]);
        }
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'username/email' => 'required|string',
            'password' => 'required|string',
        ]);
        $user = User::where('username', $fields['username/email'])->orWhere('email', $fields['username/email'])->first();
        if (!$user || $fields['password'] !== $user->password) {
            return response()->json([
                'success' => false,
                'message' => 'Incorrect username or password',
            ], 400);
        }
        $user->tokens()->delete();
        $token = $user->createToken('secret')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login Successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ]);
    }

    public function logout(Request $request)
    {
            $request->user()->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout Successfully',
            ]);

        return response()->json([
            'success' => false,
            'message' => 'Logout False',
        ], 400);
    }
}