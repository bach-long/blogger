<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UserController extends Controller
{
    //
    public function getArticles($userId) {
        try {
            $articles = User::find($userId)->articles()->with('comments', 'author', 'view', 'bookmark')->paginate(5);
            if($articles) {
                return response()->json([
                    'data' => $articles,
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

    public function getBookmark($id) {
        try {
            $user = User::find($id);
            if($user) {
                $articles = $user->bookmark()->paginate(5);
                foreach($articles as $article) {
                    $article->comments;
                    $article->author;
                    $article->view;
                    $article->category;
                    $article->bookmark;
                }
                return response()->json([
                    'data' => $articles,
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
    
    public function getInfo($id) {
        try {
            $user = User::find($id);
            if($user) {
                $user->view;
                $user->following;
                $user->followers;
                return response()->json([
                    'data' => $user,
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

    public function statistic($id) {
        $dataCreate = [];
        $dataRead = [];
        try {
            $user = User::find($id);
            $categories = Category::all();
            foreach($categories as $category) {
                $count = $category->articles()->where('user_id', $id)->count();
                array_push($dataCreate, ['name' => $category->name, 'count' => $count]);
            }
            $readData = $user->view->groupBy('category_id');
            foreach( $readData as $key) {
                $count = count($key);
                array_push($dataRead, ['name'=>$key[0]->category->name, 'count'=>$count]);
            }
            return response()->json([
                'data' => ['create' => $dataCreate, 'read' => $dataRead],
                'message' => 'success'
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function toggleBookmark(Request $request) {
        try {
            $user = User::find($request->userId);
            $user->bookmark()->toggle($request->articleId);
            return response()->json([
                'success' => true,
                'message' => 'Success'
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function toggleFollow(Request $request) {
        try {
            $user = User::find($request->userId);
            $user->following()->toggle($request->followingId);
            return response()->json([
                'success' => true,
                'message' => 'Success'
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function me(Request $request) {
        $user =  $request->user();
        $user->likes;
        $user->bookmark;
        $user->view;
        $user->following;
        $user->followers;
        return $user;
    }

    public function editProfile(Request $request) {
        try {
            $avatar = 'http://127.0.0.1:8000/images/blank-avatar.jpg';
            $user = $request->user();
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = $image->getClientOriginalName();
                    $image->move(public_path('images/'), $imageName);
                    $avatar =  asset('images/'.$imageName);
                    $user->avatar = $avatar;
                }
            } else {
                $user->avatar = $avatar;
            }
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
            $user->username = $request->username;
            $user->email = $request->email;
            $user->company = $request->company;
            $user->date_birth = $request->dateBirth;
            $user->save();
            return response()->json([
                'data' => $user
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage(),
            ]);
        }
    }

    public function toggleLike(Request $request) {
        try {
            $user = $request->user();
            $article = Article::find($request->articleId);
            if($request->value == -1) {
                $user->likes()->detach($request->articleId);
            } else {
                if($user->likes()->where('article_id', $request->articleId)->exists()) {
                    $user->likes()->updateExistingPivot($request->articleId, ['value' => $request->value]);
                } else {
                    $user->likes()->attach($request->articleId, ['value' => $request->value]);
                }
            }
            return response()->json([
                'success' => true,
                'message' => 'Success',
                'data' => ['likeCount'=>$article->likes()->where('value', 1)->count(), 'dislikeCount' => $article->likes()->where('value', 0)->count()]
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

}
