<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    //
    public function getArticles($userId) {
        try {
            $articles = User::find($userId)->articles()->with('comments', 'author', 'view', 'bookmark')->paginate(6);
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
                $articles = $user->bookmark()->with('comments', 'author', 'category', 'view', 'bookmark')->paginate(6);
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
    
    public function getInfo($id, Request $request) {
        try {
            $user = User::find($id);
            $isFollowing = false;
            if($request->header('authorization') && $request->header('authorization') !== 'Bearer null') {
                $mainUser = PersonalAccessToken::findToken(substr($request->header('authorization'),7))->tokenable;
                $isFollowing = $mainUser->following()->where('following_id', $user->id)->exists();
            }
            if($user) {
                $user->view;
                $user->following = $user->following()->orderBy('id', 'DESC')->get();
                $user->followers = $user->followers()->orderBy('id', 'DESC')->get();
                $user->images = $user->images()->orderBy('id', 'DESC')->get();
                $user->isFollowing = $isFollowing;
                return response()->json([
                    'data' => $user,
                    'message' => 'success',
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
        $dataCreate = null;
        $dataRead = null;
        try {
            $user = User::find($id);
            $categories = Category::all();
            foreach($categories as $category) {
                $count = $category->articles()->where('user_id', $id)->count();
                $dataCreate[$category->name] = $count;
            }
            $readData = $user->view->groupBy('category_id');
            foreach( $readData as $key) {
                $count = count($key);
                $dataRead[$key[0]->category->name] = $count;
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
        if($request->header('authorization') && $request->header('authorization') !== 'Bearer null'){
            $user = PersonalAccessToken::findToken(substr($request->header('authorization'),7));
            if($user) {
                return response()->json([
                    'success' => true,
                    'data' => $user->tokenable
                ]);
            } else {
                return response()->json([
                    'success' => false
                ]);
            }
        } else {
            return response()->json([
                'success' => false
            ]);
        }
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

    public function comment(Request $request) {
        try {
            $user = $request->user();
            $comment = Comment::create([
                'user_id'=>$user->id,
                'article_id'=>$request->articleId,
                'content'=>$request->content,
                'parent_id'=>$request->has('parentId') ? $request->parentId : null , 
                'reply_id' => $request->has('replyId') ? $request->replyId : null]);
                $comment->user;
                $comment->childs;
            return response()->json([
                'data' => $comment,
                'message'=> 'commented'
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }

    }

    public function editComment(Request $request) {
        $comment = Comment::find($request->id);
        if($comment) {
            $comment->content = $request->content;
            $comment->save();
            return response()->json([
                'success' => true,
                'message' => 'edited'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'error'
            ]);
        }
    }

    public function deleteComment($commentId) {
        
        if (Comment::find($commentId)->delete()) {
            return response()->json([
                'success' => true,
                'message' => 'comment deleted'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'not found'
            ], 404);
        }
    }

    public function getAllNotifications(Request $request) {
        $user = $request->user();
        $data = $user->receives;
        return $data; 
    }

    public function softDeletedArticles($id) {
        try {
            $user = User::find($id);
            if($user) {
                $articles = $user->articles()->onlyTrashed()->with('comments', 'author', 'category', 'view', 'bookmark')
                ->orderBy('deleted_at', 'DESC')->paginate(6);
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

}
