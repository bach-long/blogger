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
                    $imageName = time().$request->user()->id.$image->getClientOriginalName();
                    $image->move(public_path('images/'), $imageName);
                    $imageCreated =  Image::create([
                        'img_link' => asset('images/'.$imageName),
                        'user_id' =>  $request->user()->id,
                    ]);
                    array_push($name, $imageCreated);
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

    public function deleteImage(Request $request) {
        try {
            if ($request->has('deleted')) {
                foreach ($request->deleted as $file) {
                    $data = json_decode($file);
                    if($data->name !== 'blank-avatar.jpg'){ 
                        if (File::exists(public_path('images/'.$data->name))) {
                            File::delete(public_path('images/'.$data->name));
                        }
                    }
                }
            }
            Image::find($request->id)->delete();
        } catch (Exception $err) {
            return response([
                'success' => false,
                'message' => $err->getMessage(),
            ]);
        }
    }
}
