<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use Exception;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\File;

class ArticleController extends Controller
{
    //
    public function getAll(Request $request) {
        try {
            $articles=Article::with('comments', 'author', 'category', 'view', 'bookmark')->orderBy('id', 'DESC')->paginate(6);
            return response()->json([
                'data' => $articles,
                'message' => 'success'
            ], 200);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function getRecentArticles() {
        try {
            $articles = Article::with('author')->limit(3)->orderBy('id', 'DESC')->get();
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

    public function getById($id, Request $request) {
        try {
            $article = Article::find($id);
            if($article) {
                $isLiked = -1;
                $isBookmarked = false;
                $authorFollowed = false;
                $viewed = false;
                if($request->header('authorization') && $request->header('authorization') !== 'Bearer null') {
                    $user = PersonalAccessToken::findToken(substr($request->header('authorization'),7))->tokenable;
                    if($user) {
                        $article->view()->attach($user->id);
                        $viewed = true;
                        if($article->likes()->where('user_id', $user->id)->exists()) {
                            $isLiked =  $article->likes()->where('user_id', $user->id)->first()->pivot->value;
                        } 
                        $isBookmarked = $article->bookmark()->where('user_id', $user->id)->exists();
                        $authorFollowed = $user->following()->where('following_id', $article->author->id)->exists();
                    }
                }
                $article->view_count++;
                $article->save();
                $article->comments;
                $article->author;
                $article->category;
                $article->view;
                $article->bookmark;
                return response()->json([
                    'success' => true,
                    'data' => $article,
                    'message' => 'success',
                    'isLike' => $isLiked,
                    'isBookmarked'=> $isBookmarked,
                    'authorFollowed' => $authorFollowed,
                    'likeCount' => $article->likes()->where('value', 1)->count(),
                    'dislikeCount' => $article->likes()->where('value', 0)->count(),
                    'viewed' => $viewed
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Article not found'
                ], 404);
            }
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function getMostViewedArticles() {
        try {
            $articles = Article::with('comments', 'author', 'category', 'view', 'bookmark')->limit(10)->orderBy('view_count', 'DESC')->get();
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

    public function getRelatedArticles($categoryId) {
        try{
            $category = Category::find($categoryId);
            $articles = $category->articles()->with('comments', 'author', 'category', 'view', 'bookmark')->limit(10)->get();
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

    public function createArticle(Request $request) {
        try {
            $thumbnail = '';
            foreach ($request->file('images') as $image) {
                $imageName = time().$request->user()->id.$image->getClientOriginalName();
                $image->move(public_path('images/'), $imageName);
                $thumbnail =  asset('images/'.$imageName);
            }
            $article = new Article();
            $article->title = $request->title;
            $article->category_id = $request->category_id;
            $article->thumbnail = $thumbnail;
            $article->content = $request->content;
            $article->user_id = $request->user_id;
            if ($article->save()) {
                return response() -> json([
                    'success' => true,
                    'data' => $article,
                    'message' => 'success'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Can not create Article'
                ]);
            }
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function editArticle(Request $request) {
        try {
            $article = Article::find($request->articleId);
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time().$request->user()->id.$image->getClientOriginalName();
                    $image->move(public_path('images/'), $imageName);
                    $thumbnail =  asset('images/'.$imageName);
                    $article->thumbnail = $thumbnail;
                }
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
            $article->title = $request->title;
            $article->content = $request->content;
            $article->category_id = $request->categoryId;
            $article->save();
            return response()->json([
                'success' => true,
                'message' => 'edit success',
            ]);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage(),
            ]);
        }
    }

    private function getChilds($comment) {
        if(count($comment->childs) == 0) {
            $comment->user;
            return;
        } else {
            $comment->user;
            $comment->childs;
            foreach($comment->childs as $child) {
                $this->getChilds($child);
            }
        }
    }

    public function getComments($articleId) {
        $comments = [];
        try {
            $data = Comment::where('parent_id', null)->where('article_id', $articleId)->orderBy('id', 'DESC')->get();
            foreach($data as $comment) {
                    $comment->user;
                    $comment->childs;
                    foreach($comment->childs as $child) {
                        $this->getChilds($child);
                    }
                    array_push($comments, $comment);
            }
            return response()->json([
                'data' => [ 'data' => $comments, 'total' => $data->count()],
                'message' => 'success',
            ], 200);
        } catch (Exception $err) {
            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function softDeleteArticle($id) {
        $article = Article::find($id);
        if($article) {
            $article->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'article deleted'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'not found'
            ], 404); 
        }
    } 

    public function restore($id) {
        $article = Article::onlyTrashed()->find($id);
        if($article) {
            $article->restore();
            return response()->json([
                'success' => true,
                'data' => $article,
                'message' => 'succeeded'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'not found'
            ], 404);
        }
    }
}
