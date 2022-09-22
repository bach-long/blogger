<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Exception;
use PhpParser\Node\Expr;

class CategoryController extends Controller
{
    //
    public function getAll(Request $request) {
        try {
            return response()->json([
                'data' => Category::all(),
                'message' => 'success'
            ], 200);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }
    
    public function getArticlesByCategoryId($categoryId) {
        try{
            $category = Category::find($categoryId);
            $articles = $category->articles()->with('comments', 'author', 'category', 'view', 'bookmark')->orderBy('id', 'DESC')->paginate(6);
            if($articles) {
                return response()->json([
                    'data' => ['articles' => $articles, 'category' => $category],
                    'message' => 'success'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'not found'
                ], 404);
            }
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    } 
}