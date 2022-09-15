<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Article;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    //
    public function search(Request $request) {
        try {
            $articles = [];
            if($request->categoryId) {
                $articles = Category::find($request->categoryId)->articles()->where('title', 'like', '%'.$request->searchValue.'%')->orderBy('view_count', 'DESC')->get();
            } else {
                $articles = Article::where('title', 'like', '%'.$request->searchValue.'%')->orderBy('view_count', 'DESC')->get();
            }
            //$users = User::where('username', 'like', '%'.$request->searchValue.'%')->orWhere('email', 'like', '%'.$request->searchValue.'%')->orderBy('view_count')->get();
            return response()->json([
                'data' => ['articles' => $articles],
                'message' => 'success'
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
        
    }
}
