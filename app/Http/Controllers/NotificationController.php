<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Exception;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    //
    public function notify(Request $request) {
        try{
            $user = $request->user();
            $data = Notification::create([
                'sender_id' => $user->id,
                'receiver_id' => $request->receiverId,
                'type' => $request->type,
                'article_id' => $request->articleId
            ]);
            $data->sender;
            return response()->json([
                'data' => $data,
                'message'=>'success'
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success'=>false,
                'message'=>$err->getMessage()
            ]);
        }
    }
}
