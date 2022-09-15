<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Models\Image;
use Exception;

class UploadController extends Controller
{
    //
    public function handleUpload(Request $request) {
        //$image = $request->images;
        //$image->move(public_path('images/'), $image->getClientOriginalName());
        ////$name = time().rand(1, 100).$image->getClientOriginalName();
        ////$image->move(public_path('images/'), $name);
        //return response()->json([
        //    'data' => $image->getClientOriginalName(),
        //]);
        try {
            if ($request->hasFile('images')) {
                $name = [];
                foreach ($request->file('images') as $image) {
                    $imageName = $image->getClientOriginalName();
                    $image->move(public_path('images/'), $imageName);
                    array_push($name, asset('images/'.$imageName));
                    Image::create([
                        'img_link' => asset('images/'.$imageName),
                        'user_id' =>  $request->userId,
                    ]);
                }
                return response()->json([
                    'data' => $name
                ]);
            } else {
                return response()->json([
                    'message' => 'request error'
                ]);
            }
        } catch (Exception $err) {
            return response()->json([
                'message' => $err->getMessage()
            ]);
        }
        
    }
}
